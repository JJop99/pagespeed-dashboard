import { Fragment } from "react";
import SiteList from "./SiteList";
import TestList from "./TestList";

const Audits = () => {
    return <Fragment>
        <TestList />
        <SiteList/>
    </Fragment>;
};

export default Audits;