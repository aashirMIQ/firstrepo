import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import { connect } from "react-redux";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import { getCreditHistory, createPayment } from "../../oscar-pos-core/actions";
import Divider from "@material-ui/core/Divider";
import CreateCustomerModal from "../../Components/CreateCustomerModal/CreateCustomerModal";
import TakeCashModal from "../../Components/TakeCashModal/TakeCashModal";
import { formatted_date, formatNum } from "../../oscar-pos-core/constants";
import "./CustomerInfoScreen.css";

class CustomerInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      totalOutstandingPayment: 0,
      showTakeCashModal: false
    };
  }

  removeCustomerFromOrder = () => {
    this.props.history.goBack();
    setTimeout(() => {
      this.props.dispatch({
        type: CUSTOMER.RESET_CUSTOMER_FOR_ORDER
      });
    });
  };

  componentDidMount() {
    if (this.props.setCustomerForOrder) {
      this.props
        .dispatch(getCreditHistory(null, this.props.setCustomerForOrder.id))
        .then(data => {
          this.getTotalOutstandingPayment();
        })
        .catch(error => {
          console.log(
            "error getCreditHistory from customer info screen: ",
            error
          );
        });
    }
  }
  onHide = () => {
    this.setState({ show: !this.state.show });
  };

  getTotalOutstandingPayment = () => {
    let { creditHistory } = this.props,
      totalUdhaar = 0,
      totalJama = 0;
    for (let i = 0; i < creditHistory.length; i++) {
      if (creditHistory[i].payment_mode == "Udhaar") {
        totalUdhaar += creditHistory[i].amount;
      }
      if (creditHistory[i].payment_mode == "Jama") {
        totalJama += creditHistory[i].amount;
      }
    }
    this.setState({
      totalOutstandingPayment: Math.abs(totalUdhaar - totalJama)
    });
  };

  takeCash = amount => {
    console.log("amount: ", amount);
    let partner_id = this.props.setCustomerForOrder
      ? this.props.setCustomerForOrder.id
      : "";
    let params = {
      id: partner_id,
      amount: parseInt(amount),
      session_id: this.props.user.id,
      payment_mode: "Jama"
    };
    this.props.dispatch(createPayment(null, params)).then(data => {
      console.log("create payment response in udhaar screen: ", data);
      this.props.dispatch({
        type: CUSTOMER.SET_CUSTOMER_FOR_ORDER,
        payload: data
      });
      this.props
        .dispatch(getCreditHistory(null, this.props.setCustomerForOrder.id))
        .then(data => {
          this.getTotalOutstandingPayment();
          this.handleTakeCashModal();
        })
        .catch(error => {
          console.log(
            "error getCreditHistory from customer info screen: ",
            error
          );
        });
    });
  };

  handleTakeCashModal = () => {
    this.setState({ showTakeCashModal: !this.state.showTakeCashModal });
  };

  render() {
    return (
      <main>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "0.1fr 0.9fr",
            height: "100vh",
            gridTemplateColumns: "1fr"
          }}
        >
          <header
            style={{
              display: "grid",
              gridTemplateColumns: "0.1fr 0.8fr 0.1fr",
              background: "#662d94"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={() => this.props.history.goBack()}
            >
              <img
                className="back-arrow"
                width="30px"
                src={require("../../assets/images/left-arrow.svg")}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              Customer Details
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={this.onHide}
            >
              <img
                width="30px"
                src={require("../../assets/images/edit-white.svg")}
              />
            </div>
          </header>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: " space-around"
              }}
            >
              <div>Details</div>
              <div>
                <div>Personal Information</div>
                <Divider />
              </div>
              <div>
                <div>Name</div>
                <div>
                  {this.props.setCustomerForOrder &&
                    this.props.setCustomerForOrder.name}
                </div>
              </div>
              <div>
                <div>Phone Number</div>
                <div>
                  {this.props.setCustomerForOrder &&
                    this.props.setCustomerForOrder.phone}
                </div>
              </div>
              <div>
                <div>Additional Information</div>
                <Divider />
              </div>
              <div>
                <div>Email</div>
                <div>
                  {this.props.setCustomerForOrder &&
                    this.props.setCustomerForOrder.email}
                </div>
              </div>
              <div>
                <div>Address</div>
                <div>
                  {this.props.setCustomerForOrder &&
                    this.props.setCustomerForOrder.address}
                </div>
              </div>
              <div>
                <button onClick={this.removeCustomerFromOrder}>
                  Remove Customer to sale
                </button>
              </div>
            </div>
            <div>
              <div>History</div>
              <div>
                <div>
                  <div>Udhaar Amount</div>
                  <div>{formatNum(this.state.totalOutstandingPayment)}</div>
                </div>
                <div>
                  <button onClick={this.handleTakeCashModal}>PayNow</button>
                </div>
              </div>
              {this.props.creditHistory.length ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)"
                  }}
                >
                  <div>Date</div>
                  <div>Udhaar</div>
                  <div>Jama</div>
                </div>
              ) : (
                <div />
              )}
              {this.props.creditHistory.map((data, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)"
                    }}
                  >
                    <data>{formatted_date(data.date)}</data>
                    <data>
                      {(data.payment_mode === "Udhaar" && data.amount) || "-"}
                    </data>
                    <data>
                      {(data.payment_mode === "Jama" && data.amount) || "-"}
                    </data>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
        <CreateCustomerModal
          editMode={true}
          show={this.state.show}
          onHide={this.onHide}
          customer={this.props.setCustomerForOrder}
          resetShow={this.onHide}
          fromCustomerInfoScreen={true}
        />
        <TakeCashModal
          show={this.state.showTakeCashModal}
          onHide={this.handleTakeCashModal}
          amount={this.state.totalOutstandingPayment}
          takeCash={amount => this.takeCash(amount)}
        />
      </main>
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
    setCustomerForOrder: state.setCustomerForOrder,
    creditHistory: state.creditHistory,
    user: state.userReducer
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
  };
})(CustomerInfoScreen);
