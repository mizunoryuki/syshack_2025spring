// 必要なモジュールやコンポーネントをインポート
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate をインポート
import {
  saveEvent,
  getEvents,
  subscribeToEvents,
} from "../../firebase/firebaseConfig"; // Firebaseにデータを保存する関数
import ResultGraph from "../../components/elements/ResultGraph";
import ResultText from "../../components/elements/ResultText";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";

// 記録閲覧ページのコンポーネント
export default function Record() {
  // 各入力フィールドの状態を管理するためのuseStateフック
  const [eventName, setEventName] = useState(""); // イベント名
  const [maxDb, setMaxDb] = useState(""); // 最高音量
  const [peakTime, setPeakTime] = useState(""); // ピーク時間
  const [excitedLevel, setExcitedLevel] = useState(""); // 盛り上がり度
  const [dbArray, setDbArray] = useState(""); // 音量データの配列（カンマ区切り文字列）
  const [records, setRecords] = useState([]); // 取得したイベントデータのstateを追加
  const navigate = useNavigate();

  // データをFirebaseに保存する関数
  const handleSave = async () => {
    // 入力された音量配列を数値配列に変換
    const dbArrayParsed = dbArray.split(",").map(Number);

    // 保存するイベントデータのオブジェクトを作成
    const eventData = {
      event: eventName, // イベント名
      maxdB: Number(maxDb), // 最高音量（数値に変換）
      peak: peakTime, // ピーク時間
      excitedLevel: Number(excitedLevel), // 盛り上がり度（数値に変換）
      dBArray: dbArrayParsed, // 音量データの配列
    };

    try {
      // Firebaseにデータを保存し、ドキュメントIDを取得
      const docId = await saveEvent(eventData);
      alert(`データが保存されました！ドキュメントID: ${docId}`); // 成功時のアラート
      fetchRecords(); // データ保存後にFirestoreから最新のデータを取得
    } catch (error) {
      // エラー発生時のログ出力
      console.error("データの保存中にエラーが発生しました:", error);
    }
  };

  // Firestoreからイベントデータを取得する関数
  const fetchRecords = async () => {
    const data = await getEvents();
    setRecords(data);
  };
  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      setRecords(data); // リアルタイムでデータを更新
    });

    // クリーンアップ関数で購読を解除
    return () => unsubscribe();
  }, []);

  // ページのレンダリング
  return (
    <div className="record-container">
      {/* ページタイトル */}
      <Title title={"記録閲覧"} text={"保存"} />

      {/* 入力フォーム */}
      <div className="input-container">
        {/* イベント名の入力 */}
        <label>
          イベント名:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </label>

        {/* 最高音量の入力 */}
        <label>
          最高音量:
          <input
            type="number"
            value={maxDb}
            onChange={(e) => setMaxDb(e.target.value)}
          />
        </label>

        {/* ピーク時間の入力 */}
        <label>
          ピーク時間:
          <input
            type="text"
            value={peakTime}
            onChange={(e) => setPeakTime(e.target.value)}
          />
        </label>

        {/* 盛り上がり度の入力 */}
        <label>
          盛り上がり度:
          <input
            type="number"
            value={excitedLevel}
            onChange={(e) => setExcitedLevel(e.target.value)}
          />
        </label>

        {/* 音量データ配列の入力 */}
        <label>
          音量配列 (カンマ区切り):
          <input
            type="text"
            value={dbArray}
            onChange={(e) => setDbArray(e.target.value)}
          />
        </label>

        {/* 保存ボタン */}
        <Button text={"保存"} Clickfunction={handleSave} />
      </div>
      {/* 保存済みデータの一覧 */}
      <div className="record-cards-container">
        {records.map((record) => (
          <div key={record.id} className="record-card">
            {/* 日付 */}
            <p>
              <strong>記録日時:</strong>
              <span>
                {record.date
                  ? new Date(record.date.seconds * 1000).toLocaleString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "未設定"}
              </span>
            </p>
            {/* イベント名 */}
            <p>
              <strong>イベント名:</strong>
              <span>{record.event}</span>
            </p>
            {/* 最高音量、ピーク時間、盛り上がり度を横並びに表示 */}
            <div className="record-card-row">
              <p>
                <strong>最高音量:</strong>
                <span>{record.maxdB}</span>
              </p>
              <p>
                <strong>ピーク時間:</strong>
                <span>{record.peak}</span>
              </p>
              <p>
                <strong>盛り上がり度:</strong>
                <span>{record.excitedLevel}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* ホームに戻るボタン */}
      <div className="home-button-container">
        <Button text={"ホーム"} Clickfunction={() => navigate("/")} />
      </div>
    </div>
  );
}
