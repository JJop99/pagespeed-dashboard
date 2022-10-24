import axios from "axios";
import { useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const Dashboard = () => {
    const location = useLocation();
    console.log(location);
    
    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);
    let search = {
        email: authCtx.user,
        url: location.state.url,
    };

    useEffect(() => {
        console.log(search);
        axios
            .post(
                `/api/dashboard`,
                { search },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                console.log(res);
                if (res.statusText === "OK") {
                    // ...
                    console.log("dashboard");
                    return res;
                }
            })
            .then((data) => {
                //console.log(data.data.urls);

                console.log(data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    return <div>{search.url}</div>;
};
export default Dashboard;
