import { Routes, Route } from "react-router-dom";
import Top from "../pages/Top";
import NotFound from "../pages/Notfound";
export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Top />} />
            {/* <Route path="/a" element={<SignUp />} /> */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
