// mui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// react
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// axios
import axios from "axios";

const DeleteDialog = (props) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        axios
            .delete(
                `/api${props.deleteApi}`,
                {
                    params: {
                        id: props.id,
                    },
                },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.statusText === "OK") {
                    location.reload();
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div>
            <DeleteOutlineIcon
                variant="outlined"
                color="error"
                onClick={handleClickOpen}
            >
                Delete
            </DeleteOutlineIcon>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.title + " cancellation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The item {props.title} will be permanently deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={handleClose}
                        variant="contained"
                        color="info"
                    >
                        Disagree
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="outlined"
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteDialog;
