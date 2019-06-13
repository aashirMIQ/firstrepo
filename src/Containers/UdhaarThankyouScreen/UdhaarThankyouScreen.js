import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import { connect } from "react-redux";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import Divider from "@material-ui/core/Divider";
import {
  onLogin,
  addProduct,
  getProducts,
  submitOrder,
  clearCurrentOrderInfo,
  emptyCart,
  resetGlobalDiscount
} from "../../oscar-pos-core/actions"; //start from there
import { formatNum } from "../../constants";
import "./UdhaarThankyouScreen.css";

class UdhaarThankyouScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  newOrder = () => {
    this.props.dispatch(clearCurrentOrderInfo());
    this.props.dispatch(emptyCart());
    this.props.dispatch(resetGlobalDiscount());
    this.props.dispatch({ type: CUSTOMER.RESET_CUSTOMER_FOR_ORDER });
    this.props.dispatch({ type: CUSTOMER.RESET_CUSTOMER_FOR_UDHAAR });
    this.props.location.state.commingFromNewUdhaar
      ? this.props.history.replace("/giveUdhaar")
      : this.props.history.replace("/home");
  };

  render() {
    console.log("this.props from udhaarThankyouScreen: ", this.props);
    let customer = this.props.location.state.commingFromNewUdhaar
      ? this.props.setCustomerForUdhaar
      : this.props.customer;
    let { state } = this.props.location;
    let objLen = Object.keys(state);
    console.log("state: ", state);
    if (objLen.length > 1) {
      return (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            backgroundImage: "linear-gradient(#776cd3 ,#d35ffb)"
          }}
        >
          <header
            style={{
              height: "10vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div>
              <img
                width="100px"
                src={require("../../assets/images/logo.png")}
              />
            </div>
          </header>
          <section
            style={{
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "13px",
                color: "#fff",
                marginTop: "1em"
              }}
            >
              <div>
                <img
                  width="25px"
                  src={require("../../assets/images/newicons/Checkmark.svg")}
                />
              </div>
              <div style={{ marginLeft: "5px", fontSize: "16px" }}>
                {this.props.location.state.commingFromNewUdhaar
                  ? "UDHAAR"
                  : "SALE"}{" "}
                COMPLETED
              </div>
            </div>
            <div
              style={{
                color: "#fff",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "35px" }}>
                {this.props.location.state.commingFromNewUdhaar
                  ? "Udhaar Amount"
                  : "Bill Amount"}
              </div>
              <div style={{ fontSize: "60px" }}>
                Rs.{" "}
                {!this.props.location.state.commingFromNewUdhaar &&
                  state.udhaarAmount}
                {this.props.location.state.commingFromNewUdhaar
                  ? state.udhaarAmount
                  : state.charge}
              </div>
              <div style={{ fontSize: "35px" }}>
                {this.props.location.state.commingFromNewUdhaar
                  ? ""
                  : state.cashPaid &&
                    `Cash Paid: Rs ${formatNum(state.cashPaid)}`}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "#d3d338",
                  lineHeight: "2em"
                }}
              >
                {this.props.location.state.commingFromNewUdhaar ? null : (
                  <span>
                    Udhaar: Rs. {formatNum(Math.abs(state.udhaarAmount)) || 0}
                  </span>
                )}
              </div>
            </div>
            <div
              style={{ textAlign: "center", color: "#fff", fontSize: "20px" }}
            >
              For
            </div>
            <div
              style={{
                color: "#fff",
                textAlign: "center"
                // marginBottom: "4em"
              }}
            >
              <div style={{ textTransform: "capitalize", fontSize: "20px" }}>
                {customer.name}
              </div>
              <div>{customer.phone}</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#fff",
                marginBottom: "35px"
              }}
            >
              <div
                style={{ height: "2em", width: "15em", borderTop: "1px solid" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "15em"
                }}
              >
                <div>Pending Udhaar</div>
                <div>
                  Rs.{" "}
                  {this.props.location.state.commingFromNewUdhaar
                    ? customer.total_outstanding_payment
                    : customer.total_outstanding_payment -
                        Math.abs(state.udhaarAmount) || 0}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "15em"
                }}
              >
                <div>New Udhaar</div>
                <div>Rs. {Math.abs(state.udhaarAmount) || 0}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "15em"
                }}
              >
                <div>Total Udhaar</div>
                <div>
                  Rs.{" "}
                  {this.props.location.state.commingFromNewUdhaar
                    ? customer.total_outstanding_payment +
                        Math.abs(state.udhaarAmount) || 0
                    : customer.total_outstanding_payment}
                </div>
              </div>
            </div>
          </section>
          <footer
            style={{
              height: "10vh"
            }}
          >
            <Button
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0px",
                background: "#d7df23",
                border: "none",
                fontSize: "25px"
              }}
              onClick={this.newOrder}
            >
              {this.props.location.state.commingFromNewUdhaar
                ? "New Customer"
                : "New Order"}
            </Button>
          </footer>

          {/* <div>Thankyou</div>
          <div>Udhaar Given</div>
          <div>{Math.abs(state.udhaarAmount) || 0}</div>
          <Divider />
          <div>{this.props.customer.name}</div>
          <div>Udhaar Remaining</div>
          <div>{this.props.customer.total_outstanding_payment || 0}</div>
          <Button onClick={this.newOrder}>New Order</Button> */}
        </div>
      );
    }
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw"
        }}
      >
        <div>Thankyou</div>
        <div>Udhaar Given</div>
        <div>{this.props.location.state.udhaarAmount || 0}</div>
        <Divider />
        <div>{this.props.customer.name}</div>
        <div>Udhaar Remaining</div>
        <div>{this.props.location.state.udhaarAmount || 0}</div>
        <Button onClick={this.newOrder}>New Order</Button>
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
    customer: state.setCustomerForOrder,
    setCustomerForUdhaar: state.setCustomerForUdhaar
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
  };
})(UdhaarThankyouScreen);
