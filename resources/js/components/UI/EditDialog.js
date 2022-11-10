import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EditOutlineIcon from "@mui/icons-material/EditOutlined";
import { PropaneSharp } from "@mui/icons-material";
import { useRef, useState } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditDialog = (props) => {
    const [open, setOpen] = useState(false);
    const newNameInputRef = useRef();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        console.log(newNameInputRef.current.value);
    };

    const handleEdit = () => {
        axios
            .get(
                `/api${props.editApi}`,
                {
                    params: {
                        id: props.id,
                        newTitle: newNameInputRef.current.value,
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
                    navigate("/");
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div>
            <EditOutlineIcon
                variant="outlined"
                color="error"
                onClick={handleClickOpen}
            >
                Edit
            </EditOutlineIcon>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.title + "  edit"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The item {props.title} will be permanently changed.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="New Project Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputRef={newNameInputRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} variant="contained">
                        Close
                    </Button>
                    <Button
                        onClick={handleEdit}
                        variant="outlined"
                        color="error"
                    >
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditDialog;
