import { Box, Container, Grid } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { TasksProgress } from "./tasks-progress";

const Dashboard = () => {
    const location = useLocation();
    console.log(location);

    const [isLoading, setIsLoading] = useState(true);
    const [audits, setAudits] = useState([]);

    axios.defaults.withCredentials = true;
    // const authCtx = useContext(AuthContext);
    // let search = {
    //     email: authCtx.user,
    //     url: location.state.url,
    // };

    useEffect(() => {
        console.log(isLoading);
        axios
            .post(
                `/api/dashboard`,
                { url: location.state.url },
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
                    // ...
                    console.log("dashboard ");

                    return res;
                }
            })
            .then((data) => {
                //console.log(data.data.urls);
                setAudits(data.data);
                console.log(data.data);
                console.log(audits);
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
                            {console.log(audits)}
                            {audits.map((audit) => (
                                <Grid item lg={3} sm={6} xl={3} xs={12}>
                                    <TasksProgress
                                        id={audit.id}
                                        title={audit.title}
                                        description={audit.description}
                                        numericValue={audit.numericValue}
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
