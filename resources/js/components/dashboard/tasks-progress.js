import {
    Avatar,
    Box,
    Grid,
    LinearProgress,
    Typography,
} from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChartOutlined";
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
                                    props.score > 0.5 ? props.score > 0.9 ? "green" : "warning.main" : "red",
                                height: 56,
                                width: 56,
                            }}
                        >
                            <InsertChartIcon />
                        </Avatar>
                    </Grid>
                </Grid>
                <Box sx={{ pt: 3 }}>
                    <LinearProgress
                        value={props.score * 100}
                        variant="determinate"
                    />
                </Box>
        </Card>
    );
};
