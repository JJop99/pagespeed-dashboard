import React, { Fragment, useContext, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthContext from "./../../../store/auth-context";
import { Link, useNavigate } from "react-router-dom";
import classes from "./../TestList.module.scss";
import { Button, styled, TablePagination } from "@mui/material";
import Moment from "react-moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { grey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import DeleteDialog from "../../UI/DeleteDialog";
import LoadingSpinner from "../../UI/LoadingSpinner";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const Projects = () => {
    const [projects, setProjects] = useState([]);
    axios.defaults.withCredentials = true;
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const formatDate = Moment;

    //pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [totalProjects, setTotalProjects] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        research(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        research(0, +event.target.value);
    };

    const getProjects = (page, rows) => {
        setIsLoading(true);
        axios
            .get(
                `/api/projects`,
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
                    if (res.data.projects.length !== 0) {
                        setProjects(res.data.projects); //combiare urls con tests nell api
                        setTotalProjects(res.data.total_projects);
                    }

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

    useEffect(() => {
        getProjects(page, rowsPerPage);
    }, []);

    const handleDelete = (project) => {
        setIsLoading(true);
        axios
            .delete(
                `/api/deleteProject`,
                {
                    params: {
                        id: project.id,
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
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Fragment>
            {!isLoading && (
                <div>
                    <div className={classes.title}>
                        Projects
                        <div>
                            <Link to="/new-project">
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
                                    <StyledTableCell>Project</StyledTableCell>
                                    <StyledTableCell align="right">
                                        Date
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        Delete
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow
                                        onClick={() =>
                                            navigate(
                                                `/project/${project.id}/audits`
                                            )
                                        }
                                        key={project.name}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <div>{project.name}</div>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Moment
                                                className={classes.date}
                                                format="HH:mm DD-MM-YYYY"
                                            >
                                                {project.created_at}
                                            </Moment>
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <DeleteDialog
                                                title={project.name}
                                                delete={() =>
                                                    handleDelete(project)
                                                }
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
                        count={totalProjects}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            )}
            {isLoading && <LoadingSpinner />}
        </Fragment>
    );
};

export default Projects;
