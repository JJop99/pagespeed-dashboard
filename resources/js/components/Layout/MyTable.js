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
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));





function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, cols} = props;
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
                        sortDirection={
                            orderBy === headCell.id ? order : false
                        }
                    >

                        {index < cols.length-2 && <TableSortLabel
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
                        </TableSortLabel>}
                        {index >= cols.length-2 && <span>{headCell.title}</span>}
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

const MyTable = ({ cols, api, type, total }) => {
    axios.defaults.withCredentials = true;

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("created_at");
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const navigate = useNavigate();

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        getData(isAsc ? "desc" : "asc", property, page, rowsPerPage);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getData(order, orderBy, newPage, rowsPerPage );
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getData(order, orderBy, 0, +event.target.value );
    };

    const getData = (order, orderBy, page, rows) => {
        axios
            .get(
                `/api/${api}`,
                { params: { order: order, filter: orderBy, skip: page * rows, take: rows } },
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
                        setData(res.data[type]); //combiare urls con tests nell api
                        setTotalData(res.data[total]);
                    }

                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    useEffect(() => {
        getData(order, orderBy, page, rowsPerPage );
    }, []);

    return (
        <Fragment>
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
                        {data.map(
                            (item, index) => (
                                <TableRow
                                    onClick={() =>
                                        navigate(`/project/${item.id}/audits`)
                                    }
                                    key={index}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    {cols.map((col, key) => (
                                        <TableCell
                                            key={key}
                                            align={key === 0 ? "left" : "right"}
                                        >
                                            {col.render(item)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        )}
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
        </Fragment>
    );
};

export default MyTable;
