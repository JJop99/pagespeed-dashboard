// axios
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";

// moment
import moment from "moment";

// mui date picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers";

// chart
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";

// mui
import {
    Skeleton,
    TextField,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import InfoIcon from "@mui/icons-material/Info";

// UI
import LoadingSpinner from "../UI/LoadingSpinner";
import LineChart from "../UI/LineChart";

const PerformanceHistory = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [from, setFrom] = useState(
        moment().subtract(1, "months").format("YYYY-MM-DD")
    );
    const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
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
                if (res.status === 200) {
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
        console.log(url + " " + from + " " + to);
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
                if (res.status === 200) {
                    console.log(res);
                    setPerformance(
                        res.data.urls.map(
                            ({ performance }) => performance * 100
                        )
                    );
                    setDates(
                        res.data.urls.map(({ created_at }) =>
                            moment(created_at)
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
                console.log(dates);
                console.log(performance);
            });
    }, [from, to]);

    return (
        <div>
            {!isLoading && (
                <div>
                    <div>
                        <Link
                            to={`/project/${projectId}/audits`}
                            className="project__title"
                        >
                            <ArrowBackIosNewRoundedIcon /> Project: {project.title}
                        </Link>
                    </div>
                    <div className="result__title result__title-performance">
                        Performance Scores
                    </div>
                    <div className="result__subtitle result__subtitle-performance">
                        {url}
                    </div>

                    <div>
                        <div className="result__chart">
                            <LineChart
                                dateLabels={dates}
                                analyticsData={performance}
                                fillColor="#111827"
                            />
                        </div>
                        <div className="result__datePickers">
                            {" "}
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    className="result__datePickers result__datePickers-datePicker"
                                    disableFuture
                                    label="From"
                                    openTo="day"
                                    views={["year", "month", "day"]}
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

                                <DatePicker
                                    className="result__datePickers result__datePickers-datePicker"
                                    disableFuture
                                    label="To"
                                    openTo="day"
                                    views={["year", "month", "day"]}
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
                                <Accordion>
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
                                            When your Performance score
                                            fluctuates it's usually because of
                                            changes in underlying conditions.
                                            <br />
                                            <br />
                                            Common problems include:
                                            <ul className="result__list">
                                                <li>
                                                    A/B tests or changes in ads
                                                    being served
                                                </li>
                                                <li>
                                                    Internet traffic routing
                                                    changes
                                                </li>
                                                <li>
                                                    Testing on different
                                                    devices, such as a
                                                    high-performance desktop and
                                                    a low-performance laptop
                                                </li>
                                                <li>
                                                    Browser extensions that
                                                    inject JavaScript and
                                                    add/modify network requests
                                                </li>
                                                <li>Antivirus software</li>
                                            </ul>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div>
                    <div className="result__project">
                        <Skeleton animation="wave" />
                    </div>
                    <div className="result__title result__title-performance">
                        <Skeleton animation="wave" />
                    </div>
                    <div className="result__subtitle result__subtitle-performance">
                        <Skeleton animation="wave" />
                    </div>

                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
};
export default PerformanceHistory;
