import { Box, Container, Grid } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import AuthContext from "../../store/auth-context.js";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
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
                    setDates(res.data[0].map(({ created_at }) => created_at));
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
                    </Container>
                </Box>
            )}
        </div>
    );
};
export default PerformanceHistory;
