// mui
import {
    styled,
    TableCell,
    tableCellClasses,
    TableContainer,
    Table,
    Paper,
    TableHead,
    TableRow,
    TableBody,
    TablePagination,
    TableSortLabel,
    Box,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { visuallyHidden } from "@mui/utils";

import axios from "axios";
// axios
import { Fragment, useEffect, useState } from "react";

// react
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// UI
import LoadingSpinner from "../UI/LoadingSpinner";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, cols } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {cols.map((headCell, index) => (
                    <StyledTableCell
                        key={index}
                        align={index === 0 ? "left" : "right"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {index < cols.length - 2 && (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                    orderBy === headCell.id ? order : "asc"
                                }
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.title}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        )}
                        {/*caso tabella siti*/}
                        {cols.length <= 2 && index === 0 && (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                    orderBy === headCell.id ? order : "asc"
                                }
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.title}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        )}
                        {index >= cols.length - 2 && cols.length > 2 && (
                            <span>{headCell.title}</span>
                        )}
                        {cols.length <= 2 && index > 0 && (
                            <span>{headCell.title}</span>
                        )}
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    onRequestSort: PropTypes.func.isRequired,
};

const MyTable = ({ cols, api, type, total, to, filter }) => {
    axios.defaults.withCredentials = true;

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState(filter);
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [isLoading, setIsLoading] = useState(false);
    const colLength = cols.length;
    let colIsLong;

    if (colLength > 2) colIsLong = true;
    else colIsLong = false;

    const navigate = useNavigate();
    const location = useLocation();

    const handleRequestSort = (event, property) => {
        console.log("order");
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        getData(isAsc ? "desc" : "asc", property, page, rowsPerPage);
    };

    const handleChangePage = (event, newPage) => {
        console.log("page");

        setPage(newPage);
        getData(order, orderBy, newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log("row");

        setRowsPerPage(+event.target.value);
        setPage(0);
        getData(order, orderBy, 0, +event.target.value);
    };

    const getData = (order, orderBy, page, rows) => {
        setIsLoading(true);

        axios
            .get(
                `/api${api}`,
                {
                    params: {
                        order: order,
                        filter: orderBy,
                        skip: page * rows,
                        take: rows,
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
                if (res.status === 200) {
                    console.log(res);
                    if (res.data[type].length !== 0) {
                        setData(res.data[type]); //combiare urls con tests nell api
                        setTotalData(res.data[total]);
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
        getData(order, orderBy, page, rowsPerPage);
    }, []);

    return (
        <Fragment>
            {!isLoading && (
                <div>
                    <TableContainer component={Paper}>
                        <Table
                            stickyHeader
                            sx={{ maxHeight: 220 }}
                            aria-label="simple table"
                        >
                            <EnhancedTableHead
                                cols={cols}
                                order={order}
                                orderBy={orderBy}
                                getData={getData}
                                onRequestSort={handleRequestSort}
                            />

                            <TableBody>
                                {data.map((item, index) => (
                                    <TableRow
                                        onClick={() => navigate(eval(to))}
                                        key={index}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        {cols.map((col, key) => (
                                            <TableCell
                                                onClick={
                                                    colIsLong
                                                        ? key >= colLength - 2
                                                            ? (event) =>
                                                                  event.stopPropagation()
                                                            : () => {}
                                                        : key === 1
                                                        ? (event) =>
                                                              event.stopPropagation()
                                                        : () => {}
                                                }
                                                key={key}
                                                align={
                                                    key === 0 ? "left" : "right"
                                                }
                                            >
                                                {col.render(item)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[8, 15, 25]}
                        component="div"
                        count={totalData}
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

export default MyTable;
