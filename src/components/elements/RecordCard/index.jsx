import "./index.css";
//interface Props = {
//	date:string??
//	title:string
//	maxdB:number
//	volumeArray=number[]
//	peakTime:number
//	excitedLevel:number
//}
export default function RecordCard({ props }) {
    return (
        <div className="recordCard-container">
            <div className="recordCard-container-header">
                <p className="smallChar">2024-10-13</p>
                <button className="header-button">くわしくみる</button>
            </div>
            <div className="recordCard-container-title">
                <p className="smallChar purpleChar">イベント名</p>
                <p className="bigChar title">
                    趣味LT趣味LT趣味LT趣味LT趣味LT趣味LT趣味LT
                </p>
            </div>
            <div className="recordCard-box">
                <div className="recordcard-box-maxdB">
                    <p className="smallChar purpleChar">最高音量</p>
                    <p className="bigChar">60db</p>
                </div>
                <div className="recordCard-box-peakTime">
                    <p className="smallChar purpleChar">ピーク時間</p>
                    <p className="bigChar">3:14</p>
                </div>
                <div className="recordCard-box-excitedLevel">
                    <p className="smallChar purpleChar">盛り上がり度</p>
                    <p className="bigChar">51</p>
                </div>
            </div>
        </div>
    );
}
