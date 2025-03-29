import "./index.css";
import Button from "../../components/elements/Button";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function Top({ onLogout }) { // ← props で onLogout を受け取る
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);       // Firebaseからログアウト
            onLogout();                // App.jsx 側の user/accessToken をリセット
            navigate("/login");       // ログイン画面へ
        } catch (error) {
            console.error("ログアウト失敗:", error);
        }
    };

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

            <div className="top-logout">
                <Button
                    logotype={"logout"}
                    text={"ログアウト"}
                    Clickfunction={handleLogout}
                />
            </div>
        </div>
    );
}
