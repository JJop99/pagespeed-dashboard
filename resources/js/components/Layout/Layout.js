import { Fragment } from "react";
import Container from "./Container";
import classes from "./Layout.module.scss";

import MainNavigation from "./MainNavigation";

const Layout = (props) => {
    return (
        <Fragment>
            <div className={classes.layout}>
                <MainNavigation />
                <Container>{props.children}</Container>
            </div>
        </Fragment>
    );
};

export default Layout;
