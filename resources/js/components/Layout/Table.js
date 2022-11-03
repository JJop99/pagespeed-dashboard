const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: grey[100],
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const Table = () => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        research(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        research(0, +event.target.value);
    };

    const research = (page, rows) => {
        const email = authCtx.user;
        axios
            .get(
                `/api/research`,{params:{  skip: page*rows, take: rows }}
                ,
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
                    setTests(res.data.urls); //combiare urls con tests nell api
                    setTotalUrls(res.data.total_urls);
                    return res;
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };
}