// mui
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// axios
import axios from "axios";

// react
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// context
import AuthContext from "../../store/auth-context";

// UI
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
                if (res.status === 204) {
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
                {isLoading && <LoadingSpinner />}
            </Container>
        </ThemeProvider>
    );
};

export default NewTest;
