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
                
                <Link color="inherit" href="https://mumbleideas.it/it/">
                   Powered by <img src="/logo-mumble-black.svg" alt="SVG as an image" />
                </Link>
            </Typography>
        </div>
    );
};

export default Footer;
