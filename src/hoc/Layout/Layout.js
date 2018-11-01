import React from "react";
import classes from "./Layout.css";

const Layout = props => (
  <>
    <main className={classes.Body} style={props.styles}>
      <div className={classes.Container}>{props.children}</div>
    </main>
    <p
      style={{
        textAlign: "center",
        fontSize: "12px",
        fontWeight: "300",
        position: "sticky",
        top:'95%'
      }}
    >
      ver 0.8
    </p>
  </>
);

export default Layout;
