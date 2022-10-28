import { Box, Container, Grid } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import AuthContext from "../../store/auth-context.js";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import classes from "./PerformanceHistory.module.scss";
import moment from 'moment'

const PerformanceHistory = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [performance, setPerformance] = useState([]);

    const authCtx = useContext(AuthContext);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios
            .post(
                `/api/results`,
                { email: authCtx.user, url: location.state.url },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.statusText === "OK") {
                    setPerformance(
                        res.data[0].map(({ performance }) => performance)
                    );
                    setDates(res.data[0].map(({ created_at }) => moment(created_at).format('DD-MM')));
                    // setPerformance(res.data[1][0].performance * 100);
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            })
            .finally(() => {
                setIsLoading(false);
                console.log(performance);
            });
    }, []);

    const data = {
        labels: dates,
        datasets: [
            {
                label: "First dataset",
                data: performance,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
            },
        ],
    };
    console.log(performance);

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
                            <Grid item lg={8} md={8} xl={8} xs={12}>
                                <Chart
                                    type="line"
                                    data={data}
                                    options={{
                                        scales: {
                                            yAxis: {
                                                min: 0,
                                                max: 1,
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} xl={4} xs={12}>
                                <div className={classes.description}>
                                    When your Performance score fluctuates it's
                                    usually because of changes in underlying
                                    conditions.
                                    <br />
                                    <br />
                                    Common problems include:
                                    <ul>
                                        <li>
                                            A/B tests or changes in ads being
                                            served
                                        </li>
                                        <li>
                                            Internet traffic routing changes
                                        </li>
                                        <li>
                                            Testing on different devices, such
                                            as a high-performance desktop and a
                                            low-performance laptop
                                        </li>
                                        <li>
                                            Browser extensions that inject
                                            JavaScript and add/modify network
                                            requests 
                                        </li>
                                        <li>Antivirus software</li>
                                    </ul>
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            )}
        </div>
    );
};
export default PerformanceHistory;
