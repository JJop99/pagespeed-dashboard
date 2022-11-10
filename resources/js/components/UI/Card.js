import classes from "./Card.module.scss";
const Card = (props) => {
    return <div className="card">{props.children}</div>;
};

export default Card;
