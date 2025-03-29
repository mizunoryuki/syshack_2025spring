import "./App.css";
import { useState, useEffect } from "react";
import Router from "./routes/routes";

function App() {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [forms, setForms] = useState([]);

    // ログイン後に呼び出す関数
    const handleLogin = ({ user, accessToken }) => {
        setUser(user);
        setAccessToken(accessToken);
    };

    // accessTokenがセットされたらGoogle Driveからフォームを取得
    useEffect(() => {
        const fetchForms = async () => {
            try {
                const res = await fetch(
                    `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.form'&fields=files(id,name)&access_token=${accessToken}`
                );
                const data = await res.json();

                if (data.error) {
                    console.error("❌ フォーム取得失敗:", data);
                    return;
                }

                console.log("✅ フォーム取得成功:", data.files);
                setForms(data.files || []);
            } catch (err) {
                console.error("❌ fetchエラー:", err);
            }
        };

        if (accessToken) {
            fetchForms();
        }
    }, [accessToken]);

    const handleLogout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("forms");
    };

    // ↓ Routerに props を渡す（ログイン状態やforms）
    return (
        <Router user={user} onLogin={handleLogin} forms={forms} onLogout={handleLogout} />
    );
}

export default App;