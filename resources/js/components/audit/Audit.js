// axios
import axios from "axios";

// react
import {  useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import { TasksProgress } from "./tasks-progress";
import { easeQuadInOut } from "d3-ease";

// UI
import AnimatedProgressProvider from "../UI/AnimatedProgressProvider.js";
import LoadingSpinner from "../UI/LoadingSpinner";

// mui
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

const Audit = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [audits, setAudits] = useState([]);
    const [info, setInfo] = useState();
    const [project, setProject] = useState("");
    const navigate = useNavigate();
    const location = useLocation();


    const projectId = location.pathname.split("/")[2];

    axios.defaults.withCredentials = true;
    const path = location.pathname.slice(0, location.pathname.lastIndexOf("/"));
    const id = location.pathname.split("/").pop();

    const getProject = () => {
        axios
            .get(
                `/api/project`,
                { params: { id: projectId } },
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

        axios
            .get(
                `/api${path}`,
                { params: { id: id } },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.statusText === "OK") {
                    console.log(res);
                    setAudits(res.data[0]);
                    setInfo(res.data[1]);
                    if (res.data[0].length === 0) {
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
    }, []);

    console.log(info);

    return (
        <div>
            {!isLoading && (
                <div>
                    <div className="result__project result__project-audit">
                        <Link to={`${path}s`}>
                            <ArrowBackIosNewRoundedIcon />
                        </Link>
                        Project: {project.title}
                    </div>
                    <div className="result__title result__title-audit">{info.title}</div>
                    <div className="result__subtitle result__subtitle-audit">{info.url}</div>
                    <div className="result__performance">Performance Score</div>
                    <div className=" flex flex-col sm:flex-row w-full  -mx-3 overflow-hidden sm:-mx-3 md:-mx-3 lg:-mx-3 xl:-mx-3">
                        <div className="  my-3 px-3  overflow-hidden  sm:px-3   md:px-3   lg:px-3 lg:w-1/3  xl:px-3 xl:w-1/3">
                            <div>
                                <AnimatedProgressProvider
                                    valueStart={0}
                                    valueEnd={info.performance * 100}
                                    duration={1.4}
                                    easingFunction={easeQuadInOut}
                                >
                                    {(value) => {
                                        const roundedValue = Math.round(value);
                                        return (
                                            <CircularProgressbar
                                                value={value}
                                                text={`${roundedValue}%`}
                                                /* This is important to include, because if you're fully managing the
        animation yourself, you'll want to disable the CSS animation. */
                                                styles={buildStyles({
                                                    pathTransition: "none",
                                                    pathColor:
                                                        value > 50
                                                            ? value > 90
                                                                ? "#4caf50"
                                                                : "#ff9800"
                                                            : "#ef5350",
                                                    textColor:
                                                        value > 50
                                                            ? value > 90
                                                                ? "#4caf50"
                                                                : "#ff9800"
                                                            : "#ef5350",
                                                })}
                                            />
                                        );
                                    }}
                                </AnimatedProgressProvider>
                            </div>
                        </div>

                        <div className=" my-3 px-3 w-full overflow-hidden  sm:px-3   md:px-3   lg:px-3 lg:w-2/3  xl:px-3 xl:w-2/3">
                            <div className="result__description result__description-audit">
                                The Performance score is a weighted average of
                                the metric scores.
                                <br />
                                <br />
                                Naturally, more heavily weighted metrics have a
                                bigger effect on your overall Performance score.
                                <br />
                                <br />
                                The weightings are chosen to provide a balanced
                                representation of the user's perception of
                                performance. The weightings have changed over
                                time
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="result__performance">Metrics</div>
                    <div className="flex flex-wrap -mx-3 overflow-hidden sm:-mx-3 md:-mx-3 lg:-mx-3 xl:-mx-3">
                        {Object.entries(audits).map((audit) => (
                            <div
                                key={JSON.parse(audit[1]).id}
                                className=" w-full  overflow-hidden  sm:w-1/2  md:w-1/2  lg:w-1/2  xl:w-1/2"
                            >
                                <TasksProgress
                                    id={JSON.parse(audit[1]).id}
                                    title={JSON.parse(audit[1]).title}
                                    description={
                                        JSON.parse(audit[1]).description
                                    }
                                    value={JSON.parse(audit[1]).displayValue}
                                    score={JSON.parse(audit[1]).score}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {isLoading && <LoadingSpinner/>}
        </div>
    );
};
export default Audit;
