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
import { createTheme, ThemeProvider } from "@mui/material/styles";

// axios
import axios from "axios";

// react
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const SignUp = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [alert, setAlert] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(emailInputRef.current.value);
        let user = {
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
        };

        axios.defaults.withCredentials = true;

        // REGISTER
        axios
            .post(
                `/api/signUp`,
                { ...user },
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
                    navigate("/sign-in");
                    return res;
                } else {
                    throw new Error();
                   
                }
            })
            .catch((err) => {
                setAlert(true);
                console.log(err.response)
            });
    };
    console.log(alert)


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
                        Sign Up
                    </Typography>
                    {alert && (
                        <Alert severity="error">
                            Your provided credentials could be wrong.
                        </Alert>
                    ) }
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
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            inputRef={emailInputRef}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            inputRef={passwordInputRef}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
export default SignUp;
