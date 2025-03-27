import RecordCard from "../../components/elements/RecordCard";
import Title from "../../components/elements/Title";
import "./index.css";

export default function Record() {
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
            volumeArray: [20, 30, 40, 30],
            peakTime: 601,
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
                    return <RecordCard props={element} key={index} />;
                })}
            </div>
        </div>
    );
}
