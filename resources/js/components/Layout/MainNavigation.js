// react
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// context
import AuthContext from "../../store/auth-context";

// axios
import axios from "axios";
import AccountMenu from "../UI/AccountMenu";

const MainNavigation = () => {
    const authCtx = useContext(AuthContext);
    const location = useLocation();
    const path = location.pathname;

    const isLoggedIn = authCtx.isLoggedIn;

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
                        {isLoggedIn && (
                            <li>
                                <AccountMenu />
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
