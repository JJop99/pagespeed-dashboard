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
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Table.module.scss";
import { Button, styled, TablePagination } from "@mui/material";
import Moment from "react-moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { grey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const TestList = () => {
    const [audits, setAudits] = useState([]);
    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const formatDate = Moment;
    const location = useLocation();
    console.log(location.pathname.slice(0, -1));
    //pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [totalAudits, setTotalAudits] = useState();

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
        axios
            .get(
                `/api${location.pathname}`,
                { params: { skip: page * rows, take: rows } },
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
                    setAudits(res.data.urls); //combiare urls con tests nell api
                    setTotalAudits(res.data.total_urls);
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

    const handleDelete = (audit) => {
        
        console.log(`/api
        ${location.pathname.slice(
            0,
            location.pathname.lastIndexOf("/")
        )} /singleDelete`);
        axios
            .delete(
                `/api${location.pathname.slice(0,location.pathname.lastIndexOf("/"))}/singleDelete`,
                {
                    params: {
                        url: audit.url,
                        created_at: audit.created_at,
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
                    <Link to={location.pathname.slice(0, -1)}>
                        <AddIcon />
                    </Link>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table
                    stickyHeader
                    sx={{ maxHeight: 220 }}
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
                        {audits.map((audit) => (
                            <TableRow
                                onClick={() =>
                                    navigate(
                                        `${location.pathname.slice(0, -1)}/${
                                            audit.id
                                        }`
                                    )
                                }
                                key={audit.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <div>{audit.title}</div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={classes.url}>
                                        {audit.url}
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <Moment
                                        className={classes.date}
                                        format="HH:mm DD-MM-YYYY"
                                    >
                                        {audit.created_at}
                                    </Moment>
                                </TableCell>
                                <TableCell align="right">
                                    <DeleteOutlineIcon
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(audit)}
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
                count={totalAudits}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Fragment>
    );
};

export default TestList;
