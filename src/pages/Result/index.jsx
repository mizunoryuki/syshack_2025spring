import ResultGraph from "../../components/elements/ResultGraph";
import ResultText from "../../components/elements/ResultText";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";
import { useEffect, useState } from "react";
import Modal from "../../components/elements/Modal";
import { useLocation, useNavigate } from "react-router-dom";
export default function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [data, setData] = useState({
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
        console.log(location.state);
        setData({
            maxdB: location.state.maxdB,
            peakTime: location.state.peakTime,
            excitedLevel: location.state.excitedLevel,
            volumeArray: location.state.volumeArray,
        });
    }, [location]);

    return (
        <div className="result-container">
            {isOpen ? (
                <Modal setIsOpen={setIsOpen} setTitle={setTitle} />
            ) : (
                <></>
            )}
            <Title
                title={"結果閲覧"}
                text={"保存"}
                clickFunction={() => setIsOpen(true)}
            />
            <div
                className="result-box"
                style={{
                    height: "60%",
                }}
            >
                <div className="result-left">
                    <ResultGraph
                        className="result-left"
                        volumeData={data.volumeArray}
                    />
                </div>
                <div className="result-right">
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
                className="result-buttons-container"
                style={{
                    height: "10%",
                }}
            >
                <Button
                    logotype="measure"
                    text={"もう一度測定"}
                    Clickfunction={() => navigate("/measure")}
                />
                <Button
                    logotype="home"
                    text={"ホーム"}
                    Clickfunction={() => navigate("/")}
                />
                <Button
                    logotype="question"
                    text={"アンケート"}
                    Clickfunction={() => navigate("/question")}
                />
            </div>
        </div>
    );
}
