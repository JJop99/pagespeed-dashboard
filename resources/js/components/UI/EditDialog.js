// mui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    TextField,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import EditOutlineIcon from "@mui/icons-material/EditOutlined";

// react
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// axios
import axios from "axios";
import theme from "../../theme/theme";



const EditDialog = (props) => {
    const [open, setOpen] = useState(false);
    const newNameInputRef = useRef();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        setOpen(false);
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
                if (res.status === 200) {
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
            <EditOutlineIcon
                variant="outlined"
                color="error"
                onClick={handleClickOpen}
            >
                Edit
            </EditOutlineIcon>
            <ThemeProvider theme={theme}>
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
                            label="New title"
                            type="text"
                            fullWidth
                            variant="standard"
                            inputRef={newNameInputRef}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            onClick={handleClose}
                            variant="contained"
                            color="close"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleEdit}
                            variant="outlined"
                            color="edit"
                        >
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </div>
    );
};

export default EditDialog;
