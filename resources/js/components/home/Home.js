import { Fragment } from "react";
import SiteList from "./SiteList";
import TestList from "./TestList";

const Home = () => {
    return <Fragment>
        <TestList />
        <SiteList/>
    </Fragment>;
};

export default Home;
