import { useParams, useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import "./index.css";

export default function QuestionDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const formUrl =
        location.state?.url || `https://docs.google.com/forms/d/${id}/viewform`;
    const title = location.state?.title || "アンケート";

    return (
        <div className="qr-detail-container">
            <h2 className="qr-title">{title}</h2>
            <div className="qr-box">
                <QRCode
                    value={formUrl}
                    size={420}
                    fgColor="var(--color-black)"
                    className="qr-code"
                />
            </div>
            <div className="qr-buttons">
                <button onClick={() => window.open(formUrl, "_blank")}>
                    リンクを開く
                </button>
                <button onClick={() => navigate(-1)}>一覧に戻る</button>
            </div>
        </div>
    );
}
