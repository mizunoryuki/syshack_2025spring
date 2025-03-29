import { useState, useEffect } from "react";
import RecordCard from "../../components/elements/RecordCard";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase"; // Firebase認証を追加
import { getEvents, saveEvent } from "../../firebase/firebaseConfig"; // saveEventも追加
import "./index.css";

export default function Record() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]); // Firestoreから取得したデータを保存
  const [loading, setLoading] = useState(true); // ロード状態を管理
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理

  // デバッグ用フォームの状態
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [maxDb, setMaxDb] = useState("");
  const [peakTime, setPeakTime] = useState("");
  const [excitedLevel, setExcitedLevel] = useState("");
  const [dbArray, setDbArray] = useState("");

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    // ログイン状態をチェック
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchEvents(); // ログイン中ならデータを取得
      } else {
        setIsLoggedIn(false);
        setLoading(false);
        setRecords([]); // ログアウト時はデータをクリア
        console.log("ユーザーがログインしていません。");
      }
    });

    // クリーンアップ関数でリスナーを解除
    return () => unsubscribe();
  }, []);

  // Firestoreからデータを取得する関数
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents();
      console.log("取得したイベントデータ:", eventsData);

      // APIから取得したデータを表示用に変換
      const formattedRecords = eventsData.map((record) => {
        const dateObj = record.date
          ? new Date(record.date.seconds * 1000)
          : null;
        const formattedDate = dateObj
          ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(dateObj.getDate()).padStart(2, "0")}`
          : "日付なし";

        return {
          id: record.id, // IDも保存しておく
          date: formattedDate,
          title: record.event || "タイトルなし",
          maxdB: record.maxdB || 0,
          volumeArray: record.dBArray || [],
          peakTime: record.peak
            ? typeof record.peak === "string"
              ? convertTimeToSeconds(record.peak)
              : record.peak
            : 0,
          excitedLevel: record.excitedLevel || 0,
        };
      });

      setRecords(formattedRecords);
    } catch (error) {
      console.error("データの取得中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  // "3:50"のような文字列を秒数に変換する関数
  const convertTimeToSeconds = (timeString) => {
    if (!timeString) return 0;
    const parts = timeString.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return parseInt(timeString);
  };

  // Firebase データを保存する関数
  const handleSave = async () => {
    // 入力された音量配列を数値配列に変換
    const dbArrayParsed = dbArray.split(",").map(Number);

    // 保存するイベントデータのオブジェクトを作成
    const eventData = {
      event: eventName,
      maxdB: Number(maxDb),
      peak: peakTime,
      excitedLevel: Number(excitedLevel),
      dBArray: dbArrayParsed,
    };

    try {
      // 現在ログインしているユーザーを取得
      const user = auth.currentUser;

      // userIDをコンソールに出力
      if (user) {
        console.log("現在のユーザーID:", user.uid);
      } else {
        console.warn("ユーザーがログインしていません。");
        return; // 早期リターン
      }

      // Firebaseにデータを保存
      const docId = await saveEvent(eventData);
      alert(`データが保存されました！ID: ${docId}`);
      // フォームをリセット
      setEventName("");
      setMaxDb("");
      setPeakTime("");
      setExcitedLevel("");
      setDbArray("");
      setShowForm(false);
      // データを再取得
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

  // ログインしていない場合はログインを促す
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

  // ローディング中の表示
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

  return (
    <div>
      <Title
        title={"記録閲覧"}
        text={showForm ? "" : "デバッグ追加"}
        clickFunction={() => setShowForm(!showForm)}
      />

      {/* デバッグ用入力フォーム */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <label>
              イベント名:
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              最高音量:
              <input
                type="number"
                value={maxDb}
                onChange={(e) => setMaxDb(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              ピーク時間(例: 3:50):
              <input
                type="text"
                value={peakTime}
                onChange={(e) => setPeakTime(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

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

          {/* サンプルデータボタン */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <Button
              text={"サンプルデータを入力"}
              Clickfunction={() => {
                setEventName("サンプルコンサート");
                setMaxDb("120");
                setPeakTime("5:30");
                setExcitedLevel("10");
                setDbArray(
                  Array.from({ length: 100 }, (_, i) => 100 + i).join(",")
                );
              }}
            />
          </div>
        </div>
      )}

      <div className="record-box">
        {records.length > 0 ? (
          records.map((element, index) => (
            <RecordCard props={element} elemKey={index} key={index} />
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
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
