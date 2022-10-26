import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mumbleideas.it/it/">
                mumble
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const theme = createTheme();

const SignIn = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const authCtx = useContext(AuthContext);

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
        axios.get("/sanctum/csrf-cookie").then(
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
                        console.log(res);
                        setIsLoading(false);
                        if (res.statusText === "OK") {
                            // ...
                            console.log("ciao");
                            authCtx.onLogin(user.email);
                            navigate("/home");
                            return res;
                        } else {
                            return res.then((data) => {
                                //show an error modal
                                let errorMessage = "Authentication failed!";
                                if (data && data.error && data.error.message) {
                                    errorMessage = data.error.message;
                                }
                                throw new Error(errorMessage);
                            });
                        }
                    })
                    .catch((err) => {
                        alert(err.message);
                    });
            },
            // COOKIE ERROR
            (error) => {
                setErrorMessage("Could not complete the login");
            }
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
                        
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
};
export default SignIn;
