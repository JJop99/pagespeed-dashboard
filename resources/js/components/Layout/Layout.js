import axios from "axios";
import { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Container from "./Container";
import classes from "./Layout.module.scss";

import MainNavigation from "./MainNavigation";

const Layout = (props) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 401) {
                //place your reentry code
                authCtx.onLogout();
                navigate("/");
            }
            return error;
        }
    );

    
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
