import { Routes, Route, Navigate } from "react-router-dom";
import Top from "../pages/Top";
import Measure from "../pages/Measure";
import Result from "../pages/Result";
import NotFound from "../pages/Notfound";
import Question from "../pages/Question";
import QuestionDetail from "../pages/QuestionDetail";
import Record from "../pages/record";
import ResultDetail from "../pages/ResultDetail";
import LoginPage from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
export default function Router({ user, onLogin, forms, onLogout }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage onLogin={onLogin} />} />

            {/* 👇 ここから下はログインしないと見れない */}
            <Route
                path="/top"
                element={
                    <PrivateRoute user={user}>
                        <Top user={user} forms={forms} onLogout={onLogout} />
                    </PrivateRoute>
                }
            />
            <Route
                path="/measure"
                element={
                    <PrivateRoute user={user}>
                        <Measure />
                    </PrivateRoute>
                }
            />
            <Route
                path="/result"
                element={
                    <PrivateRoute user={user}>
                        <Result />
                    </PrivateRoute>
                }
            />
            <Route
                path="/question"
                element={
                    <PrivateRoute user={user}>
                        <Question forms={forms} />
                    </PrivateRoute>
                }
            />
            <Route
                path="/question/:id"
                element={
                    <PrivateRoute user={user}>
                        <QuestionDetail />
                    </PrivateRoute>
                }
            />
            <Route
                path="/record"
                element={
                    <PrivateRoute user={user}>
                        <Record />
                    </PrivateRoute>
                }
            />
            <Route
                path="/record/:id"
                element={
                    <PrivateRoute user={user}>
                        <ResultDetail />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
