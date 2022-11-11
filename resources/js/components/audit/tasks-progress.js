// mui
import {
    Avatar,
    Box,
    Grid,
    LinearProgress,
    Typography,
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import { grey } from "@mui/material/colors";

// UI
import Card from "../UI/Card";

export const TasksProgress = (props) => {
    return (
        <Card >
           
                <Grid
                    container
                    spacing={3}
                    sx={{ justifyContent: "space-between" }}
                >
                    <Grid item>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="overline"
                        >
                            {props.title}
                        </Typography>
                        <Typography color="textPrimary" variant="h4">
                            {props.value}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar
                            sx={{
                                backgroundColor:
                                    props.score > 0.5 ? props.score > 0.9 ? "success.light" : "warning.light" : "error.light",
                                height: 56,
                                width: 56,
                            }}
                        >
                            <SpeedIcon />
                        </Avatar>
                    </Grid>
                </Grid>
                <Box sx={{ pt: 3 }}>
                    <LinearProgress
                        value={props.score * 100}
                        variant="determinate"
                        sx={{
                            backgroundColor: grey[200],
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: grey[600]
                            }
                          }}
                    />
                </Box>
        </Card>
    );
};
