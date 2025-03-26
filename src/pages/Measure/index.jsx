import Meter from "../../components/elements/Meter";
import Title from "../../components/elements/Title";
import "./index.css";

export default function Measure() {
    return (
        <div
            className="measure-container"
            style={{
                height: "60%",
            }}
        >
            <Title title={"音量測定"} text={"結果を表示"} />
            <Meter />
        </div>
    );
}
