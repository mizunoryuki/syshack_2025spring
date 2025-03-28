import { useState } from "react";
import Meter from "../../components/elements/Meter";
import Title from "../../components/elements/Title";
import "./index.css";

export default function Measure() {
    const [isdone, setIsdone] = useState(false);
    return (
        <div
            className="measure-container"
            style={{
                height: "60%",
            }}
        >
            <Title title={"音量測定"} text={isdone ? "結果を表示" : ""} />
            <Meter isdone={isdone} setIsdone={setIsdone} />
        </div>
    );
}
