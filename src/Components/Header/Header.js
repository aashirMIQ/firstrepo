import React, { Component } from "react";
import {
  emptyCart,
  setEmptyCartFlag,
  set_opening_balance,
  logout
} from "../../oscar-pos-core/actions";
import { connect } from "react-redux";
import Drawer from "../Drawer/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CreateCustomerModal from "../CreateCustomerModal/CreateCustomerModal";
import OpenBalanceModal from "../OpenBalanceModal/OpenBalanceModal";
import AddProductModal from "../addProductModal/addProductModal";
import { CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
import "./Header.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      show: false,
      searchOrder: false,
      showOpenBalanceModal: false,
      editMode: false,
      showAddProductModal: false
    };
  }
  componentDidMount() {
    setTimeout(() => {}, 100);
  }
  toggleDrawer = () => {
    console.log("from toggle Drawer: ");
    this.setState({ open: !this.state.open });
  };

  onHide = () => {
    console.log("from onHide createCustomer: ");
    this.setState({ show: !this.state.show });
  };

  resetShow = () => {
    this.setState({ show: !this.state.show });
  };

  clearCart = () => {
    this.props.dispatch(emptyCart());
    setTimeout(() => {
      this.props.dispatch(setEmptyCartFlag());
    }, 100);
  };

  toggleSearchOrder = () => {
    // this.setState({ searchOrder: !this.state.searchOrder }, () => {
    //   console.log("searchOrder: ", this.state.searchOrder);
    // });
  };
  handleSwitch = name => event => {
    console.log("checked: ", event.target.checked);
    this.setState({ [name]: event.target.checked });
  };

  onFocusOnInput = () => {
    this.props.toggleSearchView();
  };

  //for clearing input
  clearInput = () => {
    if (this.props.searchItemText.length) {
      this.props.clearInput();
    }
  };

  //switch to customer searching
  switchToCustomerSearching = () => {
    this.props.switchToCustomerSearching();
    console.log("switchToCustomerSearching: ");
  };

  //switch to product searching
  switchToProductSearching = () => {
    this.props.switchToProductSearching();
    console.log("switchToProductSearching: ");
  };
  openSession = () => {
    this.handleOpenBalanceModal();
    // this.props.openSession();
  };
  closeSession = () => {
    this.props.closeSession();
  };
  handleOpenBalanceModal = () => {
    this.setState({ showOpenBalanceModal: !this.state.showOpenBalanceModal });
  };
  addOpenBalace = amount => {
    this.props.openSession().then(openSessionRes => {
      console.log("openSessionResponse1: ", openSessionRes);
      this.props
        .dispatch(set_opening_balance(null, amount, openSessionRes))
        .then(res => {
          this.handleOpenBalanceModal();
        });
    });
    console.log("amount from open balance modal: ", amount);
  };
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

  handleAddProductModal = () => {
    console.log("show product modal: ", this.state.showAddProductModal);
    this.setState(
      { showAddProductModal: !this.state.showAddProductModal },
      () => {
        console.log("showAddProductModal: ", this.state.showAddProductModal);
      }
    );
  };
  render() {
    console.log(
      "this.props from header component***********************: ",
      this.props
    );
    console.log("this.props.pos_session_id: ", this.props.pos_session_id);
    let { user } = this.props;
    console.log("user : ", user);
    // console.log("this.state: ", this.state);
    if (this.props.searchedView) {
      return (
        <header
          // className="header-wrapper"
          style={{
            display: "grid",
            gridTemplateColumns: "0.8fr 0.1fr 0.1fr",
            background: "#fff",
            borderBottom: "2px solid #662d94"
            // zIndex: '999999999999'
          }}
        >
          <section
            // className="header-wrapper-col-1"
            style={{
              display: "grid",
              gridTemplateColumns: "0.1fr 0.1fr 0.8fr",
              border: "none"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor:'pointer'
              }}
              onClick={this.props.showHomeContent}
            >
              back
            </div>
            <div
              style={{
                // border: "1px solid",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img
                className="search-icon"
                width="50px"
                src={require("../../assets/images/icons/search.svg")}
              />
            </div>
            <div
              style={{
                // border: "1px solid",
                height: "100%",
                width: "100%"
              }}
            >
              <input
                autoFocus={true}
                placeholder={
                  this.props.searchCustomerFlag
                    ? "Search Customer"
                    : "Search Products"
                }
                className="input-field"
                value={this.props.searchItemText}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#d1d3d4",
                  outline: "none"
                }}
                onKeyPress={e => {
                  // console.log('now key is pressed: ', e.key);
                  if (e.key == "Enter") {
                    this.props.enterPress(e.key);
                  }
                }}
                onChange={e => {
                  this.props.onChange(e);
                }}
                // onChange={this.props.onChange}
              />
            </div>
          </section>
          <section
            className="header-wrapper-col-2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0px",
              padding: "0px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                cursor: "pointer"
              }}
            >
              <img
                width="50px"
                onClick={this.props.emptyInput}
                // onClick={}
                src={require("../../assets/images/icons/close.svg")}
              />
            </div>
          </section>
          <section
            className="header-wrapper-col-3"
            style={{
              borderLeft: "3px solid #f0f2f1"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img
                onClick={
                  this.props.searchCustomerFlag
                    ? this.switchToProductSearching
                    : this.switchToCustomerSearching
                }
                width="50px"
                src={
                  this.props.searchCustomerFlag
                    ? require("../../assets/images/icons/search-color.svg")
                    : require("../../assets/images/icons/person.svg")
                }
              />
            </div>
          </section>
        </header>
      );
    }
    return (
      <header className="header-wraper" style={{ backgroundColor: "#662d94" }}>
        <div
          className="header-wrapper-col-1"
          style={{ borderRight: "3px solid #5e2985", height: "10vh" }}
        >
          <div onClick={this.toggleDrawer}>
            <img
              width="32px"
              className="menu-img"
              src={require("../../assets/images/menuicon.svg")}
            />
          </div>
        </div>
        <div className="header-wrapper-col-2">
          {this.state.searchOrder ? (
            <div>
              <img
                src={require("../../assets/images/searchicon.svg")}
                width={"32px"}
              />
              <input
                placeholder="Search order by id #"
                onChange={this.props.orderOnChange}
              />
            </div>
          ) : (
            <div style={{ display: "flex", width: "100%" }}>
              <img
                src={require("../../assets/images/searchicon.svg")}
                width={"32px"}
              />
              <input
                className="input"
                onFocus={this.onFocusOnInput}
                placeholder="Search Items by Name and Barcode"
                onChange={this.props.onChange}
                style={{ width: "90%" }}
                // width="90%"
              />
            </div>
          )}
        </div>
        <div
          className="header-wrapper-col-3"
          onClick={this.toggleSearchOrder}
          style={{ borderLeft: "3px solid #5e2985", color: "#662d94" }}
          disabled={true}
        >
          {/* <Switch
            checked={this.state.searchOrder}
            onChange={this.handleSwitch("searchOrder")}
            value="searchOrder"
            color="secondary"
          /> */}
          Actions
        </div>
        <Drawer
          history={this.props.history}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          logout={this.logout}
        />
        <CreateCustomerModal
          resetShow={this.resetShow}
          show={this.state.show}
          onHide={this.onHide}
        />

        <OpenBalanceModal
          show={this.state.showOpenBalanceModal}
          onHide={this.handleOpenBalanceModal}
          addOpenBalance={amount => this.addOpenBalace(amount)}
        />

        <AddProductModal
          show={this.state.showAddProductModal}
          onHide={this.handleAddProductModal}
          editMode={this.state.editMode}
        />
      </header>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    pos_session_id: state.pos_session_id,
    user: state.userReducer
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps)(Header);
