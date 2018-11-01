import React from "react";
import classes from "./Layout.css";

const Layout = props => (
  <main className={classes.Body} style={props.styles}>
    <div className={classes.Container}>{props.children}</div>
  </main>
);

export default Layout;
