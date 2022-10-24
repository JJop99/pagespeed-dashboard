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
import { Link, useNavigate } from "react-router-dom";

function createData(url) {
    return { url };
}

const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const SiteList = () => {
    const [urls, setUrls] = useState([]);
    axios.defaults.withCredentials = true;
    const authCtx = useContext(AuthContext);

    const navigate = useNavigate();
    

    useEffect(() => {
        const email = authCtx.user;
        console.log(email);
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
                console.log(res);
                if (res.statusText === "OK") {
                    // ...
                    console.log("ciaoUrls");
                    return res;
                }
            })
            .then((data) => {
                //console.log(data.data.urls);
                setUrls(data.data.urls);

                console.log(urls);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    console.log(urls);

    useEffect(() => {
        axios.get("/api/test").then();
    }, []);

    

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Pagina</TableCell>
                        <TableCell align="right">Url</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {urls.map((url) => (
                        <TableRow
                           onClick={() => navigate(`/dashboard/${url.title}`,{state:{url: url.url}})}
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SiteList;
