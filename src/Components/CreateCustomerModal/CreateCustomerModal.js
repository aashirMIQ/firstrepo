import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import { createCustomer, updateCustomer } from "../../oscar-pos-core/actions";
import { uuid } from "../../oscar-pos-core/constants";
import validator from "validator";
import { CustomerSchema } from "../../db/Schema";
import "./CreateCustomerModal.css";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { getItem, getTotal } from "../../constants";
let patt = /03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}/; // VALIDATION FOR PAKISTANI MOBILE NUMBER
const styles = {
  row: {
    display: "flex",
    width: "100%"
    // flexDirection: 'colomn'
  },
  inputWrapper: {
    padding: "0 11px"
  },
  btn: {
    width: "100%"
  },
  headerItem: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #e6e7e8",
    userSelect: "none",
    cursor: "pointer",
    color: "#300f38",
    fontSize: "20px"
  },
  modalHeader: {
    // border: "1px solid #e6e7e8",
    padding: "0px",
    display: "grid",
    gridTemplateColumns: "0.2fr 0.6fr 0.2fr",
    height: "10vh"
  }
};
class CreateCustomerModal extends Component {
  constructor(props) {
    super(props);
    let customer = this.props.customer;
    this.state = {
      name: customer ? customer.name : "",
      // lastName: customer ? customer.lastName : "",
      email: customer ? customer.email : "",
      phone: customer ? customer.phone : "",
      address: customer ? customer.address : "",
      total_outstanding_payment: customer
        ? customer.total_outstanding_payment
        : 0.0,
      // birthDate: customer ? customer.birthDate : "2018-05-24",
      subscribe: customer ? customer.subscribe : false,
      id: customer ? customer.id : null,
      validation: {
        name: {
          error: false,
          errorText: ""
        },
        lastName: {
          error: false,
          errorText: ""
        },
        email: {
          error: false,
          errorText: ""
        },
        phone: {
          error: false,
          errorText: ""
        },
        address: {
          error: false,
          errorText: ""
        },
        total_outstanding_payment: {
          error: false,
          errorText: ""
        }
      }
    };
  }
  componentWillMount() {
    let customer = this.props.customer;
    let obj = {
      name: customer ? customer.name : "",
      // lastName: customer ? customer.lastName : "",
      email: customer ? customer.email : "",
      phone: customer ? customer.phone : "",
      address: customer ? customer.address : "",
      total_outstanding_payment: customer
        ? customer.total_outstanding_payment
        : 0.0,
      // birthDate: customer ? customer.birthDate : "2018-05-24",
      subscribe: customer ? customer.subscribe : false,
      id: customer ? customer.id : null
    };
    this.setState({ ...obj });
    console.log("will mount from create customer modal");
  }
  componentDidMount() {
    console.log("ded mount from create customer modal");
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.customer && nextProps.show && nextProps.editMode) {
      console.log("from willreciveprops: &&&&&&&&&&&&&", nextProps.customer);
      let customer = nextProps.customer;
      let name = customer.name.split(" ");
      let obj = {
        name: customer ? name[0] : "",
        // lastName: customer ? name[1] : "",
        email: customer ? customer.email : "",
        phone: customer ? customer.phone : "",
        address: customer ? customer.address : "",
        // birthDate: customer ? customer.birthDate : "2018-05-24",
        subscribe: customer ? customer.subscribe : false,
        total_outstanding_payment: customer
          ? customer.total_outstanding_payment
          : 0.0,
        id: customer ? customer.id : null
      };
      this.setState({ ...obj }, () => {
        console.log(
          "******************state updated************: ",
          this.state
        );
      });
    }
  }
  handleChange = name => event => {
    if (name == "name" && this.state.name.length <= 19) {
      this.setState({ [name]: event.target.value });
      return;
    }
    // if (name == "lastName" && this.state.name.length <= 19) {
    //   this.setState({ [name]: event.target.value });
    //   return;
    // }
    this.setState({ [name]: event.target.value });
  };
  handleSwitch = name => event => {
    console.log("checked: ", event.target.checked);
    this.setState({ [name]: event.target.checked });
  };
  createCustomer = e => {
    var t0 = Date.now();
    e.preventDefault();
    let { editMode } = this.props;
    let {
        name,
        lastName,
        email,
        phone,
        address,
        birthDate,
        subscribe,
        id,
        total_outstanding_payment,
        validation
      } = this.state,
      isError = false;

    /* validation */
    if (name.toString().length >= 3 && name.toString().length <= 15) {
      validation.name.error = false;
      validation.name.errorText = "";
    } else {
      validation.name.error = true;
      validation.name.errorText = "Length should be 3 to 15 characters long";
      isError = true;
    }
    // if (lastName.toString().length >= 3 && lastName.toString().length <= 15) {
    //   validation.lastName.error = false;
    //   validation.lastName.errorText = "";
    // } else {
    //   validation.lastName.error = true;
    //   validation.lastName.errorText =
    //     "Length should be 3 to 15 characters long";
    //   isError = true;
    // }

    // if (email.toString().length) {
    if (email.toString().length && validator.isEmail(email)) {
      validation.email.error = false;
      validation.email.errorText = "";
    } else {
      validation.email.error = true;
      validation.email.errorText =
        "Email should be in this format ashir@gmail.com";
      isError = true;
    }
    // }
    if (phone.toString().length && phone.toString().match(patt)) {
      validation.phone.error = false;
      validation.phone.errorText = "";
    } else {
      validation.phone.error = true;
      validation.phone.errorText =
        "Phone Number should be in this format 03001234567";
      isError = true;
    }
    // if (address.toString().length && address.toString().length > 10) {
    //   validation.address.error = false;
    //   validation.address.errorText = "";
    // } else {
    //   validation.address.error = true;
    //   validation.address.errorText = "Length should be atleast 10 characters long";
    //   isError = true;
    // }
    /* validation */
    /* for alerting */
    console.log("isError inside for alerting::: ", isError);
    if (isError) {
      this.setState({ validation });
      return;
    }
    /* for alerting */

    if (!editMode) {
      if (
        name.trim().length !== 0 &&
        // lastName.trim().length !== 0 &&
        email.trim().length !== 0 &&
        phone.trim().length !== 0 &&
        address.trim().length !== 0 &&
        // birthDate.trim().length !== 0 &&
        total_outstanding_payment >= 0
      ) {
        let newId = uuid();
        let obj = {
          _id: newId,
          id: newId,
          user_id: this.props.user.id,
          name: name.trim() ,
          phone: phone.toString(),
          email: email.toString(),
          address: address,
          total_outstanding_payment: 0.0,
          loyalty_points: 0
          // birthDate
        };
        this.props
          .dispatch(createCustomer(null, obj))
          .then(data => {
            var t1 = Date.now();
            console.log(
              "Time consume (Create customer)= ",
              (t1 - t0) / 1000,
              " sec"
            );
            console.log("data:: ", data);
            toast.success("Customer has been created successfully", {
              position: toast.POSITION.BOTTOM_LEFT
            });
            this.setState(
              {
                name: "",
                lastName: "",
                email: "",
                phone: "",
                address: ""
              },
              () => {
                this.props.resetShow();
              }
            );
          })
          .catch(error => {
            console.log("error from createCustomer catch: ", error);
          });
      }
    } else {
      console.log("in edit: ", id);
      if (
        name.trim().length !== 0 &&
        // lastName.trim().length !== 0 &&
        email.trim().length !== 0 &&
        phone.trim().length !== 0 &&
        address.trim().length !== 0 &&
        // birthDate.trim().length !== 0 &&
        total_outstanding_payment >= 0 &&
        id &&
        id.trim().length !== 0
      ) {
        let obj = {
          _id: id,
          id,
          user_id: this.props.user.id,
          name: name.trim() ,
          phone: phone.toString(),
          email: email.toString(),
          address: address,
          total_outstanding_payment,
          loyalty_points: 0
          // birthDate
        };
        this.props
          .dispatch(
            updateCustomer(null, { customer_data: obj, customer_id: obj.id })
          )
          .then(data => {
            console.log("data:: ", data);
            var t1 = Date.now();
            console.log(
              "Time consume (Update customer)= ",
              (t1 - t0) / 1000,
              " sec"
            );
            if (
              this.props.fromCustomerInfoScreen ||
              this.props.commingFromHome
            ) {
              this.props.dispatch({
                type: CUSTOMER.SET_CUSTOMER_FOR_ORDER,
                payload: obj
              });
            }
            toast.success("Information Updated", {
              position: toast.POSITION.BOTTOM_LEFT
            });
            this.setState(
              {
                name: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                subscribe: ""
              },
              () => {
                this.props.onHide();
              }
            );
          })
          .catch(error => {
            console.log("error from createCustomer catch: ", error);
          });
      }
    }
  };

  onHide = () => {
    let { validation } = this.state;
    validation.name.error = false;
    validation.name.errorText = "";

    validation.name.error = false;
    validation.name.errorText = "";

    validation.email.error = false;
    validation.email.errorText = "";

    validation.phone.error = false;
    validation.phone.errorText = "";

    validation.address.error = false;
    validation.address.errorText = "";

    validation.lastName.error = false;
    validation.lastName.errorText = "";
    this.setState(
      {
        name: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        validation
      },
      () => {
        this.props.onHide();
      }
    );
  };
  render() {
    console.log("this.state : ", this.state);
    return (
      <Modal show={this.props.show} onHide={this.onHide}>
        <div
          style={{
            height: "85vh"
          }}
        >
          <Modal.Header style={styles.modalHeader}>
            <div style={{ ...styles.headerItem, border: "0px" }} />
            <div style={{ ...styles.headerItem, border: "0px" }}>
              {this.props.editMode ? "Update Customer" : "Create New Customer"}
            </div>

            <div
              style={{ ...styles.headerItem, borderBottom: "0px" }}
              className="close-btn"
            >
              <img
                onClick={this.onHide}
                width="28px"
                src={require("../../assets/images/newicons/Close.svg")}
              />
            </div>
            {/* <Modal.Title>Customer Details</Modal.Title> */}
          </Modal.Header>
          <Modal.Body style={{ height: "90%" }}>
            <form
              onSubmit={this.createCustomer}
              style={{
                height: "70vh",
                height: "95%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 2em"
              }}
            >
              <div style={styles.row}>
                <div style={{ ...styles.inputWrapper }}>
                  <TextField
                    error={this.state.validation.name.error}
                    required={true}
                    helperText={this.state.validation.name.errorText}
                    id="standard-name"
                    label="Name"
                    value={this.state.name}
                    onChange={this.handleChange("name")}
                    margin="normal"
                    type="text"
                    inputProps={{ maxLength: "16" }}
                  />
                </div>
                {/* <div style={{ ...styles.inputWrapper }}>
                  <TextField
                    error={this.state.validation.lastName.error}
                    required={true}
                    helperText={this.state.validation.lastName.errorText}
                    id="standard-name"
                    label="Last Name"
                    value={this.state.lastName}
                    onChange={this.handleChange("lastName")}
                    margin="normal"
                    type="text"
                    inputProps={{ maxLength: "16" }}
                  />
                </div> */}
              </div>
              <div style={styles.row}>
                <div style={{ ...styles.inputWrapper }}>
                  <TextField
                    error={this.state.validation.phone.error}
                    required={true}
                    helperText={this.state.validation.phone.errorText}
                    id="standard-name"
                    label="Phone"
                    value={this.state.phone}
                    onChange={this.handleChange("phone")}
                    margin="normal"
                    type="number"
                  />
                </div>
                <div style={{ ...styles.inputWrapper }}>
                  <TextField
                    error={this.state.validation.email.error}
                    required={true}
                    helperText={this.state.validation.email.errorText}
                    id="standard-name"
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange("email")}
                    margin="normal"
                    type="email"
                  />
                </div>
              </div>
              <div style={{ ...styles.row, width: "100%" }}>
                <div style={{ ...styles.inputWrapper, width: "100%" }}>
                  <TextField
                    style={{ width: "100%" }}
                    error={this.state.validation.address.error}
                    required={true}
                    helperText={this.state.validation.address.errorText}
                    id="standard-name"
                    label="Address"
                    value={this.state.address}
                    onChange={this.handleChange("address")}
                    margin="normal"
                    type="text"
                    inputProps={{ maxLength: "40" }}
                  />
                </div>
              </div>
              {/* <div style={{ ...styles.row, width: "100%", padding: "0 11px" }}>
                <div style={{ ...styles.inputWrapper, width: "100%" }}>
                  <TextField
                    style={{ width: "100%" }}
                    id="standard-name"
                    label="BirthDate"
                    value={this.state.birthDate}
                    onChange={this.handleChange("birthDate")}
                    margin="normal"
                    type="date"
                  />
                </div>
              </div> */}
              {/* <div
                style={{
                  ...styles.row,
                  width: "100%",
                  padding: "0 22px",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>Subscribe for Loyalty</div>
                <div style={{ ...styles.inputWrapper }}>
                  <Switch
                    checked={this.state.subscribe}
                    onChange={this.handleSwitch("subscribe")}
                    value="subscribe"
                    color="primary"
                  />
                </div>
              </div> */}
              <div
                style={{
                  ...styles.row,
                  width: "100%",
                  justifyContent: "center"
                }}
              >
                <button
                  className="addCutomerBtn"
                  style={{
                    width: "21em",
                    margin: "1em 0",
                    border: "none",
                    height: "4em",
                    fontSize: "15px",
                    ...styles.center,
                    // background: "#8dc63f",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                  // style={{
                  //   ...styles.btn,
                  //   width: "80%",
                  //   background: "#8dc63f",
                  //   border: "none",
                  //   padding: "1em",
                  //   // borderRadius: "5px",
                  //   color: "#fff"
                  // }}
                  // onSubmit={this.createCustomer}
                  type="submit"
                >
                  {this.props.editMode
                    ? "Save Update Information"
                    : "Create Customer"}
                </button>
              </div>
            </form>
          </Modal.Body>
        </div>
      </Modal>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    user: state.userReducer
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps)(CreateCustomerModal);
