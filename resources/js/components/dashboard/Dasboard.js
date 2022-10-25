import { Box, Container, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useLocation } from "react-router-dom";
import AnimatedProgressProvider from "../UI/AnimatedProgressProvider.js";
import { TasksProgress } from "./tasks-progress";
import { easeQuadInOut } from "d3-ease";
import "react-circular-progressbar/dist/styles.css";

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
                        py: 8,
                    }}
                >
                    <Container maxWidth={false}>
                        <Grid container spacing={3}>
                            <Grid item lg={6} md={6} xl={6} xs={6}>
                                <AnimatedProgressProvider
                                    valueStart={0}
                                    valueEnd={performance}
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
                                                })}
                                            />
                                        );
                                    }}
                                </AnimatedProgressProvider>
                            </Grid>
                            <Grid>performance</Grid>

                            {Object.entries(...audits).map((audit) => (
                                <Grid
                                    key={JSON.parse(audit[1]).id}
                                    item
                                    lg={3}
                                    sm={6}
                                    xl={3}
                                    xs={12}
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
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            )}
        </div>
    );
};
export default Dashboard;
