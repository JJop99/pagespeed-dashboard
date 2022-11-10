import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import InfoIcon from "@mui/icons-material/Info";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TextField } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import LoadingSpinner from "../UI/LoadingSpinner";
import LineChart from "../UI/LineChart";

const PerformanceHistory = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [project, setProject] = useState("");
    const url = decodeURIComponent(location.search.split("=").pop());

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const projectId = location.pathname.split("/")[2];

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
                    if (res.data.project.length === 0) {
                        navigate("/not-exist");
                    }
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    useEffect(() => {
        getProject();
        console.log(url);
        axios
            .get(
                `/api${location.pathname.slice(
                    0,
                    location.pathname.lastIndexOf("/")
                )}`,
                {
                    params: {
                        url: url,
                        from: moment(from).format("YYYY-MM-DD"),
                        to: moment(to).format("YYYY-MM-DD"),
                    },
                },
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
                        res.data.urls.map(
                            ({ performance }) => performance * 100
                        )
                    );
                    setDates(
                        res.data.urls.map(({ created_at }) =>
                            moment(created_at).format("DD-MM-YYYY HH:mm")
                        )
                    );
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
    }, [from, to]);

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

    return (
        <div>
            {!isLoading && (
                <div>
                    <div className="result__project">
                        <Link to={`/project/${projectId}/audits`}>
                            <ArrowBackIosNewRoundedIcon />
                        </Link>
                        Project: {project.title}
                    </div>
                    <div className="result__title result__title-performance">
                        Performance Scores
                    </div>
                    <div className="result__subtitle result__subtitle-performance">
                        {url}
                    </div>

                    <div>
                        <div className="result__chart">
                            {/* <Chart
                                type="line"
                                data={data}
                                options={{
                                    scales: {
                                        yAxis: {
                                            min: 0,
                                            max: 100,
                                        },
                                    },
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />{" "} */}
                            <LineChart
                                dateLabels={dates}
                                analyticsData={performance}
                                fillColor="#111827"
                            />
                        </div>
                        <div className="result__datePickers">
                            {" "}
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDatePicker
                                    className="result__datePickers result__datePickers-datePicker"
                                    label="From"
                                    value={from}
                                    minDate={moment("2017-01-01")}
                                    inputFormat="DD/MM/YYYY"
                                    onChange={(newFrom) => {
                                        setFrom(newFrom);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                                <DesktopDatePicker
                                    className="result__datePickers result__datePickers-datePicker"
                                    label="To"
                                    value={to}
                                    minDate={from}
                                    inputFormat="DD/MM/YYYY"
                                    onChange={(newTo) => {
                                        setTo(newTo);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>

                        <div>
                            <div className="result__description result__description-performance">
                                <InfoIcon />
                                <br />
                                <br />
                                When your Performance score fluctuates it's
                                usually because of changes in underlying
                                conditions.
                                <br />
                                <br />
                                Common problems include:
                                <ul className="result__list">
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
            {isLoading && <LoadingSpinner />}
        </div>
    );
};
export default PerformanceHistory;
