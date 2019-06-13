import React, { Component } from "react";
import { connect } from "react-redux";
import { formatNum } from "../../oscar-pos-core/constants";
import { PRODUCT, CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
import Fuse from "fuse.js";
import { ToastContainer, toast } from "react-toastify";
import {
  emptyCart,
  setEmptyCartFlag,
  set_opening_balance,
  logout,
  createPayment,
  getTopProducts,
  removeProduct,
  updateProduct
} from "../../oscar-pos-core/actions";
import "./ItemDetails.css";

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
class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: "",
      disabled: true
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
    if (e.key == "Enter") {
      var fuseRef = new Fuse(this.props.products, options);
      var result = fuseRef.search(this.state.barcode);
      console.log("result: ", result);
      if (result.length) {
        this.props.dispatch({
          type: PRODUCT.SET_PRODUCT_FOR_RECEIVE_ITEM,
          data: result[0]
        });
      } else {
        alert("product not found");
      }
    }
  };

  onChange = e => {
    if (e.target.value > 0 || e.target.value == 0) {
      this.setState(
        { quantity: e.target.value == 0 ? "" : e.target.value },
        () => {
          this.setState({ disabled: this.state.quantity > 0 ? false : true });
        }
      );
    }
  };

  updateProductQuantity = () => {
    if (this.state.quantity) {
      let productObj = this.props.setProductForReveiceItem;
      productObj["qty_in_stock"] =
        (Number(productObj.qty_in_stock) || 0) + Number(this.state.quantity);
      let product = {
        product_data: productObj,
        product_id: productObj._id
      };
      this.props.dispatch(updateProduct(null, product)).then(res => {
        console.log("res:::::: ", res);
        toast.success("Successfully Received!", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        this.setState({ quantity: "", disabled: true }, () => {
          setTimeout(() => {
            // this.props.history.push("/reveiveItems");
          });
        });
      });
    }
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
              onClick={() => this.props.history.push("/reveiveItems")}
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
            ITEMS DETAILS
          </div>
          <div
            style={{
              width: "100%",
              color: "#414042",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-evenly",
              background: '#f2fcfe',
              width: "85%",
              marginBottom: 35,
              paddingTop: 12,
            }}
          >
            <div className="itemDetailsTable">
              <div className="itemDetailsTableheader">Product Name</div>
              <div className="itemDetailsTableRow">
                {this.props.setProductForReveiceItem.display_name}
              </div>
            </div>
            <div className="itemDetailsTable">
              <div className="itemDetailsTableheader">Product Barcode</div>
              <div className="itemDetailsTableRow">
                {this.props.setProductForReveiceItem.barcode}
              </div>
            </div>
            <div className="itemDetailsTable">
              <div className="itemDetailsTableheader">Quantity in stock</div>
              <div className="itemDetailsTableRow">
                {this.props.setProductForReveiceItem.qty_in_stock || 0}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "25px",
              textAlign: "center",
              lineHeight: "32px"
            }}
          >
            Enter quantity of Receive
            <br /> Items
          </div>
          <div>
            <input
              autoFocus
              type="number"
              value={this.state.quantity}
              style={{
                border: "none",
                borderBottom: "2px solid #d1d3d4",
                width: "20em",
                outline: "none"
              }}
              placeholder="Enter Quantity"
              onChange={this.onChange}
              onKeyPress={e => {
                if (e.key == "Enter") {
                  this.updateProductQuantity();
                }
              }}
            />
          </div>
          <button
            disabled={this.state.disabled}
            onClick={this.updateProductQuantity}
            style={{
              fontSize : 15,
              borderRadius : 5,
              width: "18em",
              height: "4em",
              border: "none",
              background: this.state.disabled ? "#718093" : "#d7df23",
              color: "#fff",
              outline: "none"
            }}
          >
            Submit
          </button>
        </section>
        <ToastContainer autoClose={2000} />
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
    setProductForReveiceItem: state.setProductForReveiceItem
  };
})(ItemDetails);
