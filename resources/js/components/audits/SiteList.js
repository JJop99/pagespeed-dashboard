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
import { useNavigate, useLocation } from "react-router-dom";
import { TablePagination } from "@mui/material";
import { grey } from "@mui/material/colors";
import styled from "@emotion/styled";
import DeleteDialog from "../UI/DeleteDialog";
import EditDialog from "../UI/EditDialog";
import MyTable from "../Layout/MyTable";

const tableConstants = () => {
    return [
        {
            id: "url",
            title: "Url",
            render: (rowData) => {
                return (
                    <span>
                        <div className="table__titleUrl">{rowData.url}</div>
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
                        deleteApi={`${location.pathname.slice(
                            0,
                            location.pathname.lastIndexOf("/")
                        )}/deleteTests`}
                    />
                );
            },
        },
    ];
};

const SiteList = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Fragment>
            <div className="table__title">Tested Sites</div>

            <MyTable
                cols={tableConstants()}
                api={`${location.pathname.slice(
                    0,
                    location.pathname.lastIndexOf("/")
                )}/sites`}
                type="urls"
                total="total_urls"
                to="`${location.pathname.slice(0,location.pathname.lastIndexOf('/'))}/sitePerformances/search?url=url`"
                filter="url"
            />
        </Fragment>
    );
};

export default SiteList;
