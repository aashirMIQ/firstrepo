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
import TakeCashModal from "../../Components/TakeCashModal/TakeCashModal";
import {
  emptyCart,
  setPaymentMethod,
  getCustomers,
  getCreditHistoryOfSearchedCustomer,
  createPayment,
  getCustomerByPhoneOrName
} from "../../oscar-pos-core/actions";
import "./CreditHistory.css";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};
class CreditHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: 0,
      searchingText: "",
      showTakeCashModal: false,
      customerObj: {}
    };
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload);
    this.props
      .dispatch(getCustomers(null, this.props.user.id))
      .then(data => {
        console.log("customers get from database: ", data);
      })
      .catch(error => {
        console.log("error customer get from database: ", error);
      });
  }

  onChange = e => {
    this.setState({ searchingText: e.target.value });
    if(e.target.value.length == 0){
      this.props.dispatch({
        type:CUSTOMER.CLEAR_SEARCHED_CUSTOMER
      })
    }
  };

  searchCustomer = e => {
    console.log("when enter key is pressed: ", e.key);
    if (e.key === "Enter" && this.state.searchingText.length > 2) {
      this.props.dispatch(
        getCustomerByPhoneOrName(
          null,
          this.state.searchingText,
          this.props.user.id
        )
      );
    }
  };

  handleTakeCashModal = () => {
    this.setState({ showTakeCashModal: !this.state.showTakeCashModal });
  };

  openTakeCashModal = customer => {
    this.setState({ customerObj: customer }, () => {
      this.handleTakeCashModal();
    });
  };
  onUnload = event => {
    // the method that will be used for both add and remove event
    console.log("hellooww");
    this.props.history.replace("/pinCodeScreen");
    event.returnValue = "Hellooww";
  };

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload);
  }

  takeCash = amount => {
    let customer = this.state.customerObj;
    console.log("amount: ", amount);
    let partner_id = customer ? customer.id : "";
    let params = {
      id: partner_id,
      amount: parseInt(amount),
      session_id: this.props.user.id,
      payment_mode: "Jama"
    };
    this.props.dispatch(createPayment(null, params)).then(data => {
      console.log("create payment response in udhaar screen: ", data);
      this.handleTakeCashModal();
    });
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
            gridTemplateColumns: "1fr 4.5fr 4.5fr",
            background: "#662d94",
            height: "10vh"
          }}
        >
          <div
            style={{ ...styles.center, cursor: "pointer" }}
            className="back-arrow"
          >
            <img
              onClick={() => this.props.history.goBack()}
              width="40px"
              src={require("../../assets/images/icons/back-icon.svg")}
            />
          </div>
          <div
            style={{
              color: "#fff",
              ...styles.center,
              paddingRight: "10%",
              borderRight: "1px solid #76429f"
            }}
          >
           CREDIT HISTORY
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 9fr",
              borderLeft: "1px solid #76429f"
            }}
          >
            <div style={{ ...styles.center }}>
              <img
                onClick={() => this.props.history.goBack()}
                width="20px"
                src={require("../../assets/images/newicons/Search.svg")}
              />
            </div>
            <input
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "16px",
                color: "#fff"
              }}
              placeholder="Search By name of phone #"
              onChange={this.onChange}
              onKeyPress={this.searchCustomer}
            />
          </div>
        </header>
        <section
          style={{
            display: "grid"
          }}
        >
          {this.props.customer.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr repeat(4, 1fr)",
                // height: "10vh",
                alignContent: "center",
                paddingRight: "2em",
                fontSize: "15px",
                background: "#f8f8f8",
                color: "#414042",
                paddingLeft: "1em",
                height: "10vh"
              }}
            >
              <div>Name</div>
              <div>Email</div>
              <div>Phone#</div>
              <div>Udhaar</div>
              <div>Advance</div>
              <div />
            </div>
          ) : null}
          <div
            style={{
              overflow: "scroll",
              overflowX: "hidden",
              overflowY: "scroll",
              paddingLeft: "1em",
              height: "80vh"
            }}
          >
            {this.props.searchedCustomers.length && this.state.searchingText
              ? this.props.searchedCustomers.slice(0, 10).map((customer, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr repeat(4, 1fr)",
                        height: "10vh",
                        alignContent: "center",
                        marginRight: "1em"
                      }}
                    >
                      <div style={{ color: "#414042", fontWeight: "bold" }}>
                        {customer.name}
                      </div>
                      <div style={{ color: "#27aae1" }}>{customer.email}</div>
                      <div style={{ color: "#a7a9ac" }}>{customer.phone}</div>
                      <div style={{ color: "#e51a32", fontWeight: "bold" }}>
                        -Rs. {customer.total_outstanding_payment}
                      </div>
                      <div>-</div>
                      <div>
                        <div
                          onClick={() => this.openTakeCashModal(customer)}
                          style={{
                            height: "2em",
                            width: "6em",
                            borderRadius: "3px",
                            background: "orange",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            userSelect: "none"
                          }}
                        >
                          Pay Now
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
            {!this.props.searchedCustomers.length &&
              !this.state.searchingText.length &&
              this.props.customer.slice(0, 10).map((customer, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 2fr repeat(4, 1fr)",
                      height: "10vh",
                      alignContent: "center",
                      marginRight: "1em"
                    }}
                  >
                    <div style={{ color: "#414042", fontWeight: "bold" }}>
                      {customer.name}
                    </div>
                    <div style={{ color: "#27aae1" }}>{customer.email}</div>
                    <div style={{ color: "#a7a9ac" }}>{customer.phone}</div>
                    <div style={{ color: "#e51a32", fontWeight: "bold" }}>
                      -Rs. {customer.total_outstanding_payment}
                    </div>
                    <div>-</div>
                    <div>
                      <div
                        onClick={() => this.openTakeCashModal(customer)}
                        style={{
                          height: "2em",
                          width: "6em",
                          borderRadius: "3px",
                          background: "orange",
                          color: "#fff",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          userSelect: "none"
                        }}
                      >
                        Pay Now
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
        <TakeCashModal
          show={this.state.showTakeCashModal}
          onHide={this.handleTakeCashModal}
          amount={this.state.customerObj.total_outstanding_payment}
          takeCash={amount => this.takeCash(amount)}
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
    setCustomerForOrder: state.setCustomerForOrder,
    customer: state.customers,
    user: state.userReducer,
    searchedCustomers: state.searchedCustomers
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
  };
})(CreditHistoryScreen);
