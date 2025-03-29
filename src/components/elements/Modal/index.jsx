import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Modal({ setIsOpen, setData, setIsSave, onSave }) {
  const Navigate = useNavigate();
  const [text, setText] = useState("");
  const [isFill, setIsFill] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = () => {
    if (text) {
      // タイトル入力があれば
      if (onSave) {
        // onSave関数を優先的に呼び出す（これが Firestore 保存処理を含む）
        onSave(text);
      } else {
        // 旧来の挙動は残しておく（onSave がない場合のフォールバック）
        setData((prev) => ({ ...prev, title: text }));
        setIsSave(true);
        setIsOpen(false);
      }
    } else {
      setIsFill(true);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-box">
        <h2 className="modal-box-title">タイトルを入力</h2>
        <p className="modal-box-warning">
          {isFill && "テキストを入力してください"}
        </p>
        <input
          placeholder="タイトル"
          className="modal-box-input"
          value={text}
          onChange={(e) => handleChange(e)}
        />
        <div className="modal-box-buttons">
          <button className="button-cancel" onClick={() => setIsOpen(false)}>
            キャンセル
          </button>
          <button className="button-save" onClick={handleClick}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
