import "./index.css";
import { IoMicOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { MdTimelapse } from "react-icons/md";
import { TbHome } from "react-icons/tb";

const SIZE = 22; //アイコンサイズの指定
const LOGO_MAP = {
    measure: <IoMicOutline className="icon" size={SIZE} />,
    question: <HiOutlineClipboardList className="icon" size={SIZE} />,
    record: <MdTimelapse className="icon" size={SIZE} />,
    home: <TbHome className="icon" size={SIZE} />,
};

//logotype: "measure" | "question" | "record" | "home",
export default function Button({ logotype = "", text, Clickfunction }) {
    return (
        <button className="button-container" onClick={Clickfunction}>
            {logotype && LOGO_MAP[logotype]}
            <p>{text}</p>
        </button>
    );
}
