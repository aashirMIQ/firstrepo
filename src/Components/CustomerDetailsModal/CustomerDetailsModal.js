import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import {
  createCustomer,
  updateCustomer,
  getCreditHistory,
  createPayment
} from "../../oscar-pos-core/actions";
import { uuid } from "../../oscar-pos-core/constants";
import validator from "validator";
import { CustomerSchema } from "../../db/Schema";
import "./CustomerDetailsModal.css";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import TakeCashModal from "../TakeCashModal/TakeCashModal";
import CreditHistoryModal from "../CreditHistoryModal/CreditHistoryModal";
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
      lastName: customer ? customer.lastName : "",
      email: customer ? customer.email : "",
      phone: customer ? customer.phone : "",
      address: customer ? customer.address : "",
      total_outstanding_payment: customer
        ? customer.total_outstanding_payment
        : 0.0,
      // birthDate: customer ? customer.birthDate : "2018-05-24",
      subscribe: customer ? customer.subscribe : false,
      id: customer ? customer.id : null,
      customerObj: {},
      showTakeCashModal: false,
      totalOutstandingPayment: 0,
      showCreditHistoryModal: false
    };
  }
  componentWillMount() {
    let customer = this.props.customer;
    let obj = {
      name: customer ? customer.name : "",
      lastName: customer ? customer.lastName : "",
      email: customer ? customer.email : "",
      phone: customer ? customer.phone : "",
      address: customer ? customer.address : "",
      total_outstanding_payment: customer
        ? customer.total_outstanding_payment
        : 0.0,
      // birthDate: customer ? customer.birthDate : "2018-05-24",
      subscribe: customer ? customer.subscribe : false,
      id: customer ? customer.id : null,
      customerObj: customer
    };
    this.setState({ ...obj });
    console.log("will mount from create customer modal");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customer && nextProps.show) {
      console.log("from willreciveprops: &&&&&&&&&&&&&", nextProps.customer);
      let customer = nextProps.customer;
      let name = customer.name.split(" ");
      let obj = {
        name: customer ? name[0] : "",
        lastName: customer ? name[1] : "",
        email: customer ? customer.email : "",
        phone: customer ? customer.phone : "",
        address: customer ? customer.address : "",
        // birthDate: customer ? customer.birthDate : "2018-05-24",
        subscribe: customer ? customer.subscribe : false,
        total_outstanding_payment: customer
          ? customer.total_outstanding_payment
          : 0.0,
        id: customer ? customer.id || customer._id : null,
        customerObj: customer
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
    this.setState({ [name]: event.target.value });
  };
  handleSwitch = name => event => {
    console.log("checked: ", event.target.checked);
    this.setState({ [name]: event.target.checked });
  };
  removeCustomerFromOrder = () => {
    this.props.dispatch({
      type: CUSTOMER.RESET_CUSTOMER_FOR_ORDER
    });
    setTimeout(() => {
      this.props.onHide();
    });
  };
  handleTakeCashModal = () => {
    this.setState({ showTakeCashModal: !this.state.showTakeCashModal });
  };

  getTotalOutstandingPayment = () => {
    let { creditHistory } = this.props,
      totalUdhaar = 0,
      totalJama = 0;
    for (let i = 0; i < creditHistory.length; i++) {
      if (creditHistory[i].payment_mode == "Udhaar") {
        totalUdhaar += creditHistory[i].amount;
      }
      if (creditHistory[i].payment_mode == "Jama") {
        totalJama += creditHistory[i].amount;
      }
    }
    this.setState(
      {
        total_outstanding_payment: Math.abs(totalUdhaar - totalJama)
      },
      () => {
        console.log(
          "*********************total_outstanding_payment:: ",
          this.state.total_outstanding_payment
        );
      }
    );
  };

  takeCash = amount => {
    let customer = this.props.commingFromHome
      ? this.props.setCustomerForOrder
      : this.props.setCustomerForDetails;
    console.log("amount: ", amount);
    let partner_id = customer ? customer.id : "";
    let params = {
      id: partner_id,
      amount: parseInt(amount),
      session_id: this.props.user.id,
      payment_mode: "Jama"
    };
    this.props.dispatch(createPayment(null, params)).then(data => {
      console.log("create payment response in udhaar screen: ", data);

      /* i have to tackle this for home screen */
      if (this.props.commingFromHome) {
        this.props.dispatch({
          type: CUSTOMER.SET_CUSTOMER_FOR_ORDER,
          payload: data
        });
      }
      this.props
        .dispatch(getCreditHistory(null, customer.id))
        .then(res => {
          // this.getTotalOutstandingPayment();
          this.setState({
            total_outstanding_payment: data.total_outstanding_payment
          });
          this.handleTakeCashModal();
        })
        .catch(error => {
          console.log(
            "error getCreditHistory from customer info screen: ",
            error
          );
        });
    });
  };

  handleshowCreditHistoryModal = () => {
    this.setState({
      showCreditHistoryModal: !this.state.showCreditHistoryModal
    });
  };

  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <div
            style={{
              height: "85vh"
            }}
          >

            <Modal.Header style={styles.modalHeader}>
              <div style={{ ...styles.headerItem, borderBottom: "0px" }}>
                  {this.state.total_outstanding_payment ? (
                    <img
                      onClick={this.handleshowCreditHistoryModal}
                      width="28px"
                      src={require("../../assets/images/newicons/OrderHistory.svg")}
                    />
                  ) : (
                    <div
                      style={{ fontSize: "16px", }}
                      onClick={() => {
                        this.props.onHide();
                        this.props.openUpdateCustomerModal(
                          this.state.customerObj
                        );
                      }}
                    >
                      Edit
                    </div>
                  )}
              </div>
              <div style={{ ...styles.headerItem, border: "0px" }}>Customer Details</div>
              <div style={{ ...styles.headerItem, borderBottom: "0px" }}>
                <img
                 width="28px"
                  onClick={this.props.onHide}
                  src={require("../../assets/images/icons/close.svg")}
                />
              </div>
              
              {/* <Modal.Title>Customer Details</Modal.Title> */}
            </Modal.Header>
            <Modal.Body style={{ padding: "1rem 2rem" }}>
              <form
                onSubmit={this.createCustomer}
                style={{
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={styles.row}>
                  {this.state.total_outstanding_payment ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        width: "100%",
                        height: "7vh"
                      }}
                    >
                      <div
                        style={{
                          border: "1px solid #e6e7e8",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "2em"
                        }}
                      >
                        Udhaar &nbsp;
                        <span style={{ color: "#e51a32", userSelect: "none" }}>
                          Rs. {this.state.total_outstanding_payment}
                        </span>
                      </div>
                      <div
                        onClick={this.handleTakeCashModal}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#efaa2e",
                          color: "#fff",
                          cursor: "pointer"
                        }}
                      >
                        PayNow
                      </div>
                    </div>
                  ) : null}
                </div>
                <div style={styles.row}>
                  <div style={{ ...styles.inputWrapper, width: "100%" }}>
                    <TextField
                      className="customerUpdateInput"
                      style={{ width: "100%", color: "#000", }}
                      id="standard-name"
                      disabled={true}
                      label="Name"
                      value={
                        this.props.setCustomerForOrder &&
                        this.props.commingFromHome
                          ? this.props.setCustomerForOrder.name
                          : `${this.state.name} ${this.state.lastName}`
                      }
                      onChange={this.handleChange("name")}
                      margin="normal"
                    />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ ...styles.inputWrapper, width: "100%" }}>
                    <TextField
                      className="customerUpdateInput"
                      style={{ width: "100%" }}
                      id="standard-name"
                      disabled={true}
                      label="Phone"
                      value={
                        this.props.setCustomerForOrder &&
                        this.props.commingFromHome
                          ? this.props.setCustomerForOrder.phone
                          : this.state.phone
                      }
                      onChange={this.handleChange("phone")}
                      margin="normal"
                      type="number"
                    />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ ...styles.inputWrapper, width: "100%" }}>
                    <TextField
                      className="customerUpdateInput"
                      style={{ width: "100%" }}
                      id="standard-name"
                      disabled={true}
                      label="Email"
                      value={
                        this.props.setCustomerForOrder &&
                        this.props.commingFromHome
                          ? this.props.setCustomerForOrder.email
                          : this.state.email
                      }
                      onChange={this.handleChange("email")}
                      margin="normal"
                      type="email"
                    />
                  </div>
                </div>
                <div style={{ ...styles.row, width: "100%" }}>
                  <div style={{ ...styles.inputWrapper, width: "100%" }}>
                    <TextField
                      className="customerUpdateInput"
                      style={{ width: "100%" }}
                      disabled={true}
                      id="standard-name"
                      label="Address"
                      value={
                        this.props.setCustomerForOrder &&
                        this.props.commingFromHome
                          ? this.props.setCustomerForOrder.address
                          : this.state.address
                      }
                      onChange={this.handleChange("address")}
                      margin="normal"
                      type="text"
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
                {this.state.total_outstanding_payment ? (
                  <div
                    style={{
                      // width: "100%",
                      display: "flex",
                      fontSize: "11px",
                      justifyContent: "space-between",
                      height: "10vh",
                      width: "100%",
                      padding: "0em 1em"
                    }}
                  >
                    <div
                      style={{
                        display: "flex"
                      }}
                    >
                      <button
                        className="removecustomerBtn"
                        style={{
                          ...styles.btn,
                          width: "12em",
                         border: "none",
                          // padding: "1em",
                          color: "#fff",
                          opacity:
                            this.props.setCustomerForOrder &&
                            this.props.setCustomerForOrder._id == this.state.id
                              ? 1
                              : 0.5,
                          cursor:
                            this.props.setCustomerForOrder &&
                            this.props.setCustomerForOrder._id == this.state.id
                              ? "pointer"
                              : "no-drop"
                        }}
                        // onSubmit={this.createCustomer}
                        //   type="submit"
                        disabled={
                          this.props.setCustomerForOrder &&
                          this.props.setCustomerForOrder._id == this.state.id
                            ? false
                            : true
                        }
                        onClick={this.removeCustomerFromOrder}
                      >
                        Remove Customer From Sale
                      </button>
                    </div>
                    <div>
                      <button
                        style={{
                          ...styles.btn,
                          width: "12em",
                          background: "#00aeef",
                          border: "none",
                          // padding: "1em",
                          color: "#fff",
                          height: "100%"
                          // opacity:
                          //   this.props.setCustomerForOrder &&
                          //   this.props.setCustomerForOrder._id == this.state.id
                          //     ? 1
                          //     : 0.5,
                          // cursor:
                          //   this.props.setCustomerForOrder &&
                          //   this.props.setCustomerForOrder._id == this.state.id
                          //     ? "pointer"
                          //     : "no-drop"
                        }}
                        // onSubmit={this.createCustomer}
                        //   type="submit"
                        // disabled={
                        //   this.props.setCustomerForOrder &&
                        //   this.props.setCustomerForOrder._id == this.state.id
                        //     ? false
                        //     : true
                        // }
                        onClick={e => {
                          e.preventDefault();
                          this.props.onHide();
                          this.props.openUpdateCustomerModal(
                            this.state.customerObj
                          );
                        }}
                      >
                        Edit Information
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      ...styles.row,
                      width: "100%",
                      padding: "0 22px",
                      justifyContent: "center"
                    }}
                  >
                    <button
                      className="removecustomerBtn"
                      style={{
                        ...styles.btn,
                        width: "80%",
                        border: "none",
                        padding: "1em",
                        color: "#fff",
                        opacity:
                          this.props.setCustomerForOrder &&
                          this.props.setCustomerForOrder._id == this.state.id
                            ? 1
                            : 0.5,
                        cursor:
                          this.props.setCustomerForOrder &&
                          this.props.setCustomerForOrder._id == this.state.id
                            ? "pointer"
                            : "no-drop"
                      }}
                      // onSubmit={this.createCustomer}
                      //   type="submit"
                      disabled={
                        this.props.setCustomerForOrder &&
                        this.props.setCustomerForOrder._id == this.state.id
                          ? false
                          : true
                      }
                      onClick={this.removeCustomerFromOrder}
                    >
                      Remove Customer From Sale
                    </button>
                  </div>
                )}
              </form>
            </Modal.Body>
          </div>
        </Modal>
        <TakeCashModal
          show={this.state.showTakeCashModal}
          onHide={this.handleTakeCashModal}
          amount={this.state.total_outstanding_payment}
          takeCash={amount => this.takeCash(amount)}
        />
        <CreditHistoryModal
          show={this.state.showCreditHistoryModal}
          onHide={this.handleshowCreditHistoryModal}
        />
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    user: state.userReducer,
    setCustomerForOrder: state.setCustomerForOrder,
    creditHistory: state.creditHistory,
    setCustomerForDetails: state.setCustomerForDetails
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps)(CreateCustomerModal);
