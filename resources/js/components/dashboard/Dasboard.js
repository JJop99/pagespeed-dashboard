import { Box, Container, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useLocation } from "react-router-dom";
import AnimatedProgressProvider from "../UI/AnimatedProgressProvider.js";
import { TasksProgress } from "./tasks-progress";
import { easeQuadInOut } from "d3-ease";
import "react-circular-progressbar/dist/styles.css";
import classes from "./Dashboard.module.scss";
import Card from "../UI/Card.js";
const Dashboard = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [audits, setAudits] = useState([]);
    const [performance, setPerformance] = useState();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios
            .post(
                `/api/dashboard`,
                { id: location.state.id },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.statusText === "OK") {
                    setAudits(res.data[0]);
                    setPerformance(res.data[1][0].performance * 100);
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

    return (
        <div>
            {!isLoading && (
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                    }}
                >
                   
                        <div className="flex sm:flex-wrap -mx-3 overflow-hidden sm:-mx-3 md:-mx-3 lg:-mx-3 xl:-mx-3">
                            <div className="my-3 px-3  overflow-hidden sm:my-3 sm:px-3 sm:w-1/4 md:my-3 md:px-3 md:w-1/4 lg:my-3 lg:px-3 lg:w-1/4 xl:my-3 xl:px-3 xl:w-1/4">
                                <div className={classes.performance}>
                                    <AnimatedProgressProvider
                                        valueStart={0}
                                        valueEnd={performance}
                                        duration={1.4}
                                        easingFunction={easeQuadInOut}
                                    >
                                        {(value) => {
                                            const roundedValue =
                                                Math.round(value);
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
                                                                    ? "green"
                                                                    : "orange"
                                                                : "red",
                                                        textColor:
                                                            value > 50
                                                                ? value > 90
                                                                    ? "green"
                                                                    : "orange"
                                                                : "red",
                                                    })}
                                                />
                                            );
                                        }}
                                    </AnimatedProgressProvider>
                                </div>
                            </div>

                            <div className="my-3 px-3 w-full overflow-hidden sm:my-3 sm:px-3 sm:w-3/4 md:my-3 md:px-3 md:w-3/4 lg:my-3 lg:px-3 lg:w-3/4 xl:my-3 xl:px-3 xl:w-3/4">
                                <div className={classes.description}>
                                    The Performance score is a weighted average
                                    of the metric scores.
                                    <br />
                                    <br />
                                    Naturally, more heavily weighted metrics
                                    have a bigger effect on your overall
                                    Performance score.
                                    <br />
                                    <br />
                                    The weightings are chosen to provide a
                                    balanced representation of the user's
                                    perception of performance. The weightings
                                    have changed over time
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="flex flex-wrap -mx-3 overflow-hidden sm:-mx-3 md:-mx-3 lg:-mx-3 xl:-mx-3">
                            {Object.entries(...audits).map((audit) => (
                                <div
                                    key={JSON.parse(audit[1]).id}
                                    className="my-3 px-3 w-full overflow-hidden sm:my-3 sm:px-3 sm:w-1/2 md:my-3 md:px-3 md:w-1/2 lg:my-3 lg:px-3 lg:w-1/2 xl:my-3 xl:px-3 xl:w-1/2"
                                >
                                    <TasksProgress
                                        id={JSON.parse(audit[1]).id}
                                        title={JSON.parse(audit[1]).title}
                                        description={
                                            JSON.parse(audit[1]).description
                                        }
                                        value={
                                            JSON.parse(audit[1]).displayValue
                                        }
                                        score={JSON.parse(audit[1]).score}
                                    />
                                </div>
                            ))}
                        </div>
                </Box>
            )}
        </div>
    );
};
export default Dashboard;
