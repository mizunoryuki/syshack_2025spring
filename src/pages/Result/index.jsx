import ResultGraph from "../../components/elements/ResultGraph";
import ResultText from "../../components/elements/ResultText";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";
import { useState } from "react";
import Modal from "../../components/elements/Modal";
import { useNavigate } from "react-router-dom";
export default function Result() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");


    return (
        <div className="result-container">
            {isOpen ? (
                <Modal setIsOpen={setIsOpen} setTitle={setTitle} />
            ) : (
                <></>
            )}
            <Title
                title={"結果閲覧"}
                text={"保存"}
                clickFunction={() => setIsOpen(true)}
            />
            <div
                className="result-box"
                style={{
                    height: "60%",
                }}
            >
                <div className="result-left">
                    <ResultGraph className="result-left" />
                </div>
                <div className="result-right">
                    <ResultText type="volume" title={"最高音量"} content={50} />
                    <ResultText
                        type="timer"
                        title={"ピーク時間"}
                        content={300}
                    />
                    <ResultText
                        type="excited"
                        title={"盛り上がり度"}
                        content={50}
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
                    Clickfunction={() =>navigate("/measure")}
                />
                <Button
                    logotype="home"
                    text={"ホーム"}
                    Clickfunction={() =>navigate("/")}
                />
                <Button
                    logotype="question"
                    text={"アンケート"}
                    Clickfunction={() =>navigate("/question")}
                />
            </div>
        </div>
    );
}
