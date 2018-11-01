import React, { Component } from "react";
import classes from "./Welcome.css";
import Button from "../UI/Button/Button";
import Layout from "../../hoc/Layout/Layout";
import { logo } from "../../hoc/images";

export default class Welcome extends Component {
  firstTimeHandler = () => {
    this.props.history.push("/login");
  };

  regularHandler = () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <div style={{ backgroundColor: "#d65219", height: "100vh" }}>
        <Layout>
          <img className={classes.Logo} src={logo} alt="MoneyLover logo" />
          <p className={classes.Message}>
            Lên kế hoạch tài chính thông minh và từng bước tiết kiệm để hiện
            thực hoá ước mơ.
          </p>
          <div
            style={{
              display: "block",
              position: "sticky",
              top: "60%",
            }}
          >
            <Button btnType="PrimaryOrange" clicked={this.firstTimeHandler}>
              LẦN ĐẦU SỬ DỤNG MONEY LOVER
            </Button>
            <Button btnType="SecondaryOrange" clicked={this.regularHandler}>
              ĐÃ SỬ DỤNG MONEY LOVER
            </Button>
          </div>
        </Layout>
      </div>
    );
  }
}
