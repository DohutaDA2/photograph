import React from "react";
import classes from "./Input.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import moment from "moment";

const input = props => {
  let inputElement = null;
  let label = null;
  const inputClasses = [classes.InputElement];

  if (props.status && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  if (props.elementConfig.type === "email") {
    inputClasses.push(classes.Email);
  }

  if (props.label === "Email") {
    label = (
      <label className={[classes.Label, classes.LabelEmail].join(" ")}>
        {props.label}
      </label>
    );
  } else if (props.label === "Mật khẩu") {
    label = (
      <label className={[classes.Label, classes.LabelPassword].join(" ")}>
        {props.label}
      </label>
    );
  } else {
    label = (
      <label
        style={{
          display: "block",
          textAlign: "center",
          paddingBottom: "5px",
          color: "#a1a1a1"
        }}
      >
        {props.elementConfig.placeholder}
      </label>
    );
  }

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
          disabled={props.disabled}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={inputClasses.join(" ")}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    case "datepicker":
      inputElement = (
        <div style={{ display: "block", margin: "auto", maxWidth: "245px" }}>
          <DatePicker
            style={classes.DatePicker}
            className={classes.DatePicker}
            {...props.elementConfig}
            selected={props.value}
            onChange={props.changed}
            minDate={moment().subtract(24, "months")}
            maxDate={moment()}
          />
        </div>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
          disabled={props.disabled}
        />
      );
  }

  return (
    <div className={classes.Input}>
      {label}
      {inputElement}
    </div>
  );
};

export default input;
