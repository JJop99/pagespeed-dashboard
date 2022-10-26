import { Navigate, Route, Routes } from "react-router-dom";
import Audit from "./components/audit/Audit";
import Dashboard from "./components/dashboard/Dasboard";
import SignIn from "./components/sign-in/SignIn";
import Layout from "./components/Layout/Layout";
import NewUrl from "./components/new-url/NewUrl";
import SignUp from "./components/sign-up/SignUp";
import Home from "./components/home/Home";
import PerformanceHistory from "./components/history/PerformanceHistory";

const Application = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/sign-in" replace />}/>
                   
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/new-url" element={<NewUrl />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />

                <Route path="/audit" element={<Audit />} />
                <Route path="/dashboard/:dashboardId" element={<Dashboard />} />
                <Route path="/history/:historyId" element={<PerformanceHistory />} />

            </Routes>
        </Layout>
    );
};
export default Application;
