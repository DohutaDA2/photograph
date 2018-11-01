import React from "react";
import classes from "./Passbook.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const Passbook = props => (
  <div className={classes.Card} onClick={props.cardCkicked}>
    <p className={classes.Name} style={{ display: "inline-block" }}>
      {props.passbookName}
    </p>

    <button className={classes.ButtonMore} onClick={props.moreClicked}>
      <FontAwesomeIcon icon={faEllipsisV} />
    </button>
    <div className={classes.Row}>
      <span className={classes.Cell} style={{ fontWeight: "500" }}>
        {props.balance}
      </span>
      <span className={classes.Cell + " " + classes.CellRight}>
        {props.termDes}
      </span>
      <span className={classes.Cell + " " + classes.CellLeft}>
        {"" + props.interestRate + "%"}
      </span>
      <span
        className={classes.Cell + " " + classes.CellRight}
        style={{ textAlign: "right" }}
      >
        {props.openDate}
      </span>
    </div>
  </div>
);

export default Passbook;
