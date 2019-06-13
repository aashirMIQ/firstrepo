import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import {
  createCustomer,
  updateCustomer,
  emptyCart,
  setPaymentMethod,
  submitOrder,
  createPayment
} from "../../oscar-pos-core/actions";
import { uuid } from "../../oscar-pos-core/constants";
import validator from "validator";
import { CustomerSchema } from "../../db/Schema";
import "./UdhaarModal.css";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import {
  formatted_date,
  formatNum,
  getTotal
} from "../../oscar-pos-core/constants";
import JournalDB from "../../db/journals";
// import { getItem, getTotal } from "../../constants";
let patt = /03[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}/; // VALIDATION FOR PAKISTANI MOBILE NUMBER
const styles = {
  row: {
    display: "flex",
    width: "100%"
    // flexDirection: 'colomn'
  },
  inputWrapper: {
    padding: "0 11px"
  },
  btn: {
    width: "100%"
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
class UdhaarModal extends Component {
  constructor(props) {
    super(props);
    let customer = this.props.customer;
    this.state = {};
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

  async addOrder() {
    let journal = {},
      partner_id = this.props.setCustomerForOrder
        ? this.props.setCustomerForOrder.id
        : "";
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
          (this.props.location &&
            this.props.location.state &&
            this.props.location.state.to_invoice) ||
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
                udhaarAmount: this.state.charge,
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
    this.props.onHide();
  };

  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <div
            style={{
              height: "85vh"
            }}
          >
            <Modal.Header style={styles.modalHeader}>
            <div style={{ ...styles.headerItem, border: "0px" }} />
            <div style={{ ...styles.headerItem, border: "0px" }}>
              Udhaar
            </div>
            <div onClick={this.props.onHide} style={{ ...styles.headerItem, borderBottom: "0px" }} className="close-btn">
              <img
                width="28px"
                src={require("../../assets/images/newicons/Close.svg")}
              />
            </div>
          </Modal.Header>
            {/* <Modal.Header closeButton>
              <Modal.Title
                style={{
                  width: "80%",
                  textAlign: "right",
                  paddingRight: "3em"
                }}
              >
                Udhaar
              </Modal.Title>
            </Modal.Header> */}
            <Modal.Body
              style={{
                padding: "0px",
                padding: "0px",
                height: "75vh",
                display: "grid",
                gridTemplateRows: "repeat(2, 1fr)",
                gridTemplateColumns: "1fr"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#aeaeae",
                  padding: "0 3em",
                  fontSize: "24px",
                  textAlign: "center",
                  fontWeight:'100 !important',
                }}
              >
                How would you like<br/> to go with?
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "-40px",
                }}
              >
                <div
                  onClick={() => this.props.onHide(true)}
                  className="udharBtnTextmain"
                  // style={{
                  //   display: "grid",
                  //   gridTemplateColumns: "1fr 2fr",
                  //   width: "20em",
                  //   height: "4em",
                  //   alignItems: "center",
                  //   border: "1px solid",
                  //   marginBottom: "1em",
                  //   cursor: "pointer"
                  // }}
                >
                  <div
                  
                    style={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center"
                    }}
                  >
                    <img
                      width="35px"
                      src={require("../../assets/images/newicons/cash_icon_white.svg")}
                    />
                  </div>
                  <div
                    className="udharBtnText"
                  >
                    AADHA UDHAAR
                    </div>
                </div>
                <div
                  onClick={this.giveUdhaar}
                  className="pooraudharBtnTextmain"
                  // style={{
                  //   display: "grid",
                  //   gridTemplateColumns: "1fr 2fr",
                  //   width: "20em",
                  //   height: "4em",
                  //   alignItems: "center",
                  //   border: "1px solid",
                  //   cursor: "pointer"
                  // }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center"
                    }}
                  >
                    <img
                      width="35px"
                      src={require("../../assets/images/newicons/udhaar_icon_white.svg")}
                    />
                  </div>
                  <div className="pooraUdharBtn">POORA UDHAAR</div>
                </div>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    user: state.userReducer,
    setCustomerForOrder: state.setCustomerForOrder,
    creditHistory: state.creditHistory,
    products: state.products,
    cart: state.cart,
    pos_session_id: state.pos_session_id
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps)(UdhaarModal);
