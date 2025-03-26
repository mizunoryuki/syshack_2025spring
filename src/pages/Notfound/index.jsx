import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>ページが存在いたしません</h1>
            <button onClick={() => navigate("/")}>Homeへ戻る</button>
        </div>
    );
}
