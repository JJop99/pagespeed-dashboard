// react
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// context
import AuthContext from "../../store/auth-context";

// axios
import axios from "axios";

const MainNavigation = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const isLoggedIn = authCtx.isLoggedIn;

    const logoutHandler = () => {
        authCtx.onLogout();
        axios.defaults.withCredentials = true;
        axios.get("/api/logout");
        navigate("/");
    };

    return (
        <header className="mainNav__header">
            <div className="mainNav__logo">
                <img src="/logo-mumble-white.svg" alt="SVG as an image" />
            </div>
            <div>
                {isLoggedIn ? (
                    <Link to="/home">
                        <div className="mainNav__title">
                            PageSpeed Dashboard
                        </div>
                    </Link>
                ) : (
                    <div className="mainNav__title">PageSpeed Dashboard</div>
                )}

                <nav>
                    <ul>
                        {!isLoggedIn && path === "/sign-up" && (
                            <li>
                                <button>
                                    <Link to="/sign-in">Sign In</Link>
                                </button>
                            </li>
                        )}
                        {!isLoggedIn && path !== "/sign-up" && (
                            <li>
                                <button>
                                    {" "}
                                    <Link to="/sign-up">Sign Up</Link>
                                </button>
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
