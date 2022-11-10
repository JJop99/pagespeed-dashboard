import React, { Fragment, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import Moment from "react-moment";
import AddIcon from "@mui/icons-material/Add";
import LoadingSpinner from "../../UI/LoadingSpinner";
import MyTable from "../../Layout/MyTable";
import DeleteDialog from "../../UI/DeleteDialog";
import EditDialog from "../../UI/EditDialog";

const tableConstants = () => {
    return [
        {   
            id: "title",
            title: "Project",
            render: (rowData) => {
                return <span>{rowData.title}</span>;
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
                            format="DD-MM-YYYY HH:mm"
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
                        title={rowData.title}
                        id={rowData.id}
                        deleteApi="/deleteProject"
                        to={location.pathname}
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
                        title={rowData.title}
                        id={rowData.id}
                        editApi="/editProject"
                    />
                );
            },
        },
    ];
};

const Projects = (props) => {
    axios.defaults.withCredentials = true;
    const [isLoading, setIsLoading] = useState(false);

   



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
                        cols={tableConstants()}
                        api="/projects"
                        type="projects"
                        total="total_projects"
                        to="`/project/${item.id}/audits`"
                        filter="created_at"
                    />
                </div>
            )}
            {isLoading && <LoadingSpinner />}
        </Fragment>
    );
};

export default Projects;
