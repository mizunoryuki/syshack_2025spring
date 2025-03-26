import ResultGraph from "../../components/elements/ResultGraph";
import ResultText from "../../components/elements/ResultText";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";
export default function Result() {
    return (
        <div className="result-container">
            <Title title={"結果閲覧"} text={"保存"} />
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
                <Button logotype="measure" text={"もう一度測定"} />
                <Button logotype="home" text={"ホーム"} />
                <Button logotype="question" text={"アンケート"} />
            </div>
        </div>
    );
}
