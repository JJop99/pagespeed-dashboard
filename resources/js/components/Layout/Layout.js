import axios from "axios";
import { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Container from "./Container";
import Footer from "./Footer";

import MainNavigation from "./MainNavigation";

const Layout = (props) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (
                error.response.status === 401 ||
                error.response.status === 419
            ) {
                if (
                    error.response.status === 401 &&
                    location.pathname !== "/sign-in"
                ) {
                    navigate("/");
                }
                authCtx.onLogout();
            }
            if (error.response.status === 404) {
                //place your reentry code
                navigate("*");
            }
            return error;
        }
    );

    return (
        <Fragment>
            <div className="layout">
                <MainNavigation />
                <Container>{props.children}</Container>
                <Footer />
            </div>
        </Fragment>
    );
};

export default Layout;
