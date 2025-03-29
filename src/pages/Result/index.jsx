import ResultGraph from "../../components/elements/ResultGraph";
import ResultText from "../../components/elements/ResultText";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";
import { useState, useEffect } from "react";
import Modal from "../../components/elements/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import { calcMaxVolume } from "../../utils/calcMaxVolumeAndPeakTime";
import { calcExcitedLevel } from "../../utils/calcExcitedLevel";
import { saveEvent } from "../../firebase/firebaseConfig"; // Firebaseの保存関数をインポート
import { auth } from "../../firebase"; // 認証情報をインポート

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // モーダル開閉を管理
  const [isSave, setIsSave] = useState(false); // 履歴の保存を管理
  const [isSaving, setIsSaving] = useState(false); // 保存処理中の状態管理
  const [saveError, setSaveError] = useState(null); // 保存エラーの管理
  const [data, setData] = useState({
    volumeArray: [],
    maxdB: 0,
    peakTime: 0,
    excitedLevel: 0,
    title: "",
  });

  useEffect(() => {
    const data = location.state;
    const { maxdB, peakTime } = calcMaxVolume(data.volume);
    const excitedLevel = calcExcitedLevel(data.volume);
    console.log(excitedLevel);
    setData({
      ...data,
      volumeArray: data.volume,
      maxdB: maxdB,
      peakTime: peakTime,
      excitedLevel: excitedLevel,
    });
  }, [location]);

  // データを Firestore に保存する関数
  const handleSaveToFirestore = async () => {
    // タイトルが未入力の場合はモーダルを表示
    if (!data.title) {
      setIsOpen(true);
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      // ログインユーザーの確認
      const user = auth.currentUser;
      if (!user) {
        alert("データを保存するにはログインが必要です");
        navigate("/login");
        return;
      }

      // Firestore用にデータを整形
      const eventData = {
        event: data.title,
        maxdB: data.maxdB,
        peak: formatPeakTime(data.peakTime), // 秒数を "分:秒" 形式に変換
        excitedLevel: data.excitedLevel,
        dBArray: data.volumeArray,
      };

      // Firestoreにデータを保存
      const docId = await saveEvent(eventData);
      console.log("保存されたドキュメントID:", docId);

      // 保存完了メッセージの表示
      alert("データが保存されました！");
      setIsSave(true);
    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
      setSaveError(error.message);
      alert("保存に失敗しました: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 秒数を "分:秒" 形式に変換する関数
  const formatPeakTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // タイトル入力後の処理
  const handleModalSave = async (title) => {
    // データにタイトルを設定
    setData((prev) => ({ ...prev, title }));
    setIsSave(true); // 保存済みフラグをセット
    setIsOpen(false); // モーダルを閉じる

    // Firestoreにデータを保存（ここが重要）
    try {
      setIsSaving(true);

      // Firestore用にデータを整形（タイトルを含む最新の状態）
      const eventData = {
        event: title, // 入力されたタイトルを使用
        maxdB: data.maxdB,
        peak: formatPeakTime(data.peakTime),
        excitedLevel: data.excitedLevel,
        dBArray: data.volumeArray,
      };

      // Firestoreにデータを保存
      const docId = await saveEvent(eventData);
      console.log("保存されたドキュメントID:", docId);

      // 保存完了メッセージの表示
      alert("データが保存されました！");
    } catch (error) {
      console.error("データの保存中にエラーが発生しました:", error);
      alert("保存に失敗しました: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="result-container">
      {isOpen && (
        <Modal
          setIsOpen={setIsOpen}
          setData={(newData) => {
            setData(newData);
            // タイトルが設定されたらFirestoreに保存
            if (newData.title) {
              handleSaveToFirestore();
            }
          }}
          setIsSave={setIsSave}
          onSave={handleModalSave} // 保存処理を追加
        />
      )}
      <Title
        title={"結果閲覧"}
        text={isSave ? "" : "保存"}
        clickFunction={() => (isSave ? null : setIsOpen(true))}
      />
      <div
        className="result-box"
        style={{
          height: "60%",
        }}
      >
        <div className="result-left">
          <ResultGraph className="result-left" volumeData={data.volumeArray} />
        </div>
        <div className="result-right">
          <ResultText title={"イベント名"} content={data.title} />
          <ResultText type="volume" title={"最高音量"} content={data.maxdB} />
          <ResultText
            type="timer"
            title={"ピーク時間"}
            content={data.peakTime}
          />
          <ResultText
            type="excited"
            title={"盛り上がり度"}
            content={data.excitedLevel}
          />
        </div>
      </div>
      <div
        className="result-buttons-container"
        style={{
          height: "10%",
        }}
      >
        <Button
          logotype="measure"
          text={"もう一度測定"}
          Clickfunction={() => navigate("/measure")}
        />
        <Button
          logotype="home"
          text={"ホーム"}
          Clickfunction={() => navigate("/top")}
        />
        <Button
          logotype="question"
          text={"アンケート"}
          Clickfunction={() => navigate("/question")}
        />
      </div>
    </div>
  );
}
