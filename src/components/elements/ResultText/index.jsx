import "./index.css";
export default function ResultText({ type = "", title, content }) {
    if (type === "volume") {
        return (
            <div className="resultText-container">
                <p className="resultText-title">{title}</p>
                <p className="resultText-content volume">{content}</p>
            </div>
        );
    } else if (type === "timer") {
        const min = Math.floor(content / 60);
        const sec = String(content % 60).padStart(2, "0");
        return (
            <div className="resultText-container">
                <p className="resultText-title">{title}</p>
                <p className="resultText-content">
                    {min}:{sec}
                </p>
            </div>
        );
    } else if (type === "excited") {
        return (
            <div className="resultText-container">
                <p className="resultText-title">{title}</p>
                <p className="resultText-content">{content}</p>
            </div>
        );
    } else {
        return (
            <div className="resultText-container">
                <p className="resultText-title">{title}</p>
                <p className="resultText-content-noneType">{content}</p>
            </div>
        );
    }
}
