import Meter from "../../components/elements/Meter";
import Title from "../../components/elements/Title";
import "./index.css";

export default function Measure() {
    return (
        <div className="measure-container">
            <Title title={"音量測定"} text={"結果を表示"} />
            <Meter />
        </div>
    );
}
