import { useState } from "react";
import Meter from "../../components/elements/Meter";
import Title from "../../components/elements/Title";
import "./index.css";
import { useNavigate } from "react-router-dom";
import useCountTime from "../../hooks/timerhook";

export default function Measure() {
    const navigate = useNavigate();
    const [isdone, setIsdone] = useState(false);
    const { count, isRunning, dBArray, startTimer, finishMeasure, showdB } =
        useCountTime();

    const handleFinishTimer = () => {
        finishMeasure();
        setIsdone(true);
    };
    return (
        <div
            className="measure-container"
            style={{
                width: "100%",
                height: "60%",
            }}
        >
            <Title
                title={"音量測定"}
                text={isdone ? "結果を表示" : ""}
                clickFunction={() =>
                    navigate("/result", {
                        state: { time: count, volume: dBArray },
                    })
                }
            />
            <Meter
                isdone={isdone}
                isRunning={isRunning}
                showdB={showdB}
                count={count}
                onStart={startTimer}
                onFinish={handleFinishTimer}
            />
        </div>
    );
}
