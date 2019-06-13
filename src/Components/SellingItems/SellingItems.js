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
import { getTopItemsBySales } from "../../oscar-pos-core/actions";
import Categories from "../../Components/Categories/Categories";
import "./SellingItems.css";
// import { getItem, getTotal } from "../../constants";

class SellingItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCategories: false,
      showBackArrow: false
    };
  }

  toggleshowCategories = () => {
    this.setState({
      showCategories: !this.state.showCategories
    });
  };
  trueshowBackArrow = () => {
    this.setState({ showBackArrow: true });
  };
  falseshowBackArrow = () => {
    this.setState({ showBackArrow: false });
  };
  render() {
    // console.log("this.state: ", this.state);
    let cartLength = Object.keys(this.props.cart).length;
    return (
      <section
        style={{
          borderRight: "2px solid #58595b",
          display: "grid",
          gridTemplateRows: this.state.showBackArrow ? "1fr 9fr" : "1fr",
          height: "90vh"
        }}
      >
        {this.state.showBackArrow ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 7fr",
              height: "10vh",
              borderBottom: "2px solid #dfdfdf"
            }}
          >
            <div
              className="back-btn"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={() => {
                this.falseshowBackArrow();
                this.toggleshowCategories();
              }}
            >
              <img
                width="30px"
                src={require("../../assets/images/back-arrow.svg")}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: "35%"
              }}
            >
              Categories
            </div>
          </div>
        ) : null}
        {this.state.showCategories ? (
          <Categories
            trueshowBackArrow={this.trueshowBackArrow}
            toggleshowCategories={this.falseshowBackArrow}
            addProductInCart={(e, product) =>
              this.props.addProductInCart(e, product)
            }
          />
        ) : (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                height: "10vh"
              }}
            >
              <div
                className="back-btn"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  borderBottom: "1px solid rgb(240, 242, 241)",
                  cursor: "pointer",
                  userSelect: "none",
                  color: "#000",
                  borderLeft: "1px solid rgb(240, 242, 241)"
                }}
                onClick={() => {
                  this.toggleshowCategories();
                  this.trueshowBackArrow();
                }}
              >
                <div>Categories</div>
              </div>
              <div
                style={{
                  userSelect: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  borderLeft: "1px solid rgb(240, 242, 241)",
                  borderBottom: "1px solid rgb(240, 242, 241)",
                  cursor: "pointer",
                  color: "#dfdfdf"
                }}
              >
                <div>Recent Purchases</div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                height: "10vh"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  borderBottom: "1px solid rgb(240, 242, 241)",
                  cursor: "pointer",
                  userSelect: "none",
                  color: "#dfdfdf",
                  borderLeft: "1px solid rgb(240, 242, 241)"
                }}
              >
                <div>Discounted Items</div>
              </div>
              <div
                style={{
                  userSelect: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  borderLeft: "1px solid rgb(240, 242, 241)",
                  borderBottom: "1px solid rgb(240, 242, 241)",
                  cursor: "pointer",
                  color: "#dfdfdf"
                }}
              >
                <div>Deals / Promotions</div>
              </div>
            </div>
            <div
              onClick={() => {
                this.toggleshowCategories();
                this.trueshowBackArrow();
              }}
              style={{ height: "70vh" }}
            >
              {!this.state.showCategories && (
                <Categories
                  trueshowBackArrow={this.trueshowBackArrow}
                  toggleshowCategories={this.falseshowBackArrow}
                  addProductInCart={(e, product) =>
                    this.props.addProductInCart(e, product)
                  }
                />
              )}
            </div>
          </div>
        )}
      </section>
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
})(SellingItems);
