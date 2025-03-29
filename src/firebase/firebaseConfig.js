// 必要なSDKから使用する機能をインポート
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// Firestore の機能をインポート
import {
  getFirestore,
  collection,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  runTransaction,
  doc,
  onSnapshot,
  where,
} from "firebase/firestore";

// Firebase Authentication は外部ファイルからインポート
import { auth } from "../firebase";

// あなたのウェブアプリのFirebase設定
// Firebase JS SDK v7.20.0以降の場合、measurementIdは任意です
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
const app = initializeApp(firebaseConfig);

// Analyticsの初期化
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.log("firestoreはサポートされていません");
  }
});

export { app, analytics };

// ここから下の認証関連の関数はすべて削除（auth関連機能）
// ※ 削除部分は省略

// Firestore インスタンスの生成
const db = getFirestore(app);

/**
 * イベント情報を "events" コレクションに保存する関数
 *
 * イベント情報のフォーマット:
 * {
 *   event: string,        // イベント名
 *   maxdB: number,        // 最高音量
 *   peak: string,         // ピーク時間 (例 "3:14")
 *   excitedLevel: number, // 盛り上がり度
 *   dBArray: number[],    // 音量を格納する配列
 * }
 * 日付は自動的にサーバー側のタイムスタンプで追加されます。
 */
export async function saveEvent(eventData) {
  try {
    // 現在ログインしているユーザーを取得
    const user = auth.currentUser;

    // ユーザーがログインしていない場合はエラーを投げる
    if (!user) {
      throw new Error("ユーザーがログインしていません。");
    }

    const eventRef = doc(collection(db, "events"));
    await runTransaction(db, async (transaction) => {
      transaction.set(eventRef, {
        ...eventData,
        userId: user.uid, // ユーザーIDを追加
        date: serverTimestamp(),
      });
    });
    console.log("トランザクションが成功しました！ドキュメントID:", eventRef.id);
    return eventRef.id;
  } catch (e) {
    console.error("トランザクション中にエラーが発生しました:", e);
    throw e;
  }
}

// Firestoreからログインユーザー自身のイベントデータのみ取得する関数
export async function getEvents() {
  try {
    // 現在ログインしているユーザーを取得
    const user = auth.currentUser;

    // ユーザーがログインしていない場合は空の配列を返す
    if (!user) {
      console.warn("ユーザーがログインしていません。データを取得できません。");
      return [];
    }

    // ログインユーザーのイベントのみをクエリで取得
    const eventsQuery = query(
      collection(db, "events"),
      // ユーザーIDでフィルタリング
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(eventsQuery);
    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return events;
  } catch (error) {
    console.error("ドキュメントの取得中にエラーが発生しました:", error);
    return [];
  }
}

// Firestoreからログインユーザー自身のイベントデータをリアルタイムで取得する関数
export function subscribeToEvents(callback) {
  // 現在ログインしているユーザーを取得
  const user = auth.currentUser;

  // ユーザーがログインしていない場合
  if (!user) {
    console.warn(
      "ユーザーがログインしていません。データをサブスクライブできません。"
    );
    callback([]); // 空の配列を返す
    return () => {}; // ダミーの解除関数
  }

  // ログインユーザーのイベントのみをサブスクライブ
  const eventsQuery = query(
    collection(db, "events"),
    where("userId", "==", user.uid),
    orderBy("date", "desc")
  );

  const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(events);
  });

  return unsubscribe;
}