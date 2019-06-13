import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import { createCustomer, updateCustomer } from "../../oscar-pos-core/actions";
import { uuid } from "../../oscar-pos-core/constants";
import validator from "validator";
import { CustomerSchema } from "../../db/Schema";
// import "./CustomerDetailsModal.css";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import { formatted_date, formatNum } from "../../oscar-pos-core/constants";
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
      customerObj: {}
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

  componentWillReceiveProps(nextProps) { }
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
              <div style={styles.headerItem}>
                <img
                  width="50px"
                  onClick={this.props.onHide}
                  src={require("../../assets/images/newicons/Back.svg")}
                />
              </div>
              <div style={styles.headerItem}>History</div>
              <div style={styles.headerItem} />
              {/* <Modal.Title>Customer Details</Modal.Title> */}
            </Modal.Header>
            <Modal.Body style={{ padding: "0px" }}>
              <div
                onSubmit={this.createCustomer}
                style={{
                  height: "75vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                {this.props.creditHistory.length ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gridTemplateRows: "10vh",
                      width: "100%",
                      background: "#f7f8f8",
                      padding: "0 2em",
                      color: "#414042"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      Date
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      Udhaar
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                      }}
                    >
                      Jama
                    </div>
                  </div>
                ) : (
                    <div />
                  )}
                <div
                  style={{
                    width: "100%",
                    overflowY: "scroll",
                    height: '65vh'
                  }}
                >
                  {this.props.creditHistory.map((data, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gridTemplateRows: "10vh",
                          borderBottom: "2px solid #f7f8f8",
                          padding: "0 2em"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          {formatted_date(data.date)}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {data.payment_mode === "Udhaar" && data.amount ? (
                            <span style={{ color: "#e82f45" }}>
                              Rs.
                              <span style={{ fontWeight: "bold" }}>
                                {formatNum(data.amount)}
                              </span>
                            </span>
                          ) : (
                              <span>-</span>
                            )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end"
                          }}
                        >
                          {data.payment_mode === "Jama" && data.amount ? (
                            <span style={{ color: "#39b54a" }}>
                              Rs.
                              <span style={{ fontWeight: "bold" }}>
                                {formatNum(data.amount)}
                              </span>
                            </span>
                          ) : (
                              <span>-</span>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    user: state.userReducer,
    setCustomerForOrder: state.setCustomerForOrder,
    creditHistory: state.creditHistory
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps)(CreateCustomerModal);
