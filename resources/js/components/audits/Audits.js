import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TestList from "./TestList";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import LoadingSpinner from "../UI/LoadingSpinner";
import SiteList from "./SiteList";

const Audits = () => {
    const [project, setProject] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const id = location.pathname.split("/")[2];
    const getProject = () => {
        setIsLoading(true);

        axios
            .get(
                `/api/project`,
                { params: { id: id } },
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
                    setProject(res.data.project[0]);
                    if (res.data.project.length === 0) {
                        navigate("/not-exist");
                    }
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    useEffect(() => {
        getProject();
    }, []);
    return (
        <Fragment>
            {!isLoading && <div>
                {" "}
                <div className="table__project">
                    <Link to={"/home"}>
                        <ArrowBackIosNewRoundedIcon />
                    </Link>
                    Project: {project.title}
                </div>
                <TestList />
                <SiteList />
            </div>}
            {isLoading && <LoadingSpinner/>}
        </Fragment>
    );
};

export default Audits;
