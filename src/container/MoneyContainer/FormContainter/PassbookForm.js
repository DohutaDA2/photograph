import React, { Component } from "react";
import classes from "./PassbookForm.css";
import Layout from "../../../hoc/Layout/Layout";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Modal from "../../../components/UI/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import {
  getBanks,
  getTerms,
  getPayments,
  saveNewPassbook,
  updatePassbook
} from "../../../hoc/business/business";
import { toShortDate } from "../../../hoc/business/refineUI";
import { checkValidityForm } from "../../../hoc/business/checkValidity";
import moment from "moment";

class NewPassbook extends Component {
  state = {
    loading: false,
    isNew: true,
    title: "thêm sổ tiết kiệm",
    errorMessage: [],
    error: "",
    userInfo: {
      idToken: "",
      userId: ""
    },
    controls: {
      passbookName: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Tên sổ tiết kiệm",
          disabled: false
        },
        value: "",
        validation: {
          required: false
        },
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      bankid: {
        elementType: "select",
        elementConfig: {
          placeholder: "Chọn ngân hàng mở sổ",
          options: []
        },
        value: "",
        unlimitRate: 0,
        validation: {},
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      termid: {
        elementType: "select",
        elementConfig: {
          placeholder: "Chọn kỳ hạn gửi",
          options: []
        },
        value: "",
        term: 0,
        validation: {},
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      paymentid: {
        elementType: "select",
        elementConfig: {
          placeholder: "Chọn phương thức trả lãi",
          options: []
        },
        value: "",
        validation: {},
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      interestRate: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Lãi suất tiết kiệm",
          disabled: true
        },
        value: "",
        validation: {
          required: true,
          isGreaterThan0: true
        },
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      opendate: {
        elementType: "datepicker",
        elementConfig: {
          placeholder: "Chọn ngày mở sổ"
        },
        value: moment(),
        validation: {
          required: true
        },
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      balance: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Số tiền gốc"
        },
        value: "",
        validation: {
          required: true,
          isGreaterThan0: true
        },
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      end: false
    }
  };

  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const userInfo = {
      userId: query.get("userId"),
      idToken: query.get("idToken")
    };
    const isNew = query.get("isNew") === "true" ? true : false;
    this.setState({ loading: true });
    this.loadData(userInfo, isNew);
  }

  loadData = async (userInfo, isNew) => {
    let defaultControls = { ...this.state.controls };
    try {
      const data = {};
      let banks = await getBanks();
      let terms = await getTerms();
      let payments = await getPayments();
      let banksOptions = banks.map(bank => {
        return {
          value: bank.id,
          displayValue: bank.fullname,
          shortname: bank.shortname,
          unlimitRate: bank.unlimitRate
        };
      });
      let termsOptions = terms.map(term => {
        return {
          value: term.id,
          displayValue: term.description,
          term: term.term
        };
      });
      let paymentsOptions = payments.map(payment => {
        return {
          value: payment.id,
          displayValue: payment.name,
          description: payment.description
        };
      });

      let updatedControls = { ...this.state.controls };
      updatedControls.bankid.elementConfig.options = banksOptions;
      updatedControls.termid.elementConfig.options = termsOptions;
      updatedControls.paymentid.elementConfig.options = paymentsOptions;
      
      if (isNew) {
        updatedControls.bankid.value = banks[0].id;
        updatedControls.bankid.unlimitRate = banks[0].unlimitRate;
        updatedControls.termid.value = terms[0].id;
        updatedControls.termid.term = terms[0].term;
        updatedControls.paymentid.value = payments[0].id;
        updatedControls.interestRate.value = banks[0].unlimitRate;

        console.log(updatedControls);
      } else {
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {
          data[param[0]] = param[1];
        }
        delete data.userId;
        delete data.idToken;
        delete data.isNew;

        updatedControls.bankid.value = data.bankId;
        updatedControls.bankid.unlimitRate = data.unlimitRate;
        updatedControls.termid.value = data.termId;
        updatedControls.termid.term = data.term;
        updatedControls.paymentid.value = data.paymentId;
        updatedControls.interestRate.value = data.interestRate;
        updatedControls.interestRate.elementConfig.disabled =
          data.termId === "t00" ? true : false;
        updatedControls.passbookName.value = data.passbookName;
        updatedControls.balance.value = data.balance;
        updatedControls.opendate.value = moment(data.opendate, "DD/MM/YYYY");
      }
      this.setState({
        loading: false,
        passbook: data.id ? data : null,
        controls: updatedControls,
        userInfo: userInfo,
        isNew: isNew
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: { code: "GET_INFO", message: "Lỗi trong quá trình lấy dữ liệu" },
        controls: defaultControls
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  inputChangedHandler = (event, controlName) => {
    let updatedControls = { ...this.state.controls };

    if (controlName === "termid" && event.target.value === "t00") {
      updatedControls = {
        ...updatedControls,
        termid: {
          ...updatedControls.termid,
          status: checkValidityForm(
            controlName,
            event.target.value,
            this.state.controls[controlName].validation
          ),
          value: event.target.value,
          term: 0,
          touched: true
        }
      };
      updatedControls = {
        ...updatedControls,
        interestRate: {
          ...updatedControls.interestRate,
          value: updatedControls.bankid.unlimitRate,
          elementConfig: {
            ...updatedControls.interestRate.elementConfig,
            disabled: true
          }
        }
      };
    } else if (controlName === "termid" && event.target.value !== "t00") {
      updatedControls = {
        ...updatedControls,
        termid: {
          ...updatedControls.termid,
          status: checkValidityForm(
            controlName,
            event.target.value,
            this.state.controls[controlName].validation
          ),
          value: event.target.value,
          term: updatedControls.termid.elementConfig.options.find(
            x => x.value === event.target.value
          ).term,
          touched: true
        }
      };
      updatedControls = {
        ...updatedControls,
        interestRate: {
          ...updatedControls.interestRate,
          elementConfig: {
            ...updatedControls.interestRate.elementConfig,
            disabled: false
          }
        }
      };
    } else if (controlName === "bankid") {
      updatedControls = {
        ...updatedControls,
        bankid: {
          ...updatedControls.bankid,
          status: checkValidityForm(
            controlName,
            event.target.value,
            updatedControls.bankid.validation
          ),
          value: event.target.value,
          unlimitRate: updatedControls.bankid.elementConfig.options.find(
            x => x.value === event.target.value
          ).unlimitRate,
          touched: true
        }
      };
      updatedControls = {
        ...updatedControls,
        interestRate: {
          ...updatedControls.interestRate,
          elementConfig: {
            ...updatedControls.interestRate.elementConfig
          },
          value: updatedControls.bankid.unlimitRate
        }
      };
    } else {
      updatedControls = {
        ...updatedControls,
        [controlName]: {
          ...updatedControls[controlName],
          status: checkValidityForm(
            controlName,
            controlName !== "opendate" ? event.target.value : event,
            this.state.controls[controlName].validation
          ),
          value: controlName !== "opendate" ? event.target.value : event,
          touched: true
        }
      };
    }
    this.setState({ controls: updatedControls });
  };

  okAddHandler = event => {
    event.preventDefault();

    let errorMessage = [];
    if (this.state.controls.balance.value <= 0)
      errorMessage.push("Số tiền gốc không hợp lệ");
    else
      for (let key in this.state.controls) {
        if (this.state.controls[key].status)
          if (this.state.controls[key].status.errorMessage) {
            errorMessage = errorMessage.concat(
              this.state.controls[key].status.errorMessage
            );
          }
      }
    this.setState({ errorMessage: errorMessage });

    if (errorMessage.length === 0) {
      this.setState({ loading: true });
      let passbookData = {
        balance: this.state.controls.balance.value,
        bankId: this.state.controls.bankid.value,
        end: this.state.controls.end,
        enddate: this.state.controls.opendate.value
          .add(this.state.controls.termid.term, "months")
          .toDate(),
        interestRate: this.state.controls.interestRate.value,
        interestPayment: this.state.controls.paymentid.value,
        name: this.state.controls.passbookName.value,
        opendate: this.state.controls.opendate.value.toDate(),
        termId: this.state.controls.termid.value
      };

      if (this.state.userInfo.isNew) {
        saveNewPassbook(passbookData)
          .then(res => {
            // console.log(res);
            this.setState({ loading: false });
            this.redirect();
          })
          .catch(err => {
            console.log(err);
            this.setState({ loading: false, error: err });
          });
      } else {
        updatePassbook(this.state.passbook.id, passbookData)
          .then(res => {
            // console.log(res);
            this.setState({ loading: false });
            this.redirect();
          })
          .catch(err => {
            console.log(err);
            this.setState({ loading: false, error: err });
          });
      }
    }
  };
  redirect = () => {
    const queryParams = [];
    const sendData = {
      ...this.state.passbook,
      passbookName: this.state.controls.passbookName.value,
      balance: this.state.controls.balance.value,
      bankid: this.state.controls.bankid.value,
      bankFullname: this.state.controls.bankid.elementConfig.options.find(
        x => x.value === this.state.controls.bankid.value
      ).displayValue,
      bankShortname: this.state.controls.bankid.elementConfig.options.find(
        x => x.value === this.state.controls.bankid.value
      ).shortname,
      opendate: this.state.controls.opendate.value.format("DD/MM/YYYY"),
      termId: this.state.controls.termid.value,
      termDes: this.state.controls.termid.elementConfig.options.find(
        x => x.value === this.state.controls.termid.value
      ).displayValue,
      term: this.state.controls.termid.elementConfig.options.find(
        x => x.value === this.state.controls.termid.value
      ).term,
      paymentId: this.state.controls.paymentid.value,
      paymentDesc: this.state.controls.paymentid.elementConfig.options.find(
        x => x.value === this.state.controls.paymentid.value
      ).description,
      unlimitRate: this.state.controls.bankid.unlimitRate
    };
    // console.log(sendData);
    for (let key in sendData) {
      queryParams.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(sendData[key])
      );
    }
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/detail",
      search: "?" + queryString
    });
  };

  cancelHandler = event => {
    event.preventDefault();
    this.props.history.goBack();
  };

  closeModalHanlder = () => {
    this.setState({ errorMessage: [] });
  };

  fatalHandler = () => {
    this.setState({ error: null });
  };

  render() {
    let spinner = null;
    if (this.state.loading) {
      spinner = <Spinner />;
    }

    const formElementsArray = [];
    for (let key in this.state.controls) {
      if (key !== "end")
        formElementsArray.push({
          id: key,
          config: this.state.controls[key]
        });
    }

    let form = (
      <form onSubmit={event => this.okAddHandler(event)}>
        {formElementsArray.map(formElement => {
          return (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              disabled={formElement.config.elementConfig.disabled}
              value={formElement.config.value}
              status={!formElement.config.status.isValid}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          );
        })}
        <div style={{ display: "table", margin: "auto" }}>
          <Button
            btnType="OK"
            css={{ width: "150px", display: "inline", margin: "0 5px 0 0" }}
          >
            OK
          </Button>
          <Button
            btnType="Cancel"
            css={{ width: "150px", display: "inline" }}
            clicked={event => this.cancelHandler(event)}
          >
            HUỶ
          </Button>
        </div>
      </form>
    );
    return (
      <div>
        {spinner}
        <Modal show={this.state.error} modalClosed={this.fatalHandler}>
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
          <Button btnType="OK" clicked={this.fatalHandler}>
            OK
          </Button>
        </Modal>
        <Modal
          show={this.state.errorMessage.length !== 0}
          modalClosed={this.closeModalHanlder}
        >
          <div>
            <FontAwesomeIcon
              icon={faInfoCircle}
              size="3x"
              className={classes.ModalIcon}
            />
          </div>
          {this.state.errorMessage.map((message, index) => (
            <p key={index} className={classes.ModalMessage}>
              {message}
            </p>
          ))}
          <Button btnType="OK" clicked={this.closeModalHanlder}>
            OK
          </Button>
        </Modal>
        <div style={{ backgroundColor: "#f1f1f1", height: "100vh" }}>
          <Layout
            styles={{ borderRadius: "4px", position: "relative", top: "10%" }}
          >
            <p className={classes.Title}>{this.state.title.toUpperCase()}</p>
            {form}
          </Layout>
        </div>
      </div>
    );
  }
}

export default NewPassbook;
