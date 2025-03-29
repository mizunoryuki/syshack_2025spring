import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import "./index.css";
// interface Props = {
// title: string;
// url:string;
// }
export default function QuestionCard({ props }) {
    const navigate = useNavigate();

    const extractFormId = (url) => {
        const match = url.match(/\/d\/(.+?)\//);
        return match ? match[1] : null;
    };

    return (
        <div className="questionCard">
            <div className="card-left">
                <div className="card-title">{props.title}</div>
                <button
                    className="questionCard-button"
                    onClick={() =>
                        navigate(`/question/${extractFormId(props.url)}`, {
                            state: {
                                title: props.title,
                                url: props.url,
                            },
                        })
                    }
                >
                    くわしくみる
                </button>
            </div>
            <div className="card-divider" />
            <div className="card-right">
                <QRCode value={props.url} size={80} />
            </div>
        </div>
    );
}
