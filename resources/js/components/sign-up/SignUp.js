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


const SignUp = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const userInputRef = useRef();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(emailInputRef.current.value);
        let user = {
            username: userInputRef.current.value,
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
                if (res.status === 200) {
                    navigate("/sign-in");
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
                        Sign Up
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
                            id="user"
                            label="User Name"
                            name="user"
                            autoComplete="user"
                            autoFocus
                            inputRef={userInputRef}
                        />
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
                            color="close"
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
