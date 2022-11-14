// axios
import axios from "axios";

// react
import { Fragment, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// context
import AuthContext from "../../store/auth-context";
import ErrorAlert from "../UI/ErrorAlert";

// layout
import Container from "./Container";
import Footer from "./Footer";

import MainNavigation from "./MainNavigation";

const Layout = (props) => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            if (error.response.status === 422) {
                // console.log(
                //     JSON.stringify(error.response.data.errors) + " intercepted"
                // );

                setErrorMessage(
                    Object.values(error.response.data.errors)
                        .map((prop) => prop)
                        .join("\n")
                );
                setAlert(true);
            }
            if (error.response.status === 429) {
                setErrorMessage("We had a problem with the test execution, try again please.");
                setAlert(true);
            }
            return error;
        }
    );

    return (
        <Fragment>
            <div className="layout">
                <MainNavigation />
                <Container>
                    {
                        <ErrorAlert
                            open={alert}
                            message={errorMessage}
                            setOpen={setAlert}
                        />
                    }
                    {props.children}
                </Container>
                <Footer />
            </div>
        </Fragment>
    );
};

export default Layout;
