import { IoIosArrowDropright } from "react-icons/io";

import "./index.css";
const SIZE = 18;
export default function Title({ title, text }) {
    return (
        <div className="title-container">
            <h1>{title}</h1>
            <button className="title-button">
                <p>{text}</p>
                <IoIosArrowDropright className="button-icon" size={SIZE} />
            </button>
        </div>
    );
}
