import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import { connect } from "react-redux";
import { formatNum, uuid, getTotal } from "../../oscar-pos-core/constants";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { USER } from "../../oscar-pos-core/actions/types";
import {
  emptyCart,
  setPaymentMethod,
  getSessionSummary,
  close_pos_session,
  submitMoneyIn,
  submitMoneyOut,
  set_closing_balance,
  getAllSessions,
  onBoardSignup,
  createUser,
  onLogin
} from "../../oscar-pos-core/actions";
import "./Login.css";
let patt = /03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}/; // VALIDATION FOR PAKISTANI MOBILE NUMBER

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

const materialStyles = theme => ({
  multilineColor: {
    color: "red"
  }
});
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionData: {},
      sessionDetails: {},
      showPassword: false,
      phoneNumber: "",
      password: "",
      isLoading: false,
      validation: {
        password: {
          error: false,
          errorText: ""
        },
        phoneNumber: {
          error: false,
          errorText: ""
        }
      }
    };
  }

  //   componentWillMount()
  viewDetails = data => {
    //start working from there to navigate new screen
    console.log("data: ", data);
  };
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  handleChange = prop => event => {
    if (prop === "phoneNumber" && event.target.value.length > 11) {
      return;
    }
    this.setState({ [prop]: event.target.value });
  };
  resetField = () => {
    let { validation } = this.state;
    validation.phoneNumber.error = false;
    validation.phoneNumber.errorText = "";

    validation.password.error = false;
    validation.password.errorText = "";
    this.setState({ validation });
  };
  login = () => {
    this.setState({ isLoading: true });
    let { phoneNumber, password, validation } = this.state;
    let params = {
      phone_number: phoneNumber,
      password: password
    };
    let isError = false;
    if (phoneNumber.toString().length && phoneNumber.toString().match(patt)) {
      validation.phoneNumber.error = false;
      validation.phoneNumber.errorText = "";
    } else {
      validation.phoneNumber.error = true;
      validation.phoneNumber.errorText =
        "Phone number should be in this format 03001234567";
      isError = true;
    }

    if (password.length && password.length > 5) {
      validation.password.error = false;
      validation.password.errorText = "";
    } else {
      validation.password.error = true;
      validation.password.errorText =
        "Password should be atleast 6 characters long";
      isError = true;
    }
    if (isError) {
      this.setState({ validation, isLoading: false });
      return;
    }
    // if (phoneNumber.toString().length == 11 && password.toString().length > 0) {
    onLogin(null, params)
      .then(res => {
        console.log("user is login: ", params);
        // if (res.docs.length) {
        this.setState({ isLoading: false });
        localStorage.setItem("user", JSON.stringify(res.docs[0]));
        this.props.dispatch({
          type: USER.GET_USER,
          data: res.docs[0]
        });
        this.props.history.replace("/pinCodeScreen");
        // }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        alert("Invalid Credentials");
        console.error("error user is login:::: ", error);
      });
    // } else {
    //   this.setState({ isLoading: false });
    // }
  };

  whenEnterPress = e => {
    if (e.key === "Enter") {
      this.login();
    }
  };
  render() {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: "linear-gradient(#776cd3 ,#d35ffb)"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            textAlign: "center"
          }}
        >
          <div style={{ marginBottom: "2em" }}>
            <img src={require("../../assets/images/Oscar_logo-02.svg")} />
          </div>
          <div
            style={{
              width: "30vw",
              marginBottom: "2em",
              color: "#fff"
            }}
          >
            <TextField
              error={this.state.validation.phoneNumber.error}
              helperText={this.state.validation.phoneNumber.errorText}
              style={{ width: "100%", color: "#fff" }}
              type="number"
              id="standard-name"
              label="Phone Number"
              className={"textfield"}
              value={this.state.phoneNumber}
              onChange={this.handleChange("phoneNumber")}
              margin="normal"
              onFocus={() => this.resetField()}
              // onInput={(e) => {
              //   e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 11)
              // }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderBottomColor: "#fff"
                }
              }}
              InputLabelProps={{
                style: {
                  color: "#fff",
                }
              }}
            />
          </div>

          <div
            style={{
              width: "30vw",
              marginBottom: "2em"
            }}
          >
            <FormControl
              style={{
                width: "100%"
              }}
            >
              <InputLabel
                htmlFor="adornment-password"
                style={{
                  opacity: "0.7",
                  color: this.state.validation.password.error
                    ? "#f44336"
                    : "#fff"
                }}
              >
                Password
              </InputLabel>
              <Input
                error={this.state.validation.password.error}
                id="adornment-password"
                style={{ color: "#fff" }}
                inputProps
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                onChange={this.handleChange("password")}
                onKeyPress={this.whenEnterPress}
                onFocus={() => this.resetField()}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {this.state.validation.password.error ? (
                <div
                  style={{
                    color: "#f44336",
                    margin: 0,
                    fontSize: "0.75rem",
                    textAlign: "left",
                    marginTop: "8px",
                    minHeight: "1em",
                    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
                    lineHeight: "1em"
                  }}
                >
                  {this.state.validation.password.errorText}
                </div>
              ) : null}
            </FormControl>
          </div>
          <div
            style={{
              width: "30vw",
              marginBottom: "2em"
            }}
          >
            <button
              style={{
                width: "100%",
                width: "100%",
                background: "#6a4e93",
                border: "none",
                borderRadius: "10em",
                color: "#fff",
                outline: "none",
                height: "60px"
              }}
              onClick={this.login}
            >
              {this.state.isLoading ? (
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <div className="loader" />
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
          <div
            style={{
              width: "30vw",
              marginBottom: "2em",
              color: "#fff",
              textAlign: "center"
            }}
          >
            Don't have an account{" "}
            <span
              onClick={() => this.props.history.push("/signup")}
              style={{ cursor: "pointer", color: "#fff", fontWeight: "600" }}
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {};
};

let mapDispatchToProps = dispatch => {
  return {};
};
export default connect(state => {
  console.log("reducer state from home.js: ", state);
  return {
    products: state.products,
    cart: state.cart,
    sessions: state.sessions,
    user: state.user
  };
})(Login);
