import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SiteList from "./SiteList";
import TestList from "./TestList";

const Audits = () => {
    const [project, setProject] = useState("");
    const location = useLocation();

    const id = location.pathname.split("/")[2];
    const getProject = () => {
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

                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };
    useEffect(() => {
        getProject();
    }, []);
    return (
        <Fragment>
            <div>{project.name}</div>
            <TestList />
            <SiteList />
        </Fragment>
    );
};

export default Audits;
