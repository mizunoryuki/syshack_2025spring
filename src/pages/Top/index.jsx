import "./index.css";
import Button from "../../components/elements/Button";
import { useNavigate } from "react-router-dom";

export default function Top() {
    const navigate = useNavigate();
    return (
        <div className="top-container">
            <div className="top-container-box">
                <Button
                    logotype={"measure"}
                    text={"音量測定"}
                    Clickfunction={() => navigate("/measure")}
                />
                <Button
                    logotype={"question"}
                    text={"アンケート"}
                    Clickfunction={() => navigate("/question")}
                />
                <Button
                    logotype={"record"}
                    text={"過去の記録"}
                    Clickfunction={() => navigate("/record")}
                />
            </div>
        </div>
    );
}
