import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AuthContext from "../../store/auth-context";
import { useNavigate } from "react-router-dom";

const SiteList = () => {
    const [urls, setUrls] = useState([]);
    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const email = authCtx.user;
        axios
            .post(
                `/api/research`,
                { email: email },
                {
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                if (res.statusText === "OK") {
                    setUrls(res.data.urls);
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Pagina</TableCell>
                        <TableCell align="right">Url</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {urls.map((url) => (
                        <TableRow
                            onClick={() =>
                                navigate(`/dashboard/${url.title}`, {
                                    state: { id: url.id },
                                })
                            }
                            key={url.title}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {url.title}
                            </TableCell>
                            <TableCell align="right"> {url.url}</TableCell>
                            <TableCell align="right">
                                {url.created_at}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SiteList;
