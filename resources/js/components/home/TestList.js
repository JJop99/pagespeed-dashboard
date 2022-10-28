import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthContext from "../../store/auth-context";
import { Link, useNavigate } from "react-router-dom";
import classes from "./TestList.module.scss";
import { Button, styled, TablePagination } from "@mui/material";
import Moment from "react-moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { grey } from "@mui/material/colors";
import AddIcon from '@mui/icons-material/Add';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const TestList = () => {
    const [tests, setTests] = useState([]);
    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const formatDate = Moment;

    //pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [totalUrls, setTotalUrls] = useState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        research(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        research(0, +event.target.value);
    };

    const research = (page, rows) => {
        const email = authCtx.user;
        axios
            .post(
                `/api/research`,
                { email: email, page: page, take: rows },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.statusText === "OK") {
                    console.log(res);
                    setTests(res.data.urls); //combiare urls con tests nell api
                    setTotalUrls(res.data.total_urls);
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    useEffect(() => {
        research(page, rowsPerPage);
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
            <div className={classes.title}>
                Tests
                <div>
                    <Link to="/new-url"><AddIcon/></Link>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table
                    stickyHeader
                    sx={{ minWidth: 650, maxHeight: 220 }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Pagina</StyledTableCell>
                            <StyledTableCell align="right">Url</StyledTableCell>
                            <StyledTableCell align="right">
                                Date
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Delete
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tests.map((url) => (
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
                                    <div className={classes.url}>{url.url}</div>
                                </TableCell>
                                <TableCell align="right">
                                    <Moment format="HH:mm DD-MM-YYYY">
                                        {url.created_at}
                                    </Moment>
                                </TableCell>
                                <TableCell align="right">
                                    <DeleteOutlineIcon
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(url)}
                                    >
                                        Delete
                                    </DeleteOutlineIcon>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[8, 15, 25]}
                component="div"
                count={totalUrls}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Fragment>
    );
};

export default TestList;
