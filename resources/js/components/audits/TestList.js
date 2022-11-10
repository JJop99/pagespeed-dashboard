import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled, TablePagination } from "@mui/material";
import Moment from "react-moment";
import { grey } from "@mui/material/colors";
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
                        title={rowData.title}
                        id={rowData.id}
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
