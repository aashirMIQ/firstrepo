import React, { Component } from "react";
import { connect } from "react-redux";
import { uuid } from "../../oscar-pos-core/constants";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { USER } from "../../oscar-pos-core/actions/types";
import { onBoardSignup, createUser } from "../../oscar-pos-core/actions";
import "./SignUp.css";
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
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionData: {},
      sessionDetails: {},
      showPassword: false,
      name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isLoading: false,

      validation: {
        name: {
          error: false,
          errorText: ""
        },
        password: {
          error: false,
          errorText: ""
        },
        confirmPassword: {
          error: false,
          errorText: ""
        },
        phoneNumber: {
          error: false,
          errorText: ""
        },

      }
    };
  }
  resetField = () => {
    let { validation } = this.state;
    validation.phoneNumber.error = false;
    validation.phoneNumber.errorText = "";

    validation.password.error = false;
    validation.password.errorText = "";

    validation.name.error = false;
    validation.name.errorText = "";

    validation.confirmPassword.error = false;
    validation.confirmPassword.errorText = "";
    this.setState({ validation, });

  }

  viewDetails = data => {
    //start working from there to navigate new screen
    console.log("data: ", data);
  };
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  handleChange = prop => event => {
    if (prop === 'phoneNumber' && event.target.value.length > 11) {
      return
    }
    this.setState({ [prop]: event.target.value });
  };
  createUser = () => {
    this.setState({ isLoading: true });
    let { phoneNumber, password, confirmPassword, name, validation } = this.state;
    let isError = false;

    if (name.toString().length >= 3 && name.toString().length <= 15) {
      validation.name.error = false;
      validation.name.errorText = "";
    } else {
      validation.name.error = true;
      validation.name.errorText = "Length should be 3 to 15 characters long";
      isError = true;
    }
    if (phoneNumber.toString().length && phoneNumber.toString().match(patt)) {
      validation.phoneNumber.error = false;
      validation.phoneNumber.errorText = "";
    } else {
      validation.phoneNumber.error = true;
      validation.phoneNumber.errorText = "Phone number should be in this format 03001234567";
      isError = true;
    }
    if (password.length && password.length > 5) {
      validation.password.error = false;
      validation.password.errorText = "";
    } else {
      validation.password.error = true;
      validation.password.errorText = "Password should be atleast 6 characters long";
      isError = true;
    }
    if (confirmPassword.length && confirmPassword.length > 5) {
      validation.confirmPassword.error = false;
      validation.confirmPassword.errorText = "";
    } else {
      validation.confirmPassword.error = true;
      validation.confirmPassword.errorText = "Confirm Password should be atleast 6 characters long";
      isError = true;
    }
    if (password.length > 5 && confirmPassword.length > 5 && confirmPassword !== password) {
      validation.confirmPassword.error = true;
      validation.confirmPassword.errorText = "Passwords should be same";
      isError = true;
    }
    if (isError) {
      this.setState({ validation, isLoading: false });
      return;
    }
    let params = {
      id: uuid().toString(),
      name: this.state.name,
      phone_number: this.state.phoneNumber,
      password: this.state.password
    };
    let route = "windowsdukaanonboard.oscar.pk";
    // if (
    //   this.state.phoneNumber.toString().length == 11 &&
    //   this.state.password.length &&
    //   this.state.confirmPassword.length &&
    //   this.state.name.length &&
    //   this.state.password == this.state.confirmPassword
    // ) {
    onBoardSignup(params, route)
      .then(res => {
        createUser(null, params)
          .then(res => {
            let obj = {
              session_id: res.id,
              username: res.name
            };
            localStorage.setItem("userObj", JSON.stringify(obj));
            localStorage.setItem("user", JSON.stringify(res));
            this.props.dispatch({
              type: USER.GET_USER,
              data: res
            });
            this.setState({ isLoading: false });
            this.props.history.replace("/pinCodeScreen");
          })
          .catch(error => {
            this.setState({
              isLoading: false,
              name: "",
              phoneNumber: "",
              password: "",
              confirmPassword: ""
            });
          });
      })
      .catch(error => {
        console.log("error onBoardSignup: ", error);
        alert("User already exist please try with another number");
        this.setState({
          isLoading: false,
          // name: "",
          // phoneNumber: "",
          // password: "",
          // confirmPassword: ""
        });
      });
    // } else {
    //   this.setState({
    //     isLoading: false,
    //   });
    //   alert("data is badly formated");
    // }
  };

  whenEnterPress = (e) => {
    if (e.key === 'Enter') {
      this.createUser();
    }
  }
  render() {
    console.log("this.state : ", this.state)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: "linear-gradient(#776cd3 ,#d35ffb)",
          display: "grid",
          gridTemplateRows: "2fr 8fr"
        }}
      >
        <div
          style={{
            display: "flex",
            paddingLeft: "5em"
          }}
        >
          <img
            className="back-arrow"
            width="50px"
            onClick={() => this.props.history.goBack()}
            src={require("../../assets/images/icons/back-icon.svg")}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ color: "#fff", fontWeight: "600" }}>SignUp</div>
            <div
              style={{
                width: "30vw",
                // marginBottom: "2em",
                color: "#fff"
              }}
            >
              <TextField
                error={this.state.validation.name.error}
                onFocus={() => this.resetField()}
                helperText={this.state.validation.name.errorText}
                style={{ width: "100%", color: "#fff" }}
                id="standard-name"
                label="Name"
                type="text"
                className={"textfield"}
                value={this.state.name}
                onChange={this.handleChange("name")}
                margin="normal"
                InputProps={{
                  style: {
                    color: "#fff",
                  }
                }}
              />
            </div>
            <div
              style={{
                width: "30vw",
                color: "#fff"
                // marginBottom: "2em"
              }}
            >
              <TextField
                error={this.state.validation.phoneNumber.error}
                helperText={this.state.validation.phoneNumber.errorText}
                onFocus={() => this.resetField()}
                style={{ width: "100%", color: "#fff" }}
                type="number"
                id="standard-name"
                label="Phone Number"
                className={"textfield"}
                value={this.state.phoneNumber}
                onChange={this.handleChange("phoneNumber")}
                margin="normal"
                InputProps={{
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
              <FormControl style={{ width: "100%", color: "#fff" }}>
                <InputLabel htmlFor="adornment-password" style={{
                  opacity: '0.7',
                  color: this.state.validation.password.error ? '#f44336' : 'rgba(0, 0, 0, 0.87)'
                }}>Password</InputLabel>                <Input
                  error={this.state.validation.password.error}
                  style={{ width: "100%", color: "#fff" }}
                  id="adornment-password"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.password}
                  onChange={this.handleChange("password")}
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
                {this.state.validation.password.error ?
                  <div style={{
                    color: '#f44336',
                    margin: 0,
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    marginTop: '8px',
                    minHeight: '1em',
                    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
                    lineHeight: '1em',
                  }}>
                    {this.state.validation.password.errorText}
                  </div>
                  :
                  null}
              </FormControl>
            </div>
            <div
              style={{
                width: "30vw",
                marginBottom: "2em"
              }}
            >
              <FormControl style={{ width: "100%", color: "#fff" }}>
                <InputLabel htmlFor="adornment-password" style={{
                  opacity: '0.7',
                  color: this.state.validation.confirmPassword.error ? '#f44336' : 'rgba(0, 0, 0, 0.87)'
                }}>Confirm Password</InputLabel>
                <Input
                  error={this.state.validation.confirmPassword.error}
                  onKeyPress={this.whenEnterPress}
                  style={{ width: "100%", color: "#fff" }}
                  id="adornment-password"
                  onFocus={() => this.resetField()}
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.confirmPassword}
                  onChange={this.handleChange("confirmPassword")}
                  endAdornment={<InputAdornment position="end" />}
                />
                {this.state.validation.confirmPassword.error ?
                  <div style={{
                    color: '#f44336',
                    margin: 0,
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    marginTop: '8px',
                    minHeight: '1em',
                    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
                    lineHeight: '1em',
                  }}>
                    {this.state.validation.confirmPassword.errorText}
                  </div>
                  :
                  null}
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
                onClick={this.createUser}
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
                    "Get Started"
                  )}
              </button>
            </div>
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
    sessions: state.sessions
  };
})(SignUp);
