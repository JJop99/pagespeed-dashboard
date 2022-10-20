import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.scss";
import axios from "axios";
const MainNavigation = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

   
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
                <Link to="/">
                    <div className={classes.title}>PageSpeed_Dashboard</div>
                </Link>
                <nav>
                    <ul>
                        {!isLoggedIn && (
                            <li>
                                <Link to="/sign-in">Login</Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <Link to="/profile">Profile</Link>
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
