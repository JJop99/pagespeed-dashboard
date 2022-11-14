// mui
import {
    Avatar,
    Box,
    createTheme,
    Grid,
    LinearProgress,
    ThemeProvider,
    Typography,
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import { grey } from "@mui/material/colors";

// UI
import Card from "../UI/Card";

export const TasksProgress = (props) => {
    const theme = createTheme();
    return (
        <Card className="p-2">
            <ThemeProvider theme={theme}>
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
                                    props.score > 0.5
                                        ? props.score > 0.9
                                            ? "success.light"
                                            : "warning.light"
                                        : "error.light",
                                height: 56,
                                width: 56,
                                [theme.breakpoints.down("md")]: {
                                    height: 36,
                                    width: 36,
                                },
                            }}
                        >
                            <SpeedIcon
                                sx={{
                                    [theme.breakpoints.down("md")]: {
                                        fontSize: "medium",
                                    },
                                }}
                            />
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
                                backgroundColor: grey[600],
                            },
                        }}
                    />
                </Box>
            </ThemeProvider>
        </Card>
    );
};
