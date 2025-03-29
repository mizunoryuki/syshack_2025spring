import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            provider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // 🔽 accessToken を取得
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;

            localStorage.setItem("accessToken", accessToken);

            // 🔽 App に渡す
            onLogin({ user, accessToken });

            navigate("/top");
        } catch (error) {
            console.error("ログイン失敗:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">ログイン</h2>
                <button className="login-button" onClick={handleLogin}>
                    Googleでログイン
                </button>
            </div>
        </div>
    );
}