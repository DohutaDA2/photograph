import React, { Component } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";
import Layout from "../../hoc/Layout/Layout";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import classes from "./Login.css";
import { checkValidityLogin } from "../../hoc/business/checkValidity";
import { callServer } from "../../hoc/business/loginHandler";

class Login extends Component {
  state = {
    loading: false,
    isSignUp: false,
    errorMessage: [],
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Mật khẩu"
        },
        value: "",
        validation: {
          required: true,
          minLength: 8,
          isRequireLetterNumberSymbol: true
        },
        status: {
          valid: false,
          errorMessage: ""
        },
        touched: false
      }
    }
  };

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        status: checkValidityLogin(
          controlName,
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  /**
   * Signup process handler
   */
  signUpHandler = event => {
    event.preventDefault();
    let errorMessage = [];
    if (
      this.state.controls.email.value === "" &&
      this.state.controls.password.value === ""
    )
      errorMessage.push("EMAIL và PASSWORD không được rỗng");
    else {
      if (this.state.controls.email.value === "")
        errorMessage.push("EMAIL không được rỗng");
      if (this.state.controls.password.value === "")
        errorMessage.push("PASSWORD không được rỗng");
    }
    for (let key in this.state.controls) {
      if (this.state.controls[key].status.errorMessage !== "") {
        errorMessage = errorMessage.concat(
          this.state.controls[key].status.errorMessage
        );
      }
    }
    this.setState({ errorMessage: errorMessage });

    if (errorMessage.length === 0) {
      this.setState({ loading: true });
      const requestData = {
        email: this.state.controls.email.value,
        password: this.state.controls.password.value,
        returnSecureToken: true
      };
      callServer("su", requestData)
        .then(res => {
          this.setState({ loading: false });
          this.signIn(res);
        })
        .catch(err => {
          // console.log(err);
          errorMessage.push("Mã lỗi: " + err.code);
          errorMessage.push(err.message);
          this.setState({ loading: false, errorMessage: errorMessage });
        });
    }
  };

  /**
   * Signin process handler
   */
  signInHandler = event => {
    event.preventDefault();
    let errorMessage = [];
    if (
      this.state.controls.email.value === "" &&
      this.state.controls.password.value === ""
    )
      errorMessage.push("EMAIL và PASSWORD không được rỗng");
    else {
      if (this.state.controls.email.value === "")
        errorMessage.push("EMAIL không được rỗng");
      if (this.state.controls.password.value === "")
        errorMessage.push("PASSWORD không được rỗng");
    }
    for (let key in this.state.controls) {
      if (this.state.controls[key].status.errorMessage !== "") {
        errorMessage = errorMessage.concat(
          this.state.controls[key].status.errorMessage
        );
      }
    }
    this.setState({ errorMessage: errorMessage });

    if (errorMessage.length === 0) {
      this.setState({ loading: true });
      const requestData = {
        email: this.state.controls.email.value,
        password: this.state.controls.password.value,
        returnSecureToken: true
      };
      callServer("si", requestData)
        .then(res => {
          this.setState({ loading: false });
          this.signIn(res);
        })
        .catch(err => {
          // console.log(err);
          errorMessage.push("Mã lỗi: " + err.code);
          errorMessage.push(err.message);
          this.setState({ loading: false, errorMessage: errorMessage });
        });
    }
  };

  signIn = data => {
    const queryParams = [];
    for (let key in data) {
      queryParams.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      );
    }
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/home",
      search: "?" + queryString
    });
  };

  closeModalHanlder = () => {
    this.setState({ errorMessage: [] });
  };

  render() {
    let spinner = null;
    if (this.state.loading) {
      spinner = <Spinner />;
    }
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    const form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        label={
          formElement.config.elementConfig.placeholder
            ? formElement.config.elementConfig.placeholder
            : ""
        }
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        status={!formElement.config.status.isValid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={event => this.inputChangedHandler(event, formElement.id)}
      />
    ));

    return (
      <div>
        {spinner}
        <Modal
          show={this.state.errorMessage.length !== 0}
          modalClosed={this.closeModalHanlder}
        >
          <div className={classes.ModalIcon}>
            <FontAwesomeIcon icon={faInfoCircle} />
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
        <div style={{ backgroundColor: "#f7f7f7", height: "100vh" }}>
          <Layout
            styles={{ borderRadius: "4px", position: "relative", top: "10%" }}
          >
            <div className={classes.BoxLogin}>
              <p className={classes.LoginTitle}>Đăng ký bằng Email</p>
              {form}
              <br />
              <Button
                css={{ maxWidth: "300px" }}
                btnType="PrimaryGreen"
                clicked={event => this.signUpHandler(event)}
              >
                ĐĂNG KÝ
              </Button>
              <Button
                css={{ maxWidth: "300px" }}
                btnType="SecondaryGreen"
                clicked={event => this.signInHandler(event)}
              >
                ĐĂNG NHẬP
              </Button>
            </div>
          </Layout>
        </div>
      </div>
    );
  }
}

export default Login;
