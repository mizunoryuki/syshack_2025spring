import { Routes, Route } from "react-router-dom";
import Top from "../pages/Top";
import Measure from "../pages/Measure";
import Result from "../pages/Result";
import NotFound from "../pages/Notfound";
import Question from "../pages/Question";
export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Top />} />
            {/* <Route path="/a" element={<SignUp />} /> */}
            <Route path="/measure" element={<Measure />} />
            <Route path="/result" element={<Result />} />
            <Route path="/question" element={<Question />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
