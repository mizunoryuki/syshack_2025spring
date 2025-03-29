import { useState, useEffect } from "react";
import RecordCard from "../../components/elements/RecordCard";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getEvents } from "../../firebase/firebaseConfig";
import "./index.css";

/**
 * 記録閲覧画面コンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * 1. ユーザーが保存した過去のイベントデータの一覧表示
 * 2. ログイン状態に応じた条件付き表示
 *
 * @returns {JSX.Element} 記録閲覧画面
 */
export default function Record() {
  const navigate = useNavigate();
  // ======== 状態管理 ========
  const [records, setRecords] = useState([]); // Firestoreから取得したイベントデータを保存
  const [loading, setLoading] = useState(true); // データ読み込み中の状態管理
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ユーザーのログイン状態管理

  /**
   * ======== ユーザー認証状態の監視とデータ取得 ========
   * コンポーネントがマウントされたときに実行される
   * 1. Firebase Authのログイン状態をリッスン
   * 2. ログイン中ならデータ取得、未ログインなら空データを表示
   */
  useEffect(() => {
    // Firebase Authの認証状態変更リスナーを設定
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // ユーザーがログインしている場合
        setIsLoggedIn(true);
        fetchEvents(); // Firestoreからデータを取得
      } else {
        // ユーザーがログインしていない場合
        setIsLoggedIn(false);
        setLoading(false);
        setRecords([]); // データをクリア
        console.log("ユーザーがログインしていません。");
      }
    });

    // コンポーネントのアンマウント時にリスナーを解除（メモリリーク防止）
    return () => unsubscribe();
  }, []);

  /**
   * ======== Firestoreデータ取得関数 ========
   * ログインユーザーのイベントデータをFirestoreから取得し、
   * 表示用に整形してstateにセットする
   */
  const fetchEvents = async () => {
    try {
      setLoading(true); // 読み込み状態を開始
      // Firestoreから現在ログインユーザーのデータのみを取得
      const eventsData = await getEvents();
      console.log("取得したイベントデータ:", eventsData);

      // Firestoreから取得したデータを表示用に変換
      const formattedRecords = eventsData.map((record) => {
        // タイムスタンプをDate型に変換
        const dateObj = record.date
          ? new Date(record.date.seconds * 1000)
          : null;

        // YYYY-MM-DD形式に整形
        const formattedDate = dateObj
          ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(dateObj.getDate()).padStart(2, "0")}`
          : "日付なし";

        // RecordCardコンポーネントに表示する形式にデータを整形
        return {
          id: record.id, // ドキュメントID（詳細表示などに使用）
          date: formattedDate, // 整形済み日付
          title: record.event || "タイトルなし", // イベント名（未設定時はデフォルト値）
          maxdB: record.maxdB || 0, // 最高音量
          volumeArray: record.dBArray || [], // 音量配列（グラフ表示用）
          // ピーク時間の文字列を秒数に変換（グラフ表示用）
          peakTime: record.peak
            ? typeof record.peak === "string"
              ? convertTimeToSeconds(record.peak)
              : record.peak
            : 0,
          excitedLevel: record.excitedLevel || 0, // 盛り上がり度
        };
      });

      setRecords(formattedRecords); // 整形したデータをセット
    } catch (error) {
      console.error("データの取得中にエラーが発生しました:", error);
    } finally {
      setLoading(false); // 読み込み状態を終了
    }
  };

  /**
   * ======== 時間文字列変換関数 ========
   * "3:50"のような時間文字列を秒数に変換する
   *
   * @param {string} timeString - 分:秒形式の時間文字列
   * @returns {number} 変換後の秒数
   */
  const convertTimeToSeconds = (timeString) => {
    if (!timeString) return 0;
    const parts = timeString.split(":");
    if (parts.length === 2) {
      // 分:秒形式の場合
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    // 数値のみの場合
    return parseInt(timeString);
  };

  // ======== 未ログイン時の表示 ========
  if (!isLoggedIn) {
    return (
      <div>
        <Title title={"記録閲覧"} />
        <div
          className="not-logged-in"
          style={{ textAlign: "center", margin: "2rem" }}
        >
          <h3>ログインが必要です</h3>
          <p>記録を閲覧するにはログインしてください。</p>
          <Button
            text={"ログインページへ"}
            Clickfunction={() => navigate("/login")}
          />
        </div>
      <div className="question-button">
        <Button
          logotype={"home"}
          text={"ホーム"}
          Clickfunction={() => navigate("/top")}
        />
      </div>
      </div>
    );
  }

  // ======== データ読み込み中の表示 ========
  if (loading) {
    return (
      <div>
        <Title title={"記録閲覧"} />
        <div style={{ textAlign: "center", margin: "2rem" }}>
          <p>データを読み込み中です...</p>
        </div>
      </div>
    );
  }

  // ======== メインコンテンツの表示 ========
  return (
    <div>
      {/* タイトル */}
      <Title title={"記録閲覧"} />

      {/* 記録カードのグリッド表示領域 */}
      <div className="record-box">
        {records.length > 0 ? (
          // データがある場合：RecordCardコンポーネントでマップ表示
          records.map((element, index) => (
            <RecordCard props={element} elemKey={index} key={index} />
          ))
        ) : (
          // データがない場合：メッセージを表示
          <div
            style={{
              gridColumn: "1 / -1", // グリッド全体にまたがる
              textAlign: "center",
              padding: "2rem",
              margin: "1rem",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            <p>
              記録がありません。測定を行って結果を保存すると、ここに表示されます。
            </p>
          </div>
        )}
      </div>

      {/* ホームに戻るボタン */}
      <div className="question-button">
        <Button
          logotype={"home"}
          text={"ホーム"}
          Clickfunction={() => navigate("/top")}
        />
      </div>
    </div>
  );
}
