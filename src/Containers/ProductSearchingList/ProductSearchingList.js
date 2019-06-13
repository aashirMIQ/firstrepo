import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddProductModal from "../../Components/addProductModal/addProductModal";
import { PRODUCT, CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
import Drawer from "../../Components/Drawer/Drawer";
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
import "./ProductSearchingList.css";

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
      userInput: "",
      products: []
    };
  }
  componentDidMount() {
    // this.props.dispatch(getTopProducts(null));
    this.setState({ products: this.props.products.slice(0, 20) });
  }
  onChange = e => {
    this.setState({ userInput: e.target.value }, () => {
      if (this.state.userInput.length === 0) {
        this.setState({ products: this.props.products.slice(0, 20) });
      }
    });
  };
  searchProducts = e => {
    let options = {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      caseSensitive: false,
      keys: ["barcode", "display_name", "id"]
    };
    if (e.key == "Enter") {
      var fuseRef = new Fuse(this.props.products, options);
      var result = fuseRef.search(this.state.userInput);
      console.log("result: ", result.slice(0, 20));
      this.setState({ products: result.slice(0, 20) });
    }
  };

  setProductForReceiveItem = product => {
    this.props.dispatch({
      type: PRODUCT.SET_PRODUCT_FOR_RECEIVE_ITEM,
      data: product
    });
    if (this.props.location.state && this.props.location.state.fromAuditItem) {
      this.props.history.push("/auditItemDetails");
      return;
    }
    this.props.history.push("/itemDetails");
  };

  render() {
    console.log("this.props: ", this.props);
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
              onClick={() => this.props.history.goBack()}
              className="menu-img"
              width="30px"
              src={require("../../assets/images/left-arrow.svg")}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 9fr"
            }}
          >
            <div style={styles.center}>
              <img
                src={require("../../assets/images/searchicon.svg")}
                width={"25px"}
              />
            </div>
            <input
              style={{
                color: "#fff",
                width: "100%",
                height: "100%",
                outline: "none",
                background: "transparent",
                border: "none"
              }}
              placeholder="Search product by barcode or name"
              onChange={this.onChange}
              onKeyPress={this.searchProducts}
            />
          </div>
        </header>
        <section
          style={{
            height: "90vh",
            overflow: "scroll",
            overflowX: "hidden"
          }}
        >
          {this.state.products.map((customer, i) => {
            return (
              <div
                onClick={() => this.setProductForReceiveItem(customer)}
                key={customer.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.1fr 0.25fr 0.25fr 0.4fr",
                  paddingLeft: "1em",
                  borderBottom: "3px solid #eeeeee",
                  cursor: "pointer"
                }}
              >
                <div style={{ ...styles.center, padding: "1em" }}>
                  <div
                    style={{
                      ...styles.center,
                      color: "#fff",
                      // backgroundColor: colors[i] ? colors[i] : colors[0],
                      border: "1px solid #000",
                      color: "#000",
                      height: "4em",
                      width: "4em",
                      borderRadius: "4em",
                      padding: "1em"
                    }}
                  >
                    {customer.display_name.slice(0, 2)}
                  </div>
                </div>
                <div
                  style={{
                    ...styles.center,
                    padding: "1em",
                    alignItems: "none",
                    flexDirection: "column"
                  }}
                >
                  <div style={{ fontSize: "19pt" }}>
                    {customer.display_name}
                  </div>
                  {/* <div>{customer.phone}</div> */}
                </div>
                <div
                  style={{
                    ...styles.center,
                    padding: "1em",
                    display: "flex",
                    justifyContent: "space-evenly",
                    padding: "1em",
                    alignItems: "center"
                  }}
                >
                  <div>
                    Barcode{" "}
                    <span>
                      {customer.barcode.toString().length > 13
                        ? `${customer.barcode.toString().slice(0, 13)}...`
                        : customer.barcode}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    ...styles.center,
                    flexDirection: "column",
                    position: "relative",
                    paddingLeft: "10em"
                  }}
                >
                  <div style={{ position: "relative" }}>
                    Rs <span>{customer.list_price}</span>
                  </div>
                </div>
              </div>
            );
          })}
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
    topProduct: state.topProductReducer
  };
})(ReceiveItems);
