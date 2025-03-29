import { memo } from "react";
import Button from "../Button";
import MeasureText from "../MeasureText";
import "./index.css";

const Meter = ({ isdone, isRunning, showdB, count, onStart, onFinish }) => {
    return (
        <div className="meter-container">
            <p>音量メーター</p>
            <div className="volume-container">
                <div
                    className="volume-meter"
                    style={{
                        width: `${Math.min(showdB, 100)}%`,
                        backgroundColor:
                            showdB <= 40
                                ? `var(--color-green-2)`
                                : showdB <= 80
                                ? `var(--color-purple)`
                                : `var(--color-green-3)`,
                    }}
                ></div>
            </div>
            <div className="measure-text-container">
                <MeasureText type="volume" title="音量" content={showdB} />
                <MeasureText type="timer" title="時間" content={count} />
            </div>
            <div className="measure-button">
                {!isdone && (
                    <Button
                        logotype={isRunning ? "stop" : "start"}
                        text={isRunning ? "計測停止" : "計測開始"}
                        Clickfunction={isRunning ? onFinish : onStart}
                    />
                )}
            </div>
        </div>
    );
};

// 🎯 memo化して不要な再レンダリングを防ぐ
export default memo(Meter);
