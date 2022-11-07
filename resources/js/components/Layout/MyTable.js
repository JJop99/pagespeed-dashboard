import { styled, TableCell, tableCellClasses, TableContainer, Table, Paper, TableHead, TableRow, TableBody, TablePagination } from "@mui/material";
import { grey } from "@mui/material/colors";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const MyTable = ({ cols, api, type, total }) => {
    axios.defaults.withCredentials = true;

    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const navigate = useNavigate();


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        research(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        research(0, +event.target.value);
    };

    const getData = (page, rows) => {
        
        axios
            .get(
                `/api/${api}`,
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
       getData(page, rowsPerPage);
    }, []);

   

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table
                    stickyHeader
                    sx={{ maxHeight: 220 }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            {cols.map((headCell, index) => (
                                <StyledTableCell key={index} align={index===0? "left": "right"}>
                                    {headCell.title}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
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
                                    <TableCell key={key} align={key===0? "left": "right"}>
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
        </Fragment>
    );
};

export default MyTable;
