import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import AuthContext from "../../store/auth-context.js";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import classes from "./PerformanceHistory.module.scss";
import InfoIcon from "@mui/icons-material/Info";
import moment, { Moment } from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
//import { MobileDateRangePicker } from "@mui/x-date-pickers-pro/MobileDateRangePicker";
import { DesktopDateRangePicker } from "@mui/x-date-pickers-pro/DesktopDateRangePicker";
//import { DateRange } from '@mui/x-date-picker/';
import { Box, TextField } from "@mui/material";

const PerformanceHistory = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [value, setValue] = useState([null, null]);

    const authCtx = useContext(AuthContext);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        console.log(
            `/api${location.pathname.slice(
                0,
                location.pathname.lastIndexOf("/")
            )}`
        );
        axios
            .get(
                `/api${location.pathname.slice(
                    0,
                    location.pathname.lastIndexOf("/")
                )}`,
                { params: { url: location.state.url } },
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
                    setPerformance(
                        res.data.urls.map(({ performance }) => performance)
                    );
                    setDates(
                        res.data.urls.map(({ created_at }) =>
                            moment(created_at).format("DD-MM")
                        )
                    );
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
                data: performance,
                fill: true,
                backgroundColor: "rgba(64, 95, 242, 0.2)",
                borderColor: "rgba(64, 95, 242, 1)",
            },
        ],
    };
    console.log(performance);
    console.log(value);
    return (
        <div>
            {!isLoading && (
                <div className={classes.box}>
                    <div className={classes.title}>Performance Scores</div>
                    <div className={classes.subtitle}>{location.state.url}</div>

                    <div>
                        <div className={classes.chart}>
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
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />{" "}
                            <LocalizationProvider
                                dateAdapter={AdapterMoment}
                                localeText={{
                                    start: "Desktop start",
                                    end: "Desktop end",
                                }}
                            >
                                <DesktopDateRangePicker
                                    value={value}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                    }}
                                    renderInput={(startProps, endProps) => (
                                        <Fragment>
                                            <TextField {...startProps} />
                                            <Box sx={{ mx: 2 }}> to </Box>
                                            <TextField {...endProps} />
                                        </Fragment>
                                    )}
                                />
                                {/* <MobileDatePicker
                            label="Date mobile"
                            inputFormat="MM/DD/YYYY"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => (
                                <TextField {...params} />
                            )}
                        /> */}
                            </LocalizationProvider>
                        </div>
                        <div>
                            <div className={classes.description}>
                                <InfoIcon />
                                <br />
                                <br />
                                When your Performance score fluctuates it's
                                usually because of changes in underlying
                                conditions.
                                <br />
                                <br />
                                Common problems include:
                                <ul className={classes.list}>
                                    <li>
                                        A/B tests or changes in ads being served
                                    </li>
                                    <li>Internet traffic routing changes</li>
                                    <li>
                                        Testing on different devices, such as a
                                        high-performance desktop and a
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PerformanceHistory;
