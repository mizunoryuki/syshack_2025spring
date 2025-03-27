import { Routes, Route } from "react-router-dom";
import Top from "../pages/Top";
import Measure from "../pages/Measure";
import Result from "../pages/Result";
import Record from "../pages/record";
import NotFound from "../pages/Notfound";

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Top />} />
            <Route path="/measure" element={<Measure />} />
            <Route path="/result" element={<Result />} />
            <Route path="/record" element={<Record />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
