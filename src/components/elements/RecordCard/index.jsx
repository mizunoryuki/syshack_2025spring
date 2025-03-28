import { useNavigate } from "react-router-dom";
import "./index.css";
//interface Props = {
//	date:string??
//	title:string
//	maxdB:number
//	volumeArray=number[]
//	peakTime:number
//	excitedLevel:number
//}
export default function RecordCard({ props, elemKey }) {
    const navigate = useNavigate();
    const { date, title, maxdB, peakTime, excitedLevel, volumeArray } = props;
    const min = Math.floor(peakTime / 60);
    const sec = String(peakTime % 60).padStart(2, "0");

    const handleClick = () => {
        navigate(`/record/${elemKey}`, {
            state: {
                title: title,
                maxdB: maxdB,
                peakTime: peakTime,
                excitedLevel: excitedLevel,
                volumeArray: volumeArray,
            },
        });
    };

    return (
        <div className="recordCard-container">
            <div className="recordCard-container-header">
                <p className="smallChar">{date}</p>
                <button className="header-button" onClick={handleClick}>
                    くわしくみる
                </button>
            </div>
            <div className="recordCard-container-title">
                <p className="smallChar purpleChar">イベント名</p>
                <p className="bigChar title">{title}</p>
            </div>
            <div className="recordCard-box">
                <div className="recordcard-box-maxdB">
                    <p className="smallChar purpleChar">最高音量</p>
                    <p className="bigChar db">{maxdB}</p>
                </div>
                <div className="recordCard-box-peakTime">
                    <p className="smallChar purpleChar">ピーク時間</p>
                    <p className="bigChar">
                        {min}:{sec}
                    </p>
                </div>
                <div className="recordCard-box-excitedLevel">
                    <p className="smallChar purpleChar">盛り上がり度</p>
                    <p className="bigChar">{excitedLevel}</p>
                </div>
            </div>
        </div>
    );
}
