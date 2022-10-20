import { Navigate, Route, Routes } from "react-router-dom";
import Audit from "./components/audit/Audit";
import Dashboard from "./components/dashboard/Dasboard";
import SiteList from "./components/site-list/SiteList";
import SignIn from "./components/sign-in/SignIn";
import Layout from "./components/Layout/Layout";
import NewUrl from "./components/new-url/NewUrl";

const Application = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/sign-in" replace />}/>
                   
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/new-url" element={<NewUrl />} />
                <Route path="/site-list" element={<SiteList />} />

                <Route path="/audit" element={<Audit />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Layout>
    );
};
export default Application;
