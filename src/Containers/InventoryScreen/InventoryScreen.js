import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddProductModal from "../../Components/addProductModal/addProductModal";
import { CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
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
import "./InventoryScreen.css";

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
class InventoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  logout = () => {
    this.props.dispatch(emptyCart());
    // localStorage.setItem("pos_session_id", null);
    this.props
      .dispatch(logout())
      .then(() => {
        localStorage.setItem("user", null);
        this.props.dispatch({
          type: CUSTOMER.RESET_CUSTOMER_FOR_ORDER
        });
        this.props.dispatch({
          type: SESSION.RESET_POS_SESSION_ID
        });
        this.props.history.replace("/");
      })
      .catch(error => {
        console.log("error logout function ");
      });
  };

  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  editProduct = product => {
    this.setState(
      {
        productObj: product,
        editMode: true,
        forUpdateComponentWillReceiveProps: true
      },
      () => {
        this.handleAddProductModal();
      }
    );
  };

  handleAddProductModal = () => {
    this.setState({ showAddProductModal: !this.state.showAddProductModal });
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
              onClick={this.toggleDrawer}
              className="menu-img"
              src={require("../../assets/images/menuicon.svg")}
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
        <section style={{ height: "90vh", overflowX: "hidden" }}>
          <div
            style={{
              height: "50%",
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "4fr 1fr",
              justifyItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <img
                width="175px"
                src={require("../../assets/images/inventory.png")}
              />
            </div>
            <div
              style={{
                fontSize: "25px",
                fontWeight: "lighter",
                paddingTop: "50px"
              }}
            >
              Set all your inventory in one place
            </div>
          </div>
          <div
            style={{
              height: "50%",
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "repeat(2, 1fr)",
              justifyItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18
              }}
            >
              What would you like to go with
            </div>
            <div
              style={{
                width: "80%",
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              <button
                onClick={() => this.props.history.push("/goodreceive")}
                style={{
                  width: "22em",
                  height: "4em",
                  fontSize: 15,
                  borderRadius: 5,
                  border: "none",
                  background: "#d7df23",
                  color: "#fff",
                  outline: "none"
                }}
              >
                RECEIVE ITEMS
              </button>
              <button
                onClick={() => this.props.history.push("/goodreceiveaudit")}
                style={{
                  width: "22em",
                  height: "4em",
                  border: "none",
                  fontSize: 15,
                  borderRadius: 5,
                  background: "#d7df23",
                  color: "#fff",
                  outline: "none"
                }}
              >
                DO ITEMS AUDIT
              </button>
            </div>
          </div>
        </section>
        <Drawer
          history={this.props.history}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          logout={this.logout}
        />
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
})(InventoryScreen);
