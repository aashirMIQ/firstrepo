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
import { emptyCart, setPaymentMethod } from "../../oscar-pos-core/actions";
import "./BillAmount.css";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};
class BillAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: 0
    };
  }

  componentDidMount() {
    this.populateCart();
  }

  populateCart = () => {
    // console.log('cart: ', cart)
    let virtualCart = [];
    let { products, cart } = this.props;
    let totalCharge = getTotal(this.props.cart, this.props.products);
    this.setState({ charge: totalCharge });
  };

  newOrder = () => {
    // this.props.dispatch(clearCurrentOrderInfo());
    this.props.dispatch(emptyCart());
    this.props.history.replace("/");
  };

  navigateToPayment = paymentMethod => {
    this.props.dispatch(setPaymentMethod(paymentMethod));
    if (paymentMethod == "udhaar" && !this.props.setCustomerForOrder) {
      this.props.history.push({
        pathname: "/customers",
        state: {
          isUdhaar: true
        }
      });
      return;
    }
    if (paymentMethod == "udhaar" && this.props.setCustomerForOrder) {
      this.props.history.push({
        pathname: "/udhaarScreen",
        state: {
          to_invoice: true
        }
      });
      return;
    }
    this.props.history.push("/payment");
  };

  render() {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "grid",
          gridTemplateRows: "1fr 9fr"
        }}
      >
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 9fr",
            background: "#662d94"
          }}
        >
          <div style={{ ...styles, cursor: "pointer" }}>
            <img
              onClick={() => this.props.history.goBack()}
              src={require("../../assets/images/icons/back-icon.svg")}
            />
          </div>
          <div
            style={{
              color: "#fff",
              ...styles.center,
              paddingRight: "10%"
            }}
          >
            Payment
          </div>
        </header>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "0.2fr 0.3fr 0.5fr"
          }}
        >
          <div style={{ ...styles.center, flexDirection: "column" }}>
            <div>Bill Amount</div>
            <div>RS. {this.state.charge}</div>
          </div>
          <div style={{ ...styles.center }}>
            <img
              width="195px"
              src={require("../../assets/images/icons/img.png")}
            />
          </div>
          <div style={{ ...styles.center, flexDirection: "column" }}>
            <div>Choose your preffered payment option</div>
            <div
              onClick={() => this.navigateToPayment("cash")}
              style={{ ...styles.center, cursor: "pointer" }}
            >
              <img src={require("../../assets/images/icons/cash-color.svg")} />
              <div>CASH</div>
            </div>
            <div
              onClick={() => this.navigateToPayment("udhaar")}
              style={{ ...styles.center, cursor: "pointer" }}
            >
              <img src={require("../../assets/images/icons/udhar-color.svg")} />
              <div>UDHAAR</div>
            </div>
          </div>
        </section>
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
    setCustomerForOrder: state.setCustomerForOrder
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
  };
})(BillAmount);
