import React, { Fragment, useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import AddIcon from "@mui/icons-material/Add";
import LoadingSpinner from "../../UI/LoadingSpinner";
import MyTable from "../../Layout/MyTable";
import DeleteDialog from "../../UI/DeleteDialog";
import EditDialog from "../../UI/EditDialog";

const tableConstants = (handleEdit, handleDelete) => {
    return [
        {   
            id: "name",
            title: "Project",
            render: (rowData) => {
                return <span>{rowData.name}</span>;
            },
        },
        {
            id: "created_at",
            title: "Date",
            render: (rowData) => {
                return (
                    <span>
                        <Moment
                            className="table__date"
                            format="HH:mm DD-MM-YYYY"
                        >
                            {rowData.created_at}
                        </Moment>
                    </span>
                );
            },
        },

        {
            id: "delete",
            title: "Delete",
            render: (rowData) => {
                return (
                    <DeleteDialog
                        onClick={(e) => e.stopPropagation()}
                        title={rowData.name}
                        delete={() => handleDelete(rowData)}
                    />
                );
            },
        },
        {
            id: "edit",
            title: "Edit",
            render: (rowData) => {
                return (
                    <EditDialog
                        onClick={(e) => e.stopPropagation()}
                        title={rowData.name}
                        id={rowData.id}
                        edit={handleEdit}
                    />
                );
            },
        },
    ];
};

const Projects_newTable = (props) => {
    axios.defaults.withCredentials = true;
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const formatDate = Moment;
    const api = "projects";

   

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

    const handleEdit = (id, newName) => {
        setIsLoading(true);
        console.log(newName);
        axios
            .get(
                `/api/editProject`,
                {
                    params: {
                        id: id,
                        name: newName,
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
                    <div className="table__title">
                        Projects
                        <div>
                            <Link to="/new-project">
                                <AddIcon />
                            </Link>
                        </div>
                    </div>

                    <MyTable
                        cols={tableConstants(handleEdit, handleDelete)}
                        api={api}
                        type="projects"
                        total="total_projects"
                    />
                </div>
            )}
            {isLoading && <LoadingSpinner />}
        </Fragment>
    );
};

export default Projects_newTable;
