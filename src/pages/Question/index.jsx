import QuestionCard from "../../components/elements/QuestionCard";
import Title from "../../components/elements/Title";
import Button from "../../components/elements/Button";
import "./index.css";
import { useNavigate } from "react-router-dom";
export default function Question() {
    const navigate = useNavigate();
    const test_data = [
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想ｱｲｳｴｵﾌｧｲﾌｴｱｵｲｼﾞｭｲ",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
        {
            title: "趣味LT感想",
            url: "https://www.google.com",
        },
    ];
    return (
        <div>
            <Title title={"アンケート"} text={"追加"} />
            <div className="question-container">
                <div className="question-box">
                    {test_data.map((element, index) => {
                        return (
                            <QuestionCard
                                props={element}
                                key={index}
                                className="question-box-item"
                            />
                        );
                    })}
                </div>
                <div className="question-button">
                    <Button
                        logotype={"home"}
                        text={"ホーム"}
                        Clickfunction={() => navigate("/")}
                    />
                </div>
            </div>
        </div>
    );
}
