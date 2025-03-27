import "./index.css";
// interface Props = {
// title: string;
// url:string;
// }
export default function QuestionCard({ props }) {
    const { title, url } = props;
    return (
        <div className="questionCard-container">
            <div className="questionCard-left">
                <p className="questionCard-container-title">{title}</p>
                <div className="questionCard-container-button-container">
                    <button className="questionCard-container-button">
                        くわしくみる
                    </button>
                </div>
            </div>
            <div className="questionCard-center"></div>
            <div className="questionCard-right">
                <div className="questionCard-container-url"></div>
            </div>
        </div>
    );
}
