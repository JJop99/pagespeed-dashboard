// mui
import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const ErrorAlert = (props) => {
    const location = useLocation();

    useEffect(() => {
        props.setOpen(false);
    }, [location]);
    
    return (
        <Collapse in={props.open}>
            <Alert
                severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            props.setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
                {props.message.split("\n").map((i, key) => {
                    if (i !== "undefined") return <p key={key}>{i}</p>;
                })}
            </Alert>
        </Collapse>
    );
};
export default ErrorAlert;
