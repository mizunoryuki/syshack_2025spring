import { Routes, Route, Navigate } from "react-router-dom";
import Top from "../pages/Top";
import Measure from "../pages/Measure";
import Result from "../pages/Result";
import NotFound from "../pages/Notfound";
import Question from "../pages/Question";
import Record from "../pages/record";
import ResultDetail from "../pages/ResultDetail";
import LoginPage from "../pages/Login";
export default function Router({ user, onLogin, forms }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
            <Route path="/top" element={<Top user={user} forms={forms} />} />
            <Route path="/measure" element={<Measure />} />
            <Route path="/result" element={<Result />} />
            <Route path="/question" element={<Question />} />
            <Route path="/question/:id" element={<Question />} />
            <Route path="/record" element={<Record />} />
            <Route path="/record/:id" element={<ResultDetail />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
