import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../../components/elements/Title";
import ResultGraph from "../../components/elements/ResultGraph";
import ResultText from "../../components/elements/ResultText";
import Button from "../../components/elements/Button";
import "./index.css";
export default function ResultDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState({
        title: "趣味LT",
        maxdB: 50,
        peakTime: 300,
        excitedLevel: 51,
        volumeArray: [
            {
                index: 1,
                volume: 40,
            },
            {
                index: 2,
                volume: 30,
            },
            {
                index: 3,
                volume: 20,
            },
            {
                index: 4,
                volume: 27,
            },
            {
                index: 5,
                volume: 18,
            },
            {
                index: 6,
                volume: 23,
            },
            {
                index: 7,
                volume: 34,
            },
        ],
    });
    useEffect(() => {
        setData({
            title: location.state.title,
            maxdB: location.state.maxdB,
            peakTime: location.state.peakTime,
            excitedLevel: location.state.excitedLevel,
            volumeArray: location.state.volumeArray,
        });
    }, [location]);
    return (
        <div className="result-container">
            <Title title={"結果閲覧"} />
            <div
                className="result-box"
                style={{
                    height: "60%",
                }}
            >
                <div className="result-left">
                    <ResultGraph className="result-left" />
                </div>
                <div className="result-right">
                    <ResultText title={"イベント名"} content={data.title} />
                    <ResultText
                        type="volume"
                        title={"最高音量"}
                        content={data.maxdB}
                    />
                    <ResultText
                        type="timer"
                        title={"ピーク時間"}
                        content={data.peakTime}
                    />
                    <ResultText
                        type="excited"
                        title={"盛り上がり度"}
                        content={data.excitedLevel}
                    />
                </div>
            </div>
            <div
                className="result-button"
                style={{
                    height: "10%",
                }}
            >
                <Button
                    text={"一覧にもどる"}
                    Clickfunction={() => navigate(-1)}
                />
            </div>
        </div>
    );
}
