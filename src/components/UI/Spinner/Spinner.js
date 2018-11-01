import React from "react";

import classes from "./Spinner.css";

const spinner = () => (
  <div className={classes.spinner}>
    <div className={classes.doublebounce1} />
    <div className={classes.doublebounce2} />
  </div>
);

export default spinner;
