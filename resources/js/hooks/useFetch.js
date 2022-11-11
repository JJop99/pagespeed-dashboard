import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useFetch = (order, orderBy, page, rows, api) => {
    axios.defaults.withCredentials = true;
    const location = useLocation();


    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        
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
                    if (res.statusText === "OK") {
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
        
    }, []);

    return {data: [data], totalData: totalData, isLoading: isLoading};
}

export default useFetch;