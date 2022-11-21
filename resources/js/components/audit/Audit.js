// axios
import axios from "axios";

// react
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import { TasksProgress } from "./tasks-progress";
import { easeQuadInOut } from "d3-ease";

// UI
import AnimatedProgressProvider from "../UI/AnimatedProgressProvider.js";
import LoadingSpinner from "../UI/LoadingSpinner";

// mui
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import InfoIcon from "@mui/icons-material/Info";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@mui/material";

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
                if (res.status === 204) {
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
                    <div>
                        <Link to={`${path}s`} className="project__title ">
                            <ArrowBackIosNewRoundedIcon /> Project:{" "}
                            {project.title}
                        </Link>
                    </div>
                    <div className="result__title result__title-audit">
                        {info.title}
                    </div>
                    <div className="result__subtitle result__subtitle-audit">
                        {info.url}
                    </div>
                    <div className="result__performance">Performance Score</div>
                    <div className="result__score">
                        <div className="result__score-graph">
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
                                                background={true}
                                                styles={buildStyles({
                                                    pathTransition: "none",
                                                    trailColor: "transparent",
                                                    backgroundColor:
                                                        value > 50
                                                            ? value > 90
                                                                ? "#4caf5033"
                                                                : "#ff980033"
                                                            : "#ef535033",
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

                        <div className="result__score-info">
                            <Accordion elevation={0}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>
                                        <InfoIcon /> More details about
                                        performances.
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <div className="result__description result__description-audit">
                                            The Performance score is a weighted
                                            average of the metric scores.
                                            <br />
                                            <br />
                                            Naturally, more heavily weighted
                                            metrics have a bigger effect on your
                                            overall Performance score.
                                            <br />
                                            <br />
                                            The weightings are chosen to provide
                                            a balanced representation of the
                                            user's perception of performance.
                                            The weightings have changed over
                                            time
                                        </div>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            {/* <div className="result__description result__description-audit">
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
                            </div> */}
                        </div>
                    </div>
                    <br></br>
                    <div className="result__performance">Metrics</div>
                    <div className="flex flex-wrap -mx-3 overflow-hidden sm:-mx-3 md:-mx-3 lg:-mx-3 xl:-mx-3">
                        {Object.entries(audits).map((audit) => (
                            <div
                                key={JSON.parse(audit[1]).id}
                                className=" w-full  overflow-hidden     lg:w-1/2  xl:w-1/2"
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
            {isLoading && <LoadingSpinner />}
        </div>
    );
};
export default Audit;
