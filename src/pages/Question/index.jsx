import { useEffect, useState } from "react";
import QuestionCard from "../../components/elements/QuestionCard";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";

export default function Question() {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const savedForms = localStorage.getItem("forms");
        if (savedForms) {
            setForms(JSON.parse(savedForms));
            setLoaded(true);
        }
    }, []);

    const fetchForms = async () => {
        const accessToken = localStorage.getItem("accessToken"); // または props等で受け取る
        if (!accessToken) {
            console.error("アクセストークンがありません");
            return;
        }

        try {
            const res = await fetch(
                `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.form'&fields=files(id,name)&access_token=${accessToken}`
            );
            const data = await res.json();

            if (data.files) {
                setForms(data.files);
                setLoaded(true);
                localStorage.setItem("forms", JSON.stringify(data.files));
            } else {
                console.error("フォーム取得失敗:", data);
            }
        } catch (err) {
            console.error("fetchエラー:", err);
        }
    };

    return (
        <div>
            <Title
                title={"アンケート"}
                text={"追加"}
                clickFunction={() => {
                    window.open("https://docs.google.com/forms/u/0/", "_blank");
                }}
            />

            {!loaded && (
                <div className="question-load-button">
                    <div className="button">
                        <Button text="フォーム取得" Clickfunction={fetchForms} />
                    </div>
                </div>
            )}
            {loaded && (
                <div className="question-box-container">
                    <div className="question-box">
                        <button className="icon-button refresh-icon" onClick={fetchForms}>
                            <FiRefreshCw size={22} />
                        </button>
                        {forms.map((form, index) => {
                            const element = {
                                title: form.name,
                                url: `https://docs.google.com/forms/d/${form.id}/viewform`,
                            };
                            return (
                                <QuestionCard
                                    props={element}
                                    key={index}
                                    className="question-box-item"
                                />
                            );
                        })}
                    </div>
                </div>
            )}
            <div className="question-button">
                <Button
                    logotype={"home"}
                    text={"ホーム"}
                    Clickfunction={() => navigate("/top")}
                />
            </div>
        </div>
    );
}
