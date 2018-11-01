import React, { Component } from "react";
import classes from "./MoneyContainer.css";
import Layout from "../../hoc/Layout/Layout";
import Modal from "../../components/UI/Modal/Modal";
import Button from "../../components/UI/Button/Button";
import Summary from "./Summary/Summary";
import Passbooks from "../../components/Passbooks/Passbooks";
import Spinner from "../../components/UI/Spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import {
  loadPassbooks,
  getPassbooks,
  groupBy
} from "../../hoc/business/business";

export default class MoneyContainer extends Component {
  state = {
    loading: false,
    userInfo: {},
    total: 0,
    error: ""
  };

  async componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const userInfo = {
      userId: query.get("userId"),
      idToken: query.get("idToken")
    };

    this.setState({ userInfo: userInfo, loading: true });

    loadPassbooks(userInfo)
      .then(data => {
        this.setState({ loading: false, passbooks: data });
      })
      .catch(err => {
        console.log(err.code);
        this.setState({ loading: false, error: err });
      });

    // let p = await getPassbooks(userInfo);
    // this.setState({ loading: false, passbooks: p });
  }

  newPassbookHandler = () => {
    const queryParams = [];
    let data = {
      ...this.state.userInfo,
      isNew: true
    };
    for (let key in data) {
      queryParams.push(
        encodeURIComponent(key) +
          "=" +
          encodeURIComponent(data[key])
      );
    }
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/form",
      search: "?" + queryString
    });
  };

  closeModalHanlder = () => {
    this.setState({ error: "" });
  };

  detailPassbook = passbookId => {
    let passbook =
      this.state.passbooks.false.find(x => x.id === passbookId) ||
      this.state.passbooks.true.find(x => x.id === passbookId);
    passbook = {
      ...passbook,
      userId: this.state.userInfo.userId,
      idToken: this.state.userInfo.idToken
    };

    const queryParams = [];
    for (let key in passbook) {
      queryParams.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(passbook[key])
      );
    }
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/detail",
      search: "?" + queryString
    });
  };

  render() {
    let notAccounted = [];
    let accounted = [];
    let count = 0,
      totalMoney = 0;

    if (this.state.passbooks && this.state.passbooks.false) {
      this.state.passbooks.false.forEach(p => {
        count++;
        totalMoney += p.balance;
      });
      const temp = groupBy(this.state.passbooks.false, "bankFullname");
      for (let key in temp) {
        notAccounted.push(
          <Passbooks
            key={key}
            groupName={key}
            passbooks={temp[key]}
            moreHandler={this.detailPassbook}
          />
        );
      }
    }
    if (this.state.passbooks && this.state.passbooks.true) {
      accounted = (
        <Passbooks
          key={accounted}
          groupName="đã tất toán"
          passbooks={this.state.passbooks.true}
          moreHandler={this.detailPassbook}
        />
      );
    }

    let summary = (
      <Summary
        isLoading={this.state.loading}
        total={totalMoney}
        count={count}
        clicked={this.newPassbookHandler}
        error={this.state.error}
      />
    );

    let spinner = null;
    if (this.state.loading) {
      spinner = <Spinner />;
    }
    return (
      <div style={{ backgroundColor: "#1fcecb", height: "100vh" }}>
        {spinner}
        <Modal show={this.state.error} modalClosed={this.closeModalHanlder}>
          <div>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size="3x"
              className={classes.ModalIcon}
            />
          </div>
          <p style={{ textAlign: "center" }}>Mã lỗi: {this.state.error.code}</p>
          <p className={classes.ModalMessage}>{this.state.error.message}</p>
          <p style={{ textAlign: "center" }}>
            Vui lòng liên hệ với nhà cung cấp dịch vụ
          </p>
          <Button btnType="OK" clicked={this.closeModalHanlder}>
            OK
          </Button>
        </Modal>
        <Layout>
          {summary}
          {notAccounted}
          {accounted}
        </Layout>
      </div>
    );
  }
}
