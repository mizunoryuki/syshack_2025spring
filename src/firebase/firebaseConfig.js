// 必要なSDKから使用する機能をインポート
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // isSupported を追加
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

// あなたのウェブアプリのFirebase設定
// Firebase JS SDK v7.20.0以降の場合、measurementIdは任意です
const firebaseConfig = {
  apiKey: "AIzaSyCQVI7JQIqHZbQPhWvj7OKtTVvDM4lKJDw",
  authDomain: "buzztalk-d0484.firebaseapp.com",
  projectId: "buzztalk-d0484",
  storageBucket: "buzztalk-d0484.firebasestorage.app",
  messagingSenderId: "566397443750",
  appId: "1:566397443750:web:434a8b32ca05a17395de67",
  measurementId: "G-XGFH94VMVR",
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// Analyticsの初期化（サポートされている場合のみ）
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.log("firestoreはサポートされていません");
  }
});

export { app, analytics };

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
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      date: serverTimestamp(),
    });
    console.log("ドキュメントが追加されました:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("ドキュメントの追加中にエラーが発生しました:", e);
  }
}

// Firestoreからイベントデータを取得する関数
export async function getEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
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
