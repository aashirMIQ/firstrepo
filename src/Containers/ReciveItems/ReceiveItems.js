import React, { Component } from "react";
import { connect } from "react-redux";
import { formatNum } from "../../oscar-pos-core/constants";
import { PRODUCT, CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
import Fuse from "fuse.js";
import {
  emptyCart,
  setEmptyCartFlag,
  set_opening_balance,
  logout,
  createPayment,
  getTopProducts,
  removeProduct
} from "../../oscar-pos-core/actions";
import "./ReceiveItems.css";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  calBtn1: {
    userSelect: "none",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    borderRadius: "0px",
    border: "1px solid #e7e7ef",
    background: "transparent",
    color: "#58595b",
    fontSize: "30px"
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
class ReceiveItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barcode: ""
    };
  }

  searchProducts = e => {
    let options = {
      shouldSort: true,
      threshold: 0.0,
      tokenize: true,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: this.state.barcode.length,
      caseSensitive: false,
      keys: ["barcode"]
    };
    if (e.key == "Enter" && this.state.barcode.length >= 3) {
      var fuseRef = new Fuse(this.props.products, options);
      var result = fuseRef.search(this.state.barcode);
      console.log("result: ", result);
      if (result.length) {
        this.props.dispatch({
          type: PRODUCT.SET_PRODUCT_FOR_RECEIVE_ITEM,
          data: result[0]
        });
        this.props.history.push("/itemDetails");
      } else {
        alert("product not found");
      }
    }
  };

  onChange = e => {
    this.setState({ barcode: e.target.value });
  };

  render() {
    return (
      <div>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 9fr",
            background: "#662d94",
            height: "10vh"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer"
            }}
          >
            <img
              onClick={() => this.props.history.push("/inventoryScreen")}
              className="menu-img"
              width="30px"
              src={require("../../assets/images/left-arrow.svg")}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              color: "#fff",
              paddingRight: "10vw"
            }}
          >
            INVENTORY MANAGEMENT
          </div>
        </header>
        {this.props.setP}
        <section
          style={{
            height: "90vh",
            overflowX: "hidden",
            display: "grid",
            gridTemplateRows: "repeat(5, 1fr)",
            justifyItems: "center"
          }}
        >
          <div
            style={{
              color: "#414042",
              fontSize: "15px",
              textAlign: "center",
              paddingTop: "40px"
            }}
          >
            RECEIVE ITEMS
          </div>
          <div
            style={{
              fontSize: "25px",
              textAlign: "center",
              lineHeight: "32px"
            }}
          >
            Scan your item or <br /> Enter Barcode Number
          </div>
          <div>
            <input
              autoFocus
              style={{
                border: "none",
                borderBottom: "2px solid #d1d3d4",
                width: "20em",
                outline: "none"
              }}
              placeholder="Enter Barcode"
              type="text"
              onChange={this.onChange}
              onKeyPress={this.searchProducts}
            />
          </div>
          <button
            onClick={this.searchProducts}
            style={{
              width: "18em",
              height: "4em",
              fontSize : 15,
              borderRadius : 5,
              border: "none",
              background:
                this.state.barcode.length >= 3 ? "#d7df23" : "#d1d3d4",
              color: "#fff",
              outline: "none"
            }}
          >
            Submit
          </button>

          <div
            style={{ color: "#27aae1", cursor: "pointer" }}
            onClick={() => this.props.history.push("/searchProduct")}
          >
            Browse Inventory
            <hr
              style={{
                marginTop: "0",
                marginBottom: "0",
                border: "0",
                borderTop: "2px solid #27aae1",
                color: "#27aae1"
              }}
            />
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
    user: state.userReducer,
    pos_session_id: state.pos_session_id,
    customer: state.setCustomerForOrder,
    setCustomerForUdhaar: state.setCustomerForUdhaar,
    topProduct: state.topProductReducer,
    setProductForReceiveItem: state.setProductForReceiveItem
  };
})(ReceiveItems);
