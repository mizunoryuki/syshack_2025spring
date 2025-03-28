import "./index.css";
export default function MeasureText({ type = "", title, content = "" }) {
    if (type === "volume") {
        return (
            <div className="measureText-container">
                <p className="title">{title}</p>
                <p className="content volume">{content}</p>
            </div>
        );
    } else if (type === "timer") {
        const min = Math.floor(content / 60);
        const sec = String(content % 60).padStart(2, "0");

        return (
            <div className="measureText-container">
                <p className="title">{title}</p>
                <p className="content">
                    {min}:{sec}
                </p>
            </div>
        );
    }
}
