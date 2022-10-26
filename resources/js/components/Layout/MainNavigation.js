import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.scss";
import axios from "axios";
const MainNavigation = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const isLoggedIn = authCtx.isLoggedIn;
    //const isLoggedIn = true;

    const logoutHandler = () => {
        authCtx.onLogout();
        axios.defaults.withCredentials = true;
        axios.post("/api/logout");
        navigate("/");
    };

    return (
        <header className={classes.header}>
            <div className={classes.logo}>
                <img src="/logo-mumble-white.svg" alt="SVG as an image" />
            </div>
            <div>
                {isLoggedIn ? (
                    <Link to="/home">
                        <div className={classes.title}>PageSpeed Dashboard</div>
                    </Link>
                ) : (
                    <div className={classes.title}>PageSpeed Dashboard</div>
                )}

                <nav>
                    <ul>
                        {!isLoggedIn && path === "/sign-up" && (
                            <li>
                                <Link to="/sign-in">Sign In</Link>
                            </li>
                        )}
                        {!isLoggedIn && path !== "/sign-up" && (
                            <li>
                                <Link to="/sign-up">Sign Up</Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <Link to="/new-url">New Url</Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <button onClick={logoutHandler}>Logout</button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
            <div></div>
        </header>
    );
};

export default MainNavigation;
