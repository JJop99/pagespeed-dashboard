import { Fragment } from 'react';
import classes from './Container.module.scss'

const Container = (props) => {
  return (
    <Fragment>
      <div className={classes.container}>{props.children}</div>
    </Fragment>
  );
};

export default Container;