import { Box, Container, Grid } from "@mui/material";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { TasksProgress } from "./tasks-progress";

const Dashboard = () => {
    const location = useLocation();
    console.log(location);

    let audits;

    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);
    let search = {
        email: authCtx.user,
        url: location.state.url,
    };

    useEffect(() => {
        console.log(search);
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
                    console.log("dashboard");
                    return res;
                }
            })
            .then((data) => {
                //console.log(data.data.urls);
                audits = data.data.lighthouseResult.audits;
                console.log(audits);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    
    return (
        <div>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <Grid container spacing={3}>
                        <Grid item lg={3} sm={6} xl={3} xs={12}>
                            <TasksProgress id={'5'} title={''} description={''} score={''}/>
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            <TasksProgress />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            <TasksProgress />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            <TasksProgress sx={{ height: "100%" }} />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            <TasksProgress />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            <TasksProgress sx={{ height: "100%" }} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};
export default Dashboard;
