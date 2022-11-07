import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <CircularProgress />
            <div className="pt-8">Please wait ...</div>
        </Box>
    );
};

export default LoadingSpinner;
