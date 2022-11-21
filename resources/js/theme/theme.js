import { createTheme } from "@mui/material";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
    palette: {
        close: createColor("#111827"),
        edit: createColor("#2e7d32"),
    },
});

export default theme;