import Button from "../Button";
import MeasureText from "../MeasureText";
import "./index.css";
import useCountTime from "../../../hooks/timerhook";
export default function Meter({ isdone, setIsdone }) {
    const { count, isRunning, avgdB, startTimer, finishMeasure, showdB } =
        useCountTime();

    const handleFinishTimer = () => {
        finishMeasure();
        localStorage.setItem(
            "data",
            JSON.stringify({ time: count, volume: avgdB })
        );
        console.log("save to localstorage");
        setIsdone(true);
    };

    return (
        <div className="meter-container">
            <p>音量メーター</p>
            <div className="volume-container">
                <div
                    className="volume-meter"
                    style={{
                        width: `${Math.min(showdB, 100)}%`,
                    }}
                ></div>
            </div>
            <div className="measure-text-container">
                <MeasureText type="volume" title={"音量"} content={showdB} />
                {/* 音量をcontentで指定して表示 */}
                <MeasureText type="timer" title={"時間"} content={count} />
                {/* 時間をcontentで指定して表示(1秒ごと) */}
            </div>
            <div className="measure-button">
                {!isdone ? (
                    <Button
                        logotype={isRunning ? "stop" : "start"}
                        text={isRunning ? "計測停止" : "計測開始"}
                        Clickfunction={() =>
                            isRunning ? handleFinishTimer() : startTimer()
                        }
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
