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
import {
  onLogin,
  addProduct,
  getProducts,
  submitOrder,
  clearCurrentOrderInfo,
  emptyCart,
  resetGlobalDiscount
} from "../../oscar-pos-core/actions"; //start from there
import "./ThankyouScreen.css";
import { formatNum } from "../../constants";

class Thankyou extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  newOrder = () => {
    this.props.dispatch(clearCurrentOrderInfo());
    this.props.dispatch(emptyCart());
    this.props.dispatch(resetGlobalDiscount());
    this.props.dispatch({ type: CUSTOMER.RESET_CUSTOMER_FOR_ORDER });
    this.props.history.replace("/home");
  };

  render() {
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
            <img width="100px" src={require("../../assets/images/logo.png")} />
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
              marginTop: "3em"
            }}
          >
            <div>
              <img
                width="25px"
                src={require("../../assets/images/newicons/Checkmark.svg")}
              />
            </div>
            <div style={{ marginLeft: "5px", fontSize: "15px" }}>
              SALE COMPLETED
            </div>
          </div>
          <div
            style={{
              color: "#fff",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "35px" }}>Bill Amount</div>
            <div style={{ fontSize: "60px" }}>
              Rs. {formatNum(this.props.charge)}
            </div>
            <div style={{ fontSize: "24px", color: "rgb(211, 211, 56)" }}>
              Cash Paid: Rs. {formatNum(this.props.tenderAmount)}
            </div>
            <div style={{ fontSize: "24px", color: "#d3d338" }}>
              Change: Rs. {formatNum(this.props.change)}
            </div>
          </div>
          <div style={{ textAlign: "center", color: "#fff", fontSize: "20px" }}>
            {this.props.user && "For"}
          </div>
          <div
            style={{
              color: "#fff",
              textAlign: "center",
              marginBottom: "4em"
            }}
          >
            <div style={{ textTransform: "capitalize", fontSize: "20px" }}>
              {this.props.user && this.props.user.name}
            </div>
            <div>{this.props.user && this.props.user.phone}</div>
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
            New Order
          </Button>
        </footer>
        {/* <h1>Rs. {this.props.change}</h1>
        <h3>Out of Rs. {this.props.tenderAmount}</h3>
        <br />
        <h2>Thankyou for shopping with us</h2> */}
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
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
    user: state.setCustomerForOrder
  };
})(Thankyou);
