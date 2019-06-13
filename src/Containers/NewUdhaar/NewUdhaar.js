import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "../../Components/Drawer/Drawer";
import { CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
import { ToastContainer, toast } from "react-toastify";
import {
  emptyCart,
  setEmptyCartFlag,
  set_opening_balance,
  logout,
  createPayment
} from "../../oscar-pos-core/actions";
import "./NewUdhaar.css";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  calBtn1: {
    width: "100%",
    height: "100%",
    borderRadius: "0px",
    border: "1px solid #e7e7ef",
    background: "#fff",
    color: "#58595b",
    fontSize: "20pt"
  }
};
class NewUdhaar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: 0,
      tenderAmount: 0,
      open: false,
      udhaarAmount: 0
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
  addUdhaarAmount = num => {
    let { udhaarAmount } = this.state;
    switch (num) {
      case "x":
        udhaarAmount =
          udhaarAmount > 0
            ? udhaarAmount
                .toString()
                .slice(0, udhaarAmount.toString().length - 1)
            : "";
        udhaarAmount = udhaarAmount.toString().trim() === "" ? 0 : udhaarAmount;
        this.setState({ udhaarAmount });
        break;
      case "C":
        this.setState({ udhaarAmount: 0 }, () => {
          console.log("now udhaar amount updated: ", this.state.udhaarAmount);
        });
        break;
      case "0":
        if (udhaarAmount == 0) {
          return;
        } else {
          if (udhaarAmount.toString().length < 6) {
            udhaarAmount += "0";
            this.setState({ udhaarAmount: Number(udhaarAmount) });
          }
        }
        break;
      default:
        {
          if (udhaarAmount.toString().length < 6) {
            udhaarAmount += num;
          }
        }
        this.setState({ udhaarAmount: Number(udhaarAmount) });
    }
  };

  giveUdhaar = () => {
    if (!this.state.udhaarAmount) {
      toast.warn("Please Enter Udhaar Amount!", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      return;
    }
    if (!this.props.setCustomerForUdhaar) {
      toast.warn("Please select customer !", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      return;
    }
    if (this.state.udhaarAmount && this.props.setCustomerForUdhaar) {
      let params = {
        id: this.props.setCustomerForUdhaar.id,
        amount: parseInt(this.state.udhaarAmount),
        session_id: this.props.user.id,
        payment_mode: "Udhaar"
      };

      this.props.dispatch(createPayment(null, params)).then(data => {
        this.props.history.push({
          pathname: "/udhaarThankyouScreen",
          state: {
            commingFromNewUdhaar: true,
            udhaarAmount: this.state.udhaarAmount
          }
        });
      });
    } else {
      alert("Add Customer and Amount must be greater then 0");
    }
  };

  render() {
    console.log("this.props from udhaar screen: ", this.props);
    console.log(
      "inside render now udhaar amount updated: ",
      this.state.udhaarAmount
    );
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
              color: "#fff",
              paddingRight: "10vw"
            }}
          >
            Udhaar
          </div>
        </header>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            height: "90v"
          }}
        >
          <div>
            <div style={{ height: "10vh", borderBottom: "2px solid #dfdfdf" }}>
              {this.props.setCustomerForUdhaar &&
              !this.props.setCustomerForUdhaar.total_outstanding_payment ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 1em",
                    fontSize: "15px",
                    cursor: "pointer"
                  }}
                >
                  <div>
                    <img
                      width={"50px"}
                      src={require("../../assets/images/icons/person-color.svg")}
                    />
                  </div>
                  <div>
                    <div>{this.props.setCustomerForUdhaar.name}</div>
                    <div
                      style={{
                        color: "#a7a9ac",
                        fontSize: "13px"
                      }}
                    >
                      {this.props.setCustomerForUdhaar.phone}
                    </div>
                  </div>
                </div>
              ) : this.props.setCustomerForUdhaar &&
                this.props.setCustomerForUdhaar.total_outstanding_payment ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      height: "100%",
                      alignItems: "center",
                      padding: "0 1em",
                      fontSize: "15px"
                    }}
                  >
                    <div>
                      <img
                        width={"50px"}
                        src={require("../../assets/images/icons/person-color.svg")}
                      />
                    </div>
                    <div>
                      <div>{this.props.setCustomerForUdhaar.name}</div>
                      <div
                        style={{
                          color: "#a7a9ac",
                          fontSize: "13px"
                        }}
                      >
                        {this.props.setCustomerForUdhaar.phone}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "165px"
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "#a7a9ac" }}>
                      Pending Udhaar
                    </div>
                    <div
                      style={{
                        fontSize: "17px",
                        fontWeight: "bold",
                        color: "#e51a32"
                      }}
                    >
                      Rs.{" "}
                      {formatNum(
                        this.props.setCustomerForUdhaar
                          .total_outstanding_payment
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/customers",
                      state: {
                        commingFromNewUdhaar: true
                      }
                    });
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 1em",
                    fontSize: "16px",
                    height: "100%",
                    cursor: "pointer"
                  }}
                >
                  <div>
                    <img
                      width={"50px"}
                      style={{
                        width: "40px",
                        marginRight: "7px",
                        marginBottom: "0px"
                      }}
                      src={require("../../assets/images/icons/person-color.svg")}
                    />
                  </div>
                  <div>Add Customer</div>
                </div>
              )}
            </div>
            <div
              style={{
                ...styles.center,
                justifyContent: "none",
                flexDirection: "column",
                color: "#a7a9ac",
                height: "80vh"
              }}
            >
              <div
                style={{
                  height: "40vh",
                  display: "grid",
                  alignContent: " end",
                  paddingBottom: "50px"
                }}
              >
                <img
                  src={
                    this.state.udhaarAmount > 0
                      ? require("../../assets/images/newicons/udhaar_icon_Orange.svg")
                      : require("../../assets/images/newicons/udhaar_icon_Gray.svg")
                  }
                  style={{ width: "97px" }}
                />
              </div>
              <div
                style={{
                  color: "#a7a9ac",
                  fontSize: "22px"
                }}
              >
                Enter Udhaar Value
              </div>
              <div
                style={{
                  color: this.state.udhaarAmount > 0 ? "#58595b" : "#d1d3d4",
                  fontSize: "45px",
                  fontWeight: "bold"
                }}
              >
                {formatNum(Number(this.state.udhaarAmount).toFixed(2))}
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "2px solid #DFDFDF" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridTemplateRows: "1fr 1fr 1fr 1fr",
                background: "#fafbfb",
                height: "80vh"
              }}
            >
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("1")}
              >
                1
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("2")}
              >
                2
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("3")}
              >
                3
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("4")}
              >
                4
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("5")}
              >
                5
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("6")}
              >
                6
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("7")}
              >
                7
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("8")}
              >
                8
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("9")}
              >
                9
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("C")}
              >
                C
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("0")}
              >
                0
              </div>
              <div
                className="calBtn1"
                // style={styles.calBtn1}
                style={{ ...styles.calBtn1, ...styles.center }}
                onClick={() => this.addUdhaarAmount("x")}
                // onClick={this.addCustomProduct}
              >
                <img
                  width={"50px"}
                  src={require("../../assets/images/newicons/DelCount.svg")}
                />
              </div>
            </div>
            <div
              onClick={this.giveUdhaar}
              style={{
                ...styles.center,
                fontSize: "23px",
                width: "100%",
                height: "10vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "bold",
                borderLeft: "2px solid #d1d3d4",
                cursor: this.state.udhaarAmount > 0 ? "pointer" : "no-drop",
                color: this.state.udhaarAmount > 0 ? "#fff" : "#d1d3d4",
                background:
                  this.state.udhaarAmount > 0 ? "#d7df23" : "transparent"
              }}
            >
              Give Udhaar
            </div>
          </div>
        </section>
        {/* <section style={{ height: "80vh" }} />
        <footer
          style={{
            height: "10vh",
            display: "grid",
            gridTemplateColumns: "1fr 1fr"
          }}
        /> */}

        <Drawer
          history={this.props.history}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          logout={this.logout}
        />
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
    setCustomerForUdhaar: state.setCustomerForUdhaar
  };
})(NewUdhaar);
