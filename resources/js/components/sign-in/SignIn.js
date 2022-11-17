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
    Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// axios
import axios from "axios";

// react
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const theme = createTheme();

const SignIn = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const authCtx = useContext(AuthContext);
    const [alert, setAlert] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(emailInputRef.current.value);
        let user = {
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
        };

        setIsLoading(true);
        console.log(user);
        axios.defaults.withCredentials = true;
        // CSRF COOKIE
        axios
            .get("/sanctum/csrf-cookie")
            .then(
                (res) => {
                    console.log(res);
                    // LOGIN

                    axios
                        .post(
                            `/api/signIn`,
                            { ...user },
                            {
                                headers: {
                                    // Overwrite Axios's automatically set Content-Type
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                        .then((res) => {
                            setIsLoading(false);
                            if (res.statusText === "OK") {
                                // ...
                                console.log("ciao");
                                authCtx.onLogin(user.email);
                                navigate("/home");
                                return res;
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                // COOKIE ERROR
            )
            .catch((error) => {
                console.log(error);
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
                        Sign In
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

                        {isLoading && <p>Sending request ...</p>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/forgot-password" >
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/sign-up" >
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
export default SignIn;
