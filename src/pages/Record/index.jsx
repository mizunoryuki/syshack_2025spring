import { useState, useEffect } from "react";
import RecordCard from "../../components/elements/RecordCard";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getEvents, saveEvent } from "../../firebase/firebaseConfig";
import "./index.css";

/**
 * 記録閲覧画面コンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * 1. ユーザーが保存した過去のイベントデータの一覧表示
 * 2. 新しいイベントデータの手動追加（デバッグ用）
 * 3. ログイン状態に応じた条件付き表示
 *
 * @returns {JSX.Element} 記録閲覧画面
 */
export default function Record() {
  const navigate = useNavigate();
  // ======== 状態管理 ========
  const [records, setRecords] = useState([]); // Firestoreから取得したイベントデータを保存
  const [loading, setLoading] = useState(true); // データ読み込み中の状態管理
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ユーザーのログイン状態管理

  // ======== フォーム入力状態 ========
  const [showForm, setShowForm] = useState(false); // フォーム表示・非表示の切り替え
  const [eventName, setEventName] = useState(""); // イベント名
  const [maxDb, setMaxDb] = useState(""); // 最高音量 (dB)
  const [peakTime, setPeakTime] = useState(""); // ピーク時間 (分:秒)
  const [excitedLevel, setExcitedLevel] = useState(""); // 盛り上がり度 (1-10)
  const [dbArray, setDbArray] = useState(""); // 音量配列 (カンマ区切りテキスト)

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

  /**
   * ======== データ保存処理 ========
   * フォームの入力内容をFirestoreに保存する
   */
  const handleSave = async () => {
    // カンマ区切りテキストを数値配列に変換
    const dbArrayParsed = dbArray.split(",").map(Number);

    // イベントデータオブジェクトの作成
    const eventData = {
      event: eventName, // イベント名
      maxdB: Number(maxDb), // 最高音量を数値化
      peak: peakTime, // ピーク時間
      excitedLevel: Number(excitedLevel), // 盛り上がり度を数値化
      dBArray: dbArrayParsed, // 音量配列
    };

    try {
      // ログインユーザーの確認
      const user = auth.currentUser;

      if (user) {
        console.log("現在のユーザーID:", user.uid);
      } else {
        console.warn("ユーザーがログインしていません。");
        return; // 未ログイン時は処理を中断
      }

      // Firestoreにデータを保存
      const docId = await saveEvent(eventData);
      alert(`データが保存されました！ID: ${docId}`);

      // フォーム入力値をリセット
      setEventName("");
      setMaxDb("");
      setPeakTime("");
      setExcitedLevel("");
      setDbArray("");
      setShowForm(false);

      // データ再取得（タイミングを少し遅らせて確実に反映させる）
      setTimeout(() => {
        fetchEvents();
        // 再取得後のデータをコンソールで確認
        setTimeout(() => {
          console.log("再取得後のrecords:", records);
        }, 500);
      }, 500);
    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
    }
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
        <div className="rocord-button">
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
      {/* タイトルとデータ追加ボタン */}
      <Title
        title={"記録閲覧"}
        text={showForm ? "" : "デバッグ追加"} // フォーム表示中は追加ボタンを非表示
        clickFunction={() => setShowForm(!showForm)} // ボタン押下でフォーム表示を切り替え
      />

      {/* デバッグ用入力フォーム - データを手動で追加するためのUI */}
      {showForm && (
        <div
          className="input-container"
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            margin: "0 auto 20px auto",
            width: "80%",
          }}
        >
          <h3>デバッグ用データ追加</h3>

          {/* 入力フィールド群 - 2カラムレイアウト */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            {/* イベント名入力 */}
            <label>
              イベント名:
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            {/* 最高音量入力 */}
            <label>
              最高音量:
              <input
                type="number"
                value={maxDb}
                onChange={(e) => setMaxDb(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            {/* ピーク時間入力 */}
            <label>
              ピーク時間(例: 3:50):
              <input
                type="text"
                value={peakTime}
                onChange={(e) => setPeakTime(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            {/* 盛り上がり度入力 */}
            <label>
              盛り上がり度:
              <input
                type="number"
                value={excitedLevel}
                onChange={(e) => setExcitedLevel(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
          </div>

          {/* 音量配列入力 - 1カラム */}
          <label style={{ display: "block", marginTop: "15px" }}>
            音量配列 (カンマ区切り):
            <input
              type="text"
              value={dbArray}
              onChange={(e) => setDbArray(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="例: 20,30,45,60,80,50,20"
            />
          </label>

          {/* フォームのアクションボタン */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button
              text={"キャンセル"}
              Clickfunction={() => setShowForm(false)}
            />
            <Button text={"保存"} Clickfunction={handleSave} />
          </div>

          {/* サンプルデータ自動入力ボタン */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Button
              text={"サンプルデータを入力"}
              Clickfunction={() => {
                // サンプルデータを各フィールドに設定
                setEventName("サンプルコンサート");
                setMaxDb("120");
                setPeakTime("5:30");
                setExcitedLevel("10");
                // 100個の連番データを生成（テスト用）
                setDbArray(
                  Array.from({ length: 100 }, (_, i) => 100 + i).join(",")
                );
              }}
            />
          </div>
        </div>
      )}

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
              記録がありません。「デバッグ追加」ボタンからテストデータを追加してください。
            </p>
          </div>
        )}
      </div>

      {/* ホームに戻るボタン */}
      <div className="rocord-button">
        <Button
          logotype={"home"}
          text={"ホーム"}
          Clickfunction={() => navigate("/top")}
        />
      </div>
    </div>
  );
}
