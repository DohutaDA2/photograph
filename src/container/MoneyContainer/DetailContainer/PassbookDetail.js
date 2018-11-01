import React, { Component } from "react";
import Layout from "../../../hoc/Layout/Layout.js";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Modal from "../../../components/UI/Modal/Modal";
import Button from "../../../components/UI/Button/Button";
import moment from "moment";
import classes from "./PassbookDetail.css";
import { formatNum } from "../../../hoc/business/refineUI";
import { getLogs, calculate } from "../../../hoc/business/business";
import * as images from "../../../hoc/images";

class PassbookDetail extends Component {
  state = {
    loading: false,
    isEditing: false,
    isWithdrawing: false,
    isDespositing: false,
    isAccounting: false,
    passbook: {
      id: "",
      balance: 0,
      realBalance: 0,
      bankId: "",
      bankFullname: "",
      bankShortname: "",
      end: false,
      endDate: "",
      interestRate: "",
      paymentDesc: "",
      paymentName: "",
      paymentId: "",
      passbookName: "",
      opendate: "",
      termId: "",
      term: "",
      termDes: "",
      userId: "",
      idToken: "",
      log: []
    },
    actions: {
      edit: {
        name: "Sửa thông tin",
        config: {
          disabled: false
        },
        icon: images.edit
      },
      withdraw: {
        name: "Rút bớt",
        config: {
          disabled: false
        },
        icon: images.withdraw
      },
      deposit: {
        name: "Gửi thêm",
        config: {
          disabled: false
        },
        icon: images.deposit
      },
      accounting: {
        name: "Tất toán",
        config: {
          disabled: false
        },
        icon: images.accounting
      },
      closing: {
        name: "Thoát",
        config: {
          disabled: false
        },
        icon: images.exit
      }
    }
  };

  componentWillMount() {
    this.setState({ loading: true });
    this.loadData();
  }

  loadData = async () => {
    const query = new URLSearchParams(this.props.location.search);
    const data = {};
    for (let param of query.entries()) {
      data[param[0]] = param[1];
    }
    data.log = await getLogs(data.id);
    data.realBalance = calculate(
      data.log,
      data.balance,
      data.interestRate,
      data.unlimitRate,
      data.opendate,
      data.term,
      data.end,
      data.paymentId
    );
    const actions = {
      ...this.state.actions,
      edit: {
        ...this.state.actions.edit,
        config: {
          ...this.state.actions.edit.config,
          disabled: data.end === "true"
        },
        action: () => this.editAction(data.id)
      },
      withdraw: {
        ...this.state.actions.withdraw,
        config: {
          ...this.state.actions.withdraw.config,
          disabled:
            data.end === "true" ||
            new moment() <=
              new moment(data.opendate, "DD/MM/YYYY").subtract(15, "days")
        },
        action: () => this.withdrawAction(data.id)
      },
      deposit: {
        ...this.state.actions.deposit,
        config: {
          ...this.state.actions.deposit.config,
          disabled: true
        },
        action: () => this.depositAction(data.id)
      },
      accounting: {
        ...this.state.actions.accounting,
        config: {
          ...this.state.actions.accounting.config,
          disabled: data.end === "true"
        },
        action: () => this.accountingAction(data.id)
      },
      closing: {
        ...this.state.actions.closing,
        action: () => this.closeAction()
      }
    };
    this.setState({ loading: false, passbook: data, actions: actions });
  };

  saveData = () => {
    console.log("saved");
  };

  editAction = () => {
    const queryParams = [];
    const sendData = {
      ...this.state.passbook,
      isNew: false
    };
    for (let key in sendData) {
      queryParams.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(sendData[key])
      );
    }
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/form",
      search: "?" + queryString
    });
  };
  withdrawAction = () => {
    console.log("withdraw clicked");
    this.setState({ isWithdrawing: true });
    this.saveData();
  };
  depositAction = () => {
    console.log("deposit clicked");
    this.setState({ isDespositing: true });
    this.saveData();
  };
  accountingAction = () => {
    console.log("accounting clicked");
    this.setState({ isAccounting: true });
    this.saveData();
  };
  closeAction = () => {
    this.props.history.goBack();
  };

  modalCloseAction = () => {
    this.setState({
      isEditing: false,
      isWithdrawing: false,
      isDespositing: false,
      isAccounting: false,
      isClosing: false
    });
  };

  withdrawHandler = amount => {
    // sửa db
  };
  depositHandler = amount => {
    // sửa db
  };
  accountingHandler = option => {
    switch (option) {
      // tái tục gốc + lãi
      case "o1":
        break;
      // tái tục gốc + rút lãi
      case "02":
        break;
      // đóng sổ
      default:
        break;
    }
  };

  render() {
    // --- spinner ---
    let spinner = null;
    if (this.state.loading) {
      spinner = <Spinner />;
    }

    // --- action buttons ---
    let elements = [];
    for (let key in this.state.actions) {
      elements.push({
        id: key,
        config: this.state.actions[key]
      });
    }
    const buttons = elements.map(action => (
      <Button
        key={action.id}
        btnType="Action"
        {...action.config.config}
        clicked={action.config.action}
      >
        <div style={{ display: "column" }}>
          <img
            className={classes.Icon}
            src={action.config.icon}
            alt={action.config.name}
          />
          <p style={{ margin: "0", marginTop: "10px" }}>{action.config.name}</p>
        </div>
      </Button>
    ));

    // --- logs ---
    let logs = <p style={{ textAlign: "center", margin: "0" }}>Không có</p>;
    if (this.state.passbook.log.length !== 0) {
      logs = this.state.passbook.log.map(log => (
        <p key={log.id} className={classes.Row}>
          Giao dịch rút {formatNum(log.amount)} đ vào ngày {log.time}
        </p>
      ));
    }

    // --- modal ---
    let modal = null;
    if (this.state.isWithdrawing) {
      modal = (
        <Modal
          show={this.state.isWithdrawing}
          modalClosed={this.modalCloseAction}
        >
          <p>Withdrawing</p>
        </Modal>
      );
    }
    if (this.state.isDespositing) {
      modal = (
        <Modal
          show={this.state.isDespositing}
          modalClosed={this.modalCloseAction}
        >
          <p>Despositing</p>
        </Modal>
      );
    }
    if (this.state.isAccounting) {
      modal = (
        <Modal
          show={this.state.isAccounting}
          modalClosed={this.modalCloseAction}
        >
          <p>Accounting</p>
        </Modal>
      );
    }

    return (
      <div>
        {modal}
        {spinner}
        <div style={{ backgroundColor: "#f1f1f1", height: "100vh" }}>
          <Layout
            styles={{ borderRadius: "4px", position: "relative", top: "10%" }}
          >
            <p className={classes.Title}>
              CHI TIẾT SỔ TIẾT KIỆM{" "}
              {this.state.passbook.bankShortname.toUpperCase() +
                "-" +
                this.state.passbook.passbookName}
            </p>
            {/* actions zone */}
            <div className={classes.ActionBar}>{buttons}</div>
            {/* info zone */}
            <div className={classes.InfoZone}>
              <div className={classes.Row}>
                <span className={classes.Header}>Ngân hàng</span>
                <span className={classes.Content}>
                  {this.state.passbook.bankFullname || ""}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Ngày mở sổ</span>
                <span className={classes.Content}>
                  {this.state.passbook.opendate.toString()}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Kỳ hạn gửi</span>
                <span className={classes.Content}>
                  {this.state.passbook.termDes}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Lãi suất tiết kiệm</span>
                <span className={classes.Content}>
                  {this.state.passbook.interestRate}% (năm)
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Hình thức trả lãi</span>
                <span className={classes.Content}>
                  {this.state.passbook.paymentName}
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Gốc</span>
                <span className={classes.Content}>
                  {formatNum(parseFloat(this.state.passbook.balance))} đ
                </span>
              </div>
              <div className={classes.Row}>
                <span className={classes.Header}>Số dư</span>
                <span className={classes.Content} style={{ fontWeight: "700" }}>
                  {formatNum(this.state.passbook.realBalance || 0)} đ
                </span>
              </div>
            </div>
            {/* log zone */}
            <div className={classes.InfoZone}>
              <p style={{ textAlign: "center", margin: "0", padding: "5px" }}>
                Lịch sử giao dịch
              </p>
              {logs}
            </div>
          </Layout>
        </div>
      </div>
    );
  }
}

export default PassbookDetail;
