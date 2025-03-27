import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
export default function Modal({ setIsOpen, setTitle }) {
    const Navigate = useNavigate();
    const [text, setText] = useState("");

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleClick = () => {
        setTitle(text);
        Navigate("/record"); //過去の履歴に遷移
    };
    return (
        <div className="modal-container">
            <div className="modal-box">
                <h2 className="modal-box-title">タイトルを入力</h2>
                <p className="modal-box-warning">テキストを入力してください</p>
                <input
                    placeholder="タイトル"
                    className="modal-box-input"
                    value={text}
                    onChange={(e) => handleChange(e)}
                />
                <div className="modal-box-buttons">
                    <button
                        className="button-cancel"
                        onClick={() => setIsOpen(false)}
                    >
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
