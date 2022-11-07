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
import { useNavigate } from "react-router-dom";
import classes from "./Table.module.scss";
import { Button, TablePagination } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { grey } from "@mui/material/colors";
import styled from "@emotion/styled";
import DeleteDialog from "../UI/DeleteDialog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const SiteList = () => {
    const [urls, setUrls] = useState([]);
    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    //pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [totalUrls, setTotalUrls] = useState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getSites(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getSites(0, +event.target.value);
    };

    const getSites = (page, rows) => {
        const email = authCtx.user;
        axios
            .get(
                `/api${location.pathname.slice(
                    0,
                    location.pathname.lastIndexOf("/")
                )}/sites`,
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
                    setUrls(res.data.urls);
                    setTotalUrls(res.data.total_urls);
                    console.log(res);
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    useEffect(() => {
        getSites(page, rowsPerPage);
    }, []);

    const handleDelete = (url) => {
        axios
            .delete(
                `/api${location.pathname.slice(
                    0,
                    location.pathname.lastIndexOf("/")
                )}/deleteTests`,
                {
                    params: {
                        url: url.url,
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
            {" "}
            <div className={classes.title}>Tested Sites</div>
            <TableContainer component={Paper}>
                <Table
                    stickyHeader
                    sx={{ maxHeight: 220 }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sito</StyledTableCell>
                            <StyledTableCell align="right">
                                Delete
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {urls.map((url, id) => (
                            <TableRow
                                onClick={() =>
                                    navigate(
                                        `${location.pathname.slice(
                                            0,
                                            location.pathname.lastIndexOf("/")
                                        )}/sitePerformances/${id}`,
                                        {
                                            state: { url: url.url },
                                        }
                                    )
                                }
                                key={id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    <div className={classes.titleUrl}>
                                        {url.url}
                                    </div>
                                </TableCell>
                                <TableCell
                                    align="right"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DeleteDialog
                                        title={url.url}
                                        delete={() => handleDelete(url)}
                                    />
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

export default SiteList;
