import { Route, Routes } from "react-router-dom";
import Audit from "./components/audit/Audit";
import Dashboard from "./components/dashboard/Dasboard";
import SiteList from "./components/SiteList";
import List from "./components/list/List";
import SignIn from "./components/sign-in/SignIn";
import Layout from "./components/Layout/Layout";

const Application = () => {
   
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<SiteList />} />

                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/list" element={<List />} />
            </Routes>
        </Layout>
    );
};
export default Application;
