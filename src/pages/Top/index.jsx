import "./index.css";
import Button from "../../components/elements/Button";

export default function Top() {
    const handleCLick = () => {
        console.log("Click");
    };

    return (
        <div className="top-container">
            <div className="top-container-box">
                <Button
                    logotype={"measure"}
                    text={"音量測定"}
                    Clickfunction={handleCLick}
                />
                <Button
                    logotype={"question"}
                    text={"アンケート"}
                    Clickfunction={handleCLick}
                />
                <Button
                    logotype={"record"}
                    text={"過去の記録"}
                    Clickfunction={handleCLick}
                />
            </div>
        </div>
    );
}
