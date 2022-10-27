import { Navigate, Route, Routes } from "react-router-dom";
import Audit from "./components/audit/Audit";
import Dashboard from "./components/dashboard/Dasboard";
import SignIn from "./components/sign-in/SignIn";
import Layout from "./components/Layout/Layout";
import NewUrl from "./components/new-url/NewUrl";
import SignUp from "./components/sign-up/SignUp";
import Home from "./components/home/Home";
import PerformanceHistory from "./components/history/PerformanceHistory";
import PageNotFound from "./components/404";
import { useContext } from "react";
import AuthContext from "./store/auth-context";

const Application = () => {
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/sign-in" replace />} />

                {!isLoggedIn && <Route path="/sign-in" element={<SignIn />} />}
                {isLoggedIn && <Route path="/sign-in" element={<Navigate to="/home" replace />} />}
                <Route path="/new-url" element={<NewUrl />} />
                <Route path="/home" element={<Home />} />
                {!isLoggedIn && <Route path="/sign-up" element={<SignUp />} />}
                {isLoggedIn && <Route path="/sign-up" element={<Navigate to="/home" replace />} />}

                <Route path="/audit" element={<Audit />} />
                <Route path="/dashboard/:dashboardId" element={<Dashboard />} />
                <Route
                    path="/history/:historyId"
                    element={<PerformanceHistory />}
                />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Layout>
    );
};
export default Application;
