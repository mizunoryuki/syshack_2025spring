import ResultGraph from "../../components/elements/ResultGraph";
import ResultText from "../../components/elements/ResultText";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";
import { useState, useEffect } from "react";
import Modal from "../../components/elements/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import { calcMaxVolume } from "../../utils/calcMaxVolumeAndPeakTime";
export default function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [data, setData] = useState({
        volumeArray: [],
        maxdB: 0,
        peakTime: 0,
        excitedLevel: 0,
        title: "",
    });
    useEffect(() => {
        const data = location.state;
        const { maxdB, peakTime } = calcMaxVolume(data.volume);
        setData({
            ...data,
            volumeArray: data.volume,
            maxdB: maxdB,
            peakTime: peakTime,
            excitedLevel: 50,
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
                    Clickfunction={() => navigate("/top")}
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
