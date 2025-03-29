/**
 * Firebaseの設定と操作関数
 *
 * このファイルでは、Firebase Firestoreとの接続設定および
 * イベントデータの保存・取得・リアルタイム購読機能を提供します。
 * ユーザー認証関連の機能は別ファイル（firebase.js）に定義されています。
 */

// 必要なSDKから使用する機能をインポート
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firestore の機能をインポート
import {
  getFirestore,
  collection,
  serverTimestamp, // サーバー側のタイムスタンプを使用するため
  query, // クエリ作成
  orderBy, // 並べ替え
  getDocs, // ドキュメント取得
  runTransaction, // トランザクション処理
  doc, // ドキュメント参照
  onSnapshot, // リアルタイム更新リスナー
  where, // クエリ条件
} from "firebase/firestore";

// Firebase Authentication は外部ファイルからインポート
import { auth } from "../firebase";

// Firebaseプロジェクト設定
// この設定情報は、Firebaseコンソールから取得できます
const firebaseConfig = {
  apiKey: "AIzaSyDCTTpjLtI8H6qbm1xeehQzLuZgMvCVm6A",
  authDomain: "qrtest-77295.firebaseapp.com",
  projectId: "qrtest-77295",
  storageBucket: "qrtest-77295.firebasestorage.app",
  messagingSenderId: "598967892397",
  appId: "1:598967892397:web:6c0ef987086402942ec924",
  measurementId: "G-3G0RBH5SL1",
};

// Firebaseの初期化
// アプリ全体で共通のFirebaseインスタンスを使用
const app = initializeApp(firebaseConfig);

// Firebase Analyticsの初期化
// サポートされていない環境では無効化
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.log("Firebase Analyticsはこの環境ではサポートされていません");
  }
});

export { app, analytics };

// Firestore データベースインスタンスの作成
const db = getFirestore(app);

/**
 * イベント情報を "events" コレクションに保存する関数
 *
 * この関数は、ログインユーザーのイベントデータを保存します。
 * トランザクションを使用して、データの整合性を保証します。
 *
 * @param {Object} eventData - 保存するイベントデータ
 * @param {string} eventData.event - イベント名
 * @param {number} eventData.maxdB - 最高音量（デシベル）
 * @param {string} eventData.peak - ピーク時間（例: "3:14"）
 * @param {number} eventData.excitedLevel - 盛り上がり度（1〜10）
 * @param {number[]} eventData.dBArray - 時間経過による音量データの配列
 * @returns {Promise<string>} 保存されたドキュメントのID
 * @throws {Error} ユーザー未ログインエラーまたはトランザクション失敗エラー
 */
export async function saveEvent(eventData) {
  try {
    // ログインユーザーIDの取得
    const user = auth.currentUser;

    // 未ログイン時のエラーハンドリング
    if (!user) {
      throw new Error("ユーザーがログインしていません。");
    }

    // 新しいドキュメント参照を作成（自動ID生成）
    const eventRef = doc(collection(db, "events"));

    // トランザクションでデータを安全に保存
    await runTransaction(db, async (transaction) => {
      transaction.set(eventRef, {
        ...eventData,
        userId: user.uid, // ユーザーIDを追加（セキュリティとクエリ用）
        date: serverTimestamp(), // サーバー側のタイムスタンプを使用
      });
    });

    console.log("トランザクションが成功しました！ドキュメントID:", eventRef.id);
    return eventRef.id;
  } catch (e) {
    console.error("トランザクション中にエラーが発生しました:", e);
    throw e; // エラーを呼び出し元に伝播
  }
}

/**
 * Firestoreからログインユーザー自身のイベントデータを取得する関数
 *
 * この関数は、現在ログインしているユーザーのイベントデータのみを取得します。
 * 日付の新しい順にソートされます。
 *
 * @returns {Promise<Array>} イベントデータの配列。ログインしていない場合は空配列。
 */
export async function getEvents() {
  try {
    // ログインユーザーIDの取得
    const user = auth.currentUser;

    // 未ログイン時は空配列を返す
    if (!user) {
      console.warn("ユーザーがログインしていません。データを取得できません。");
      return [];
    }

    // ユーザー固有のデータのみを取得するクエリを作成
    // このクエリには複合インデックス(userId + date)が必要です
    const eventsQuery = query(
      collection(db, "events"), // eventsコレクションを対象
      where("userId", "==", user.uid), // 現在のユーザーのデータのみ
      orderBy("date", "desc") // 日付の降順（新しい順）
    );

    // クエリを実行してデータを取得
    const querySnapshot = await getDocs(eventsQuery);

    // 取得したデータを配列に変換
    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id, // ドキュメントIDを追加
      ...doc.data(), // ドキュメントの内容を展開
    }));

    return events;
  } catch (error) {
    console.error("ドキュメントの取得中にエラーが発生しました:", error);
    return []; // エラー時は空配列を返す
  }
}

/**
 * イベントデータをリアルタイムで監視する関数
 *
 * Firestoreの変更をリアルタイムで監視し、データが更新されるたびに
 * コールバック関数を呼び出します。
 *
 * @param {Function} callback - データが更新されたときに呼び出される関数
 * @returns {Function} 監視を停止するための関数
 */
export function subscribeToEvents(callback) {
  // ログインユーザーIDの取得
  const user = auth.currentUser;

  // 未ログイン時の処理
  if (!user) {
    console.warn(
      "ユーザーがログインしていません。データをサブスクライブできません。"
    );
    callback([]); // 空配列をコールバックに渡す
    return () => {}; // ダミーの解除関数を返す
  }

  // ユーザー固有のデータのみを監視するクエリを作成
  const eventsQuery = query(
    collection(db, "events"),
    where("userId", "==", user.uid),
    orderBy("date", "desc")
  );

  // リアルタイムリスナーを設定
  // データが変更されるたびにcallbackが呼び出される
  const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(events); // コールバック関数にデータを渡す
  });

  // 監視を停止するための関数を返す
  return unsubscribe;
}
