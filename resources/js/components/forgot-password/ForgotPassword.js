// mui
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
    Alert,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

// axios
import axios from "axios";

// react
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";


const ForgotPassword = () => {
    const email = useRef();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let user = {
            email: email.current.value,
        };

        axios.defaults.withCredentials = true;

        // REGISTER
        axios
            .post(
                `/api/forgot`,
                { email: email.current.value },
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
                    navigate("/");
                    return res;
                }
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Forgot Password
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            inputRef={email}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="close"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
export default ForgotPassword;
