import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import { connect } from "react-redux";
import CurrentSale from "../../Components/Cart/CurrentSale";
import "./footer.css";
// import { getItem, getTotal } from "../../constants";


class Footer extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    // console.log("this.state: ", this.state);
    return (
        <footer className="home-footer-main">
          <div className="home-footer-main-col-1">
            <img
              width={"100px"}
              src={require("../../assets/images/dukan-icon.png")}
            />
          </div>
          <div className="home-footer-main-col-2">
            <div className="home-footer-main-col-2-1">
              <div>
                <img
                  width="30px"
                  src={require("../../assets/images/person-icon.svg")}
                />
              </div>
              <div>
                Cashier
                <br />
                <span>Zubair</span>
              </div>
            </div>
            <div>
              <img
                width="30px"
                src={require("../../assets/images/stack-icon.svg")}
              />
            </div>
            <div>
              <img
                width="30px"
                src={require("../../assets/images/badge-icon.svg")}
              />
            </div>
            <div>
              <img
                onClick={() => this.props.handleDiscountModal()}
                width="30px"
                src={require("../../assets/images/percent-icon.svg")}
              />
            </div>

            {/* */}
          </div>
          <div
            style={{ cursor: "pointer" }}
            className="home-footer-main-col-3"
            onClick={
              this.props.charge > 0
                ? () => this.props.navigateToPayment()
                : () => alert("Please select products")
            }
          >
            Rs. {this.props.charge}
          </div>
        </footer>
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
    cart: state.cart
  };
})(Footer);
