import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthContext from "../../store/auth-context";
import { useNavigate } from "react-router-dom";
import classes from "./TestList.module.scss";
import { Button, TablePagination } from "@mui/material";

const TestList = () => {
    const [tests, setTests] = useState([]);
    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    //pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const email = authCtx.user;
        axios
            .post(
                `/api/research`,
                { email: email },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.statusText === "OK") {
                    setTests(res.data.urls); //combiare urls con tests nell api
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    const handleDelete = (url) => {
        
        axios
            .delete(
                `/api/singleDelete`,
                {
                    params: {
                        email: authCtx.user,
                        url: url.url,
                        created_at: url.created_at,
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
                    navigate("/home");
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <Fragment>
            <div>Tests</div>
            <TableContainer component={Paper}>
                <Table
                    stickyHeader
                    sx={{ minWidth: 650, maxHeight: 220 }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Pagina</TableCell>
                            <TableCell align="right">Url</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tests
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((url) => (
                                <TableRow
                                    onClick={() =>
                                        navigate(`/dashboard/${url.title}`, {
                                            state: { id: url.id },
                                        })
                                    }
                                    key={url.title}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <div>{url.title}</div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className={classes.url}>
                                            {url.url}
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        {url.created_at}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(url)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[8, 15, 25]}
                component="div"
                count={tests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Fragment>
    );
};

export default TestList;
