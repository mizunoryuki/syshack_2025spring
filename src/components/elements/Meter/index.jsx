import { useState } from "react";
import Button from "../Button";
import MeasureText from "../MeasureText";
import "./index.css";
import useCountTime from "../../../hooks/timerhook";
export default function Meter({ isdone, setIsdone }) {
    const { count, isRunning, startTimer, finishMeasure } = useCountTime();

    const handleFinishTimer = () => {
        finishMeasure();
        setIsdone(true);
    };

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
                <MeasureText type="timer" title={"時間"} content={count} />
                {/* 時間をcontentで指定して表示(1秒ごと) */}
            </div>
            <div className="measure-button">
                {!isdone ? (
                    <Button
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
