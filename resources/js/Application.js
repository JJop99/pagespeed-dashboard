import { Route, Routes } from "react-router-dom";
import Audit from "./components/audit/Audit";
import Dashboard from "./components/dashboard/Dasboard";
import Example from "./components/Example";
import List from "./components/list/List";
import SignIn from "./components/sign-in/SignIn";

const Application = () => {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/list" element={<List />} />
        </Routes>
    );
};
export default Application;
