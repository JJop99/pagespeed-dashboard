// mui
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
   
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
import { useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import theme from "../../theme/theme";

const ResetPassword = () => {
    const location = useLocation();
    const authCtx = useContext(AuthContext);
    
    const passwordInputRef = useRef();
    const confirmInputRef = useRef();

    const navigate = useNavigate();

    // const token = location.pathname.split("/")[2];
    // console.log(token);

    const logoutHandler = () => {
        authCtx.onLogout();
        axios.defaults.withCredentials = true;
        axios.get("/api/logout");
        navigate("/");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let user = {
            new_password: passwordInputRef.current.value,
            confirm_password: confirmInputRef.current.value,
        };

        axios.defaults.withCredentials = true;

        // REGISTER
        axios
            .post(
                `/api/reset`,
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
                    logoutHandler();
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
                        Reset Password
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
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            inputRef={passwordInputRef}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm"
                            label="Confirm Password"
                            type="password"
                            id="confirm"
                            autoComplete="confirm-password"
                            inputRef={confirmInputRef}
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
export default ResetPassword;
