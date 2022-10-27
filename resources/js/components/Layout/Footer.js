import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import classes from "./Footer.module.scss";

const Footer = (props) => {
    return (
        <div className={classes.footer}>
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                {...props}
            >
                
                <a color="inherit" href="https://mumbleideas.it/it/" get="_blank">
                   Powered by <img src="/logo-mumble-black.svg" alt="SVG as an image" />
                </a>
            </Typography>
        </div>
    );
};

export default Footer;
