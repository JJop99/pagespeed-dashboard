import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import AddIcon from "@mui/icons-material/Add";
import DeleteDialog from "../UI/DeleteDialog";
import EditDialog from "../UI/EditDialog";
import MyTable from "../Layout/MyTable";

const tableConstants = () => {
    return [
        {
            id: "title",
            title: "Test",
            render: (rowData) => {
                return <span>{rowData.title}</span>;
            },
        },
        {
            id: "url",
            title: "Url",
            render: (rowData) => {
                return (
                    <span>
                        <div className="table__url">{rowData.url}</div>
                    </span>
                );
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
                        to={location.pathname}
                        deleteApi={`${location.pathname.slice(0,location.pathname.lastIndexOf('/'))}/singleDelete`}
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
                        editApi={`${location.pathname.slice(0,location.pathname.lastIndexOf('/'))}/edit`}
                    />
                );
            },
        },
    ];
};

const TestList = () => {
    const navigate = useNavigate();
    const location = useLocation();

    

    return (
        <Fragment>
            <div className="table__title">
                Tests
                <div>
                    <Link to={location.pathname.slice(0, -1)}>
                        <AddIcon />
                    </Link>
                </div>
            </div>

            <MyTable
                cols={tableConstants()}
                api={location.pathname}
                type="urls"
                total="total_urls"
                to="`${location.pathname.slice(0, -1)}/${item.id}`"
                filter="created_at"
            />
        </Fragment>
    );
};

export default TestList;
