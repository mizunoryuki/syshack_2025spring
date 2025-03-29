import { IoIosArrowDropright } from "react-icons/io";

import "./index.css";
const SIZE = 18;
export default function Title({ title = "", text = "", clickFunction }) {
    return (
        <div className="title-container">
            <h1>{title && title}</h1>
            {text ? (
                <button className="title-button" onClick={clickFunction}>
                    <p>{text}</p>
                    <IoIosArrowDropright className="button-icon" size={SIZE} />
                </button>
            ) : (
                <></>
            )}
        </div>
    );
}
