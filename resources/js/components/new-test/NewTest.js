import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LanguageIcon from "@mui/icons-material/Language";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { CircularProgress } from "@mui/material";
import LoadingSpinner from "../UI/LoadingSpinner";

const theme = createTheme();

const NewTest = () => {
    const titleInputRef = useRef();
    const urlInputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const authCtx = useContext(AuthContext);
    console.log(authCtx);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        console.log(titleInputRef.current.value);
        let site = {
            title: titleInputRef.current.value,
            url: urlInputRef.current.value,
        };

        axios.defaults.withCredentials = true;
        axios
            .post(`/api${location.pathname}`, site, {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                console.log(res);
                if (res.statusText === "OK") {
                    navigate(`${location.pathname}s`);
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {!isLoading && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LanguageIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            New Test
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
                                id="title"
                                label="Title"
                                name="title"
                                autoComplete="title"
                                autoFocus
                                inputRef={titleInputRef}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="url"
                                label="Url"
                                type="url"
                                id="url"
                                autoComplete="current-url"
                                inputRef={urlInputRef}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                )}
                {isLoading && (
                    <LoadingSpinner/>
                )}
            </Container>
        </ThemeProvider>
    );
};

export default NewTest;
