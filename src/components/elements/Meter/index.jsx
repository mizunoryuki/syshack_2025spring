import Button from "../Button";
import MeasureText from "../MeasureText";
import "./index.css";
export default function Meter() {
    return (
        <div className="meter-container">
            <p>音量メーター</p>
            <div className="volume-container">
                <div
                    className="volume-meter"
                    style={{
                        width: "20%",
                    }}
                ></div>
            </div>
            <div className="measure-text-container">
                <MeasureText type="volume" title={"音量"} content={50} />
                {/* 音量をcontentで指定して表示 */}
                <MeasureText type="timer" title={"時間"} content={300} />
                {/* 時間をcontentで指定して表示(1秒ごと) */}
            </div>
            <div className="measure-button">
                <Button
                    text={"測定開始"}
                    Clickfunction={() => console.log("測定を開始")}
                />
            </div>
        </div>
    );
}
