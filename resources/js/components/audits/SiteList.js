import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteDialog from "../UI/DeleteDialog";
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
                to="`${location.pathname.slice(0,location.pathname.lastIndexOf('/'))}/sitePerformances/search?url= ${encodeURIComponent(item.url)}`"
                filter="url"
            />
        </Fragment>
    );
};

export default SiteList;
