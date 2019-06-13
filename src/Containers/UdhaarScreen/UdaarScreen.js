import React, { Component } from "react";
import { connect } from "react-redux";
import { getTotal } from "../../oscar-pos-core/constants";
import {
  emptyCart,
  setPaymentMethod,
  submitOrder,
  createPayment
} from "../../oscar-pos-core/actions";
import TakeCashModal from "../../Components/TakeCashModal/TakeCashModal";
import JournalDB from "../../db/journals";
import CustomerDB from "../../db/customer";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import "./UdhaarScreen.css";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};
class BillAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: 0,
      tenderAmount: 0
    };
  }

  componentDidMount() {
    this.populateCart();
  }

  populateCart = () => {
    // console.log('cart: ', cart)
    let virtualCart = [];
    let { products, cart } = this.props;
    let totalCharge = getTotal(cart, products);
    this.setState({
      charge: totalCharge,
      showTakeCashModal: false
    });
  };

  newOrder = () => {
    // this.props.dispatch(clearCurrentOrderInfo());
    this.props.dispatch(emptyCart());
    this.props.history.replace("/");
  };

  async addOrder() {
    let journal = {},
      partner_id = this.props.customer ? this.props.customer.id : "";
    console.log("partner_id: ", partner_id);
    try {
      let data = await JournalDB.getJournalsFromDb();
      journal = data[0];
      console.log("get journalData from DB: ", data[0]);
    } catch (err) {
      console.log("error from catch of journalDB: ", err);
    }
    this.props
      .dispatch(
        submitOrder(
          null, //realm replace
          journal, //journalObj
          this.state.charge, //total
          this.state.tenderAmount || 0, //pay_amount
          this.props.pos_session_id, //pos_session_id
          partner_id, //partner_id
          undefined, //open_item_id
          (this.props.location.state && this.props.location.state.to_invoice) ||
            false, //to_invoice
          null //for freemium
        )
      )
      .then(data => {
        let params = {
          id: partner_id,
          amount:
            parseInt(this.state.charge) -
            parseInt(this.state.tenderAmount || 0),
          session_id: this.props.user.id,
          payment_mode: "Udhaar"
        };
        this.props.dispatch(createPayment(null, params)).then(data => {
          console.log("create payment response in udhaar screen: ", data);
          this.props.dispatch({
            type: CUSTOMER.SET_CUSTOMER_FOR_ORDER,
            payload: data
          });
          setTimeout(() => {
            this.setState({ isOrderDone: true });
            console.log("saved order into database: ", data);
            // this.handleTakeCashModal();
            this.props.dispatch(emptyCart());
            this.props.history.push({
              pathname: "/udhaarThankyouScreen",
              state: {
                total: this.state.charge,
                change: this.state.tenderAmount - this.state.charge,
                credit: true,
                cashPaid: this.state.tenderAmount,
                partner_id
              }
            });
          });
        }, 100);
      })
      .catch(error => {
        console.log("error from save order into database: ", error);
      });
  }

  giveUdhaar = () => {
    console.log("give udhaar function");
    this.addOrder();
  };

  handleTakeCashModal = () => {
    this.setState({ showTakeCashModal: !this.state.showTakeCashModal });
  };

  async takeCash(cash) {
    console.log("cash: ", cash);
    let journal = {},
      partner_id = this.props.customer ? this.props.customer.id : "";
    console.log("partner_id: ", partner_id);
    try {
      let data = await JournalDB.getJournalsFromDb();
      journal = data[0];
      console.log("get journalData from DB: ", data[0]);
    } catch (err) {
      console.log("error from catch of journalDB: ", err);
    }
    this.props
      .dispatch(
        submitOrder(
          null, //realm replace
          journal, //journalObj
          this.state.charge, //total
          this.state.tenderAmount || 0, //pay_amount
          this.props.pos_session_id, //pos_session_id
          partner_id, //partner_id
          undefined, //open_item_id
          (this.props.location.state && this.props.location.state.to_invoice) ||
            false, //to_invoice
          null //for freemium
        )
      )
      .then(res => {
        this.setState({ isOrderDone: true });
        console.log("saved order into database: ", res);
        let obj = {
          amount_total: res.amount_total,
          amount_paid: res.amount_paid,
          credit_amount: res.amount_total - res.amount_paid, // because here is no Udhaar that's why credit_amount = 0
          to_invoice: res.to_invoice,
          lines: res.lines.length
        };
        let params = {
          id: partner_id,
          amount:
            parseInt(this.state.charge) -
            parseInt(this.state.tenderAmount || 0),
          session_id: this.props.user.id,
          payment_mode: "Udhaar"
        };
        this.props.dispatch(createPayment(null, params)).then(data => {
          console.log("create payment response in udhaar screen: ", data);
          this.props.dispatch({
            type: CUSTOMER.SET_CUSTOMER_FOR_ORDER,
            payload: data
          });
          setTimeout(() => {
            this.handleTakeCashModal();
            this.props.dispatch(emptyCart());
            this.props.history.push({
              pathname: "/udhaarThankyouScreen",
              state: {
                total: this.state.charge,
                change: this.state.tenderAmount - this.state.charge,
                credit: true,
                cashPaid: this.state.tenderAmount,
                partner_id
              }
            });
          });
        }, 100);
      })
      .catch(error => {
        console.log("error from save order into database: ", error);
      });
  }

  takeCashHandler = cash => {
    this.setState({ tenderAmount: cash }, () => {
      this.takeCash(this.state.tenderAmount);
    });
  };
  render() {
    console.log("this.props from udhaar screen: ", this.props);
    return (
      <div>
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
              gridTemplateColumns: "1fr 9fr",
              background: "#662d94"
            }}
          >
            <div style={{ ...styles, cursor: "pointer" }}>
              <img
                onClick={() => this.props.history.goBack()}
                src={require("../../assets/images/icons/back-icon.svg")}
              />
            </div>
            <div
              style={{
                color: "#fff",
                ...styles.center,
                paddingRight: "10%"
              }}
            >
              Udhaar
            </div>
          </header>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "0.2fr 0.3fr 0.5fr"
            }}
          >
            <div
              style={{
                textAlign: "center",
                paddingTop: "1em"
              }}
            >
              <div
                style={{
                  color: "#718093",
                  fontSize: "15pt"
                }}
              >
                Udhaar Amount For{" "}
                <span style={{ color: "#44bd32" }}>
                  {this.props.customer.name}
                </span>
              </div>
              <div
                style={{
                  color: "#353b48",
                  fontWeight: "bold",
                  fontSize: "30pt"
                }}
              >
                Rs {this.state.charge}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img
                width="80px"
                src={require("../../assets/images/give-udhaar.svg")}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div>Choose your preferred payment option</div>
              <div
                style={{
                  width: "30%"
                }}
              >
                <div
                  onClick={this.giveUdhaar}
                  style={{
                    width: "100%",
                    height: "10vh",
                    display: "flex",
                    alignItems: "center",
                    background: "#f5f6fa",
                    border: "none",
                    color: "#353b48",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      flex: "3",
                      textAlign: "center"
                    }}
                  >
                    <img
                      width="30px"
                      src={require("../../assets/images/give-udhaar.svg")}
                    />
                  </div>
                  <div
                    style={{
                      flex: "6",
                      textAlign: "left"
                    }}
                  >
                    GIVE UDHAAR
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "30%"
                }}
              >
                <div
                  onClick={this.handleTakeCashModal}
                  style={{
                    width: "100%",
                    height: "10vh",
                    display: "flex",
                    alignItems: "center",
                    background: "#f5f6fa",
                    border: "none",
                    color: "#353b48",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      flex: "4",
                      textAlign: "center"
                    }}
                  >
                    <img
                      width="30px"
                      src={require("../../assets/images/give-udhaar.svg")}
                    />
                  </div>
                  <div
                    style={{
                      flex: "7",
                      textAlign: "left"
                    }}
                  >
                    TAKE CASH
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <TakeCashModal
          amount={this.state.charge}
          show={this.state.showTakeCashModal}
          onHide={this.handleTakeCashModal}
          takeCash={cash => this.takeCashHandler(cash)}
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
    customer: state.setCustomerForOrder
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
  };
})(BillAmount);
