import RecordCard from "../../components/elements/RecordCard";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Record() {
    const navigate = useNavigate();
    const test_data = [
        {
            date: "2023-10-15",
            title: "趣味LT趣味LT趣味LT趣味LT趣味LT",
            maxdB: 50,
            volumeArray: [20, 30, 40, 30],
            peakTime: 601,
            excitedLevel: 51,
        },
        {
            date: "2023-10-15",
            title: "趣味LT",
            maxdB: 50,
            volumeArray: [40, 30, 40, 30],
            peakTime: 300,
            excitedLevel: 51,
        },
        {
            date: "2023-10-15",
            title: "趣味LT趣味LT",
            maxdB: 50,
            volumeArray: [20, 30, 40, 30],
            peakTime: 601,
            excitedLevel: 51,
        },
        {
            date: "2023-10-15",
            title: "趣味LT趣味LT趣味LT",
            maxdB: 50,
            volumeArray: [20, 30, 40, 30],
            peakTime: 601,
            excitedLevel: 51,
        },
        {
            date: "2023-10-15",
            title: "趣味LT趣味LT趣味LT趣味LT趣味LT",
            maxdB: 50,
            volumeArray: [20, 30, 40, 30],
            peakTime: 601,
            excitedLevel: 51,
        },
        {
            date: "2023-10-15",
            title: "趣味LT趣味LT趣味LT趣味LT趣味LT",
            maxdB: 50,
            volumeArray: [20, 30, 40, 30],
            peakTime: 601,
            excitedLevel: 51,
        },
        {
            date: "2023-10-15",
            title: "趣味LT趣味LT趣味LT趣味LT趣味LT",
            maxdB: 50,
            volumeArray: [20, 30, 40, 30],
            peakTime: 601,
            excitedLevel: 51,
        },
    ];
    return (
        <div>
            <Title title={"記録閲覧"} />
            <div className="record-box">
                {test_data.map((element, index) => {
                    return (
                        <RecordCard
                            props={element}
                            elemKey={index}
                            key={index}
                        />
                    );
                })}
            </div>
            <div className="rocord-button">
                <Button
                    logotype={"home"}
                    text={"ホーム"}
                    Clickfunction={() => navigate("/")}
                />
            </div>
        </div>
    );
}
