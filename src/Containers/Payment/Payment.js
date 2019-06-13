import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import { connect } from "react-redux";
import CurrentSale from "../../Components/Cart/CurrentSale";
import CustomerDetailsModal from "../../Components/CustomerDetailsModal/CustomerDetailsModal";
import CreateCustomerModal from "../../Components/CreateCustomerModal/CreateCustomerModal";
import UdhaarModal from "../../Components/UdhaarModal/UdhaarModal";
import {
  onLogin,
  addProduct,
  getProducts,
  submitOrder,
  emptyCart,
  getCreditHistory,
  createPayment,
  addDiscountOnItem,
  addDiscountProduct
} from "../../oscar-pos-core/actions"; //start from there
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import Products from "../../LocalDB/products.json";
import JournalDB from "../../LocalDB/Database/JournalDB";
import Footer from "../../Components/NewFooter/Footer";
import moment from "moment";
import { getTotal } from "../../constants";
import ThankyouScreen from "../ThankyouScreeen/ThankyouScreen";
import DiscountInRupeesModal from "../../Components/DiscountInRupeesModal/DiscountInRupeesModal";
import DiscountInRatioModal from "../../Components/DiscountInRatioModal/DiscountInRatioModal";
import DiscountModal from "../../Components/DiscountModal/DiscountModal";
import "./Payment.css";
import OrdersDB from "../../LocalDB/Database/Order";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
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
    background: "transparent",
    color: "#58595b",
    fontSize: "20pt"
  },
  paymentMethodBtn: {
    width: "100%",
    height: "100%",
    borderRadius: "0",
    background: "rgb(245, 245, 249)",
    color: "rgb(88, 89, 91)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none"
  },
  paymentMethodBtnWrapper: {
    // border: "1px solid",
    // display: "grid",
    // gridTemplateRows: "0.15fr 0.15fr 0.7fr",
    // gridTemplateColumns: "ifr",
    borderLeft: "1px solid rgb(231, 231, 239)"
  }
};

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: 0.0,
      tenderAmount: 0.0,
      change: "0.0",
      tenderDisabled: true,
      isOrderDone: false,
      cartLength: 0,
      showDetails: false,
      editMode: false,
      showUpdateCustomer: false,
      showUdhaarModal: false,
      isUdhaar: false,
      isProductDiscount: false,
      discountModalFlag: false,
      discount_type: "",
      discountRatioModalFlag: false,
      discountRSModalFlag: false,
      discountRs: ""
    };

    this.addOrder = this.addOrder.bind(this);
  }

  componentDidMount() {
    // console.log("this.props.charge:::: ", this.props.charge);
    // let { cart, products } = this.props,
    //   charge = 0;
    // let addedProducts = JSON.parse(localStorage.getItem("addedProducts"));
    // console.log("added products form payment screen: ", addedProducts);
    // if (addedProducts) {
    //   for (let i in addedProducts) {
    //     let { qty, product } = addedProducts[i];
    //     console.log("product: ", addedProducts[i]);
    //     charge += qty * product.list_price;
    //     console.log("charges: ", charge);
    //   }
    // }
    // console.log("this.props.charge: ", this.props.charge)
    // this.setState({ charge: this.props.charge });

    let totalCharge = getTotal(this.props.cart, this.props.products);
    console.log("totalCharge: ", totalCharge);
    this.setState(
      {
        charge: totalCharge
      },
      () => {
        console.log("addedProducts: ", this.state.addedProducts);
      }
    );
    this.calculateCartlength();
  }

  calculateCartlength = () => {
    let { cart } = this.props,
      count = 0;
    for (let i in cart) {
      count += cart[i].qty;
    }
    this.setState({ cartLength: count });
  };

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

  addThis = amount => {
    let { tenderAmount, charge } = this.state,
      change = 0;
    console.log("tenderAmount: ", amount === "1");
    switch (amount) {
      case "00":
        tenderAmount = "0.0";
        tenderAmount = tenderAmount > 0 ? Number(tenderAmount) : 0;
        change = 0.0;
        break;
      case "x":
        tenderAmount =
          tenderAmount > 0
            ? tenderAmount
                .toString()
                .slice(0, tenderAmount.toString().length - 1)
            : "";
        tenderAmount = tenderAmount.toString().trim() === "" ? 0 : tenderAmount;
        change = 0.0;
        break;
      case "5000":
        tenderAmount = Number(tenderAmount);
        tenderAmount += 5000;
        break;
      case "100":
        tenderAmount = Number(tenderAmount);
        tenderAmount += 100;
        break;
      case "500":
        tenderAmount = Number(tenderAmount);
        tenderAmount += 500;
        break;
      case "1000":
        tenderAmount = Number(tenderAmount);
        tenderAmount += 1000;
        break;
      default:
        tenderAmount = String(tenderAmount);
        tenderAmount =
          tenderAmount.indexOf(0) === 0 ? tenderAmount.slice(1) : tenderAmount;
        tenderAmount += amount;
    }
    if (tenderAmount >= charge) {
      change = charge - tenderAmount;
      change =
        change.toString().indexOf("-") !== -1
          ? Number(change.toString().slice(1))
          : change;
      this.setState({ tenderDisabled: false });
    }
    if (tenderAmount <= charge + 6000) this.setState({ tenderAmount, change });
    console.log("tender amount: ", tenderAmount);
  };

  calculateChange = () => {
    let change = 0,
      { charge, tenderAmount } = this.state;
    if (charge && tenderAmount && tenderAmount >= charge) {
      change = charge - tenderAmount;
      change =
        change.toString().indexOf("-") !== -1
          ? Number(change.toString().slice(1))
          : change;
      this.setState({ change, tenderDisabled: false });
    }
  };

  async takeCash(cash) {
    console.log("cash: ", cash);
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
          this.state.isUdhaar || false, //to_invoice
          null //for freemium
        )
      )
      .then(res => {
        this.setState({ isOrderDone: true, isUdhaar: false });
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
            // this.handleTakeCashModal();
            this.props.dispatch(emptyCart());
            this.props.history.push({
              pathname: "/udhaarThankyouScreen",
              state: {
                total: this.state.charge,
                change: this.state.tenderAmount - this.state.charge,
                udhaarAmount: Math.abs(
                  this.state.tenderAmount - this.state.charge
                ),
                charge: this.state.charge,
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

  async addOrder() {
    let partner_id = Math.random() + Date.now(),
      journal = {},
      { charge, tenderAmount } = this.state;
    partner_id = this.props.setCustomerForOrder
      ? this.props.setCustomerForOrder.id
      : "";
    console.log("tenderAmount:: ", tenderAmount);
    console.log("charge:: ", charge);
    if (tenderAmount >= charge) {
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
            Number(this.state.charge).toFixed(2), //total
            this.state.tenderAmount, //pay_amount
            this.props.pos_session_id, //pos_session_id
            partner_id, //partner_id
            undefined, //open_item_id
            false, //to_invoice
            this.props.user.id //for freemium
          )
        )
        .then(data => {
          let info = {
            change: Number(this.state.change).toFixed(2),
            tenderAmount: this.state.tenderAmount
          };
          this.setState({ isOrderDone: true });
          // this.props.dispatch(saveCurrentOrderInfo(info));
          console.log("saved order into database: ", data);
          // this.props.history.push("thankyouScreen");
        })
        .catch(error => {
          console.log("error from save order into database: ", error);
        });
    } else {
      alert("kindly add tender amount");
    }
  }

  //add discount in Rupees modal handler
  handleDiscountRSModal = () => {
    console.log("request for discount ", this.state.discountRSModalFlag);
    this.setState(
      {
        discountRSModalFlag: !this.state.discountRSModalFlag,
        discountModalFlag: false,
        discount_type: "rs",
        discountRs: ""
      },
      () => {
        console.log(
          "this.state after updating discountRSModalFlag: ",
          this.state
        );
      }
    );
  };
  addDiscount = discountAmount => {
    let { isProductDiscount, productForDiscount, discount_type } = this.state;
    let discountProduct = {
      product_tmpl_id: [91303, "Discount"],
      tracking: "none",
      list_price: 1,
      description: false,
      pos_categ_id: false,
      price: 1,
      barcode: "191303",
      item_code: "191303",
      kitchen_code: false,
      uom_id: [1, "Unit(s)"],
      allow_custom_price: false,
      default_code: false,
      product_modifiers: [],
      to_weight: false,
      display_name: "Discount",
      description_sale: false,
      id: 89834,
      _id: 89834,
      taxes_id: []
    };
    let total = this.props.cart[discountProduct.id]
      ? getTotal(this.props.cart, this.props.products) +
        Math.abs(this.props.cart[discountProduct.id].price)
      : getTotal(this.props.cart, this.props.products);

    console.log("totoal before dispatching : ", total);
    let price =
      discount_type === "rs" ? discountAmount : (discountAmount * total) / 100;
    this.props.dispatch(
      addDiscountProduct(discountProduct.id, price - price * 2)
    );
    setTimeout(() => {
      this.populateCart();
      this.handleDiscountRatioModal();
    }, 100);
  };

  //add discount in rupees
  addDiscountInRs = () => {
    let { charge, discountRs, discount_type } = this.state;
    let discountProduct = {
      product_tmpl_id: [91303, "Discount"],
      tracking: "none",
      list_price: 1,
      description: false,
      pos_categ_id: false,
      price: 1,
      barcode: "191303",
      item_code: "191303",
      kitchen_code: false,
      uom_id: [1, "Unit(s)"],
      allow_custom_price: false,
      default_code: false,
      product_modifiers: [],
      to_weight: false,
      display_name: "Discount",
      description_sale: false,
      id: 89834,
      _id: 89834,
      taxes_id: []
    };
    let total = this.props.cart[discountProduct.id]
      ? getTotal(this.props.cart, this.props.products) +
        Math.abs(this.props.cart[discountProduct.id].price)
      : getTotal(this.props.cart, this.props.products);

    console.log("totoal before dispatching : ", total);
    let price =
      discount_type === "rs" ? discountRs : (discountRs * total) / 100;
    this.props.dispatch(
      addDiscountProduct(discountProduct.id, price - price * 2)
    );
    setTimeout(() => {
      this.populateCart();
      this.handleDiscountRSModal();
    }, 100);
  };

  handleDiscountModal = () => {
    console.log("handle discount modal: ", this.state.discountModalFlag);
    this.setState({ discountModalFlag: !this.state.discountModalFlag });
  };
  backArrowClick = () => {
    this.props.history.goBack();
  };
  toggleShowDetails = () => {
    if (this.props.setCustomerForOrder) {
      //get credit history for selected user
      this.props.dispatch(
        getCreditHistory(null, this.props.setCustomerForOrder.id)
      );
    }
    this.setState({ showDetails: !this.state.showDetails });
  };
  editCustomer = customer => {
    this.setState({
      // customerObj: customer,
      showDetails: !this.state.showDetails,
      editMode: true,
      showUpdateCustomer: !this.state.showUpdateCustomer
    });
  };
  toggleshowUdhaarModal = (isUdhaar = false) => {
    this.setState({ showUdhaarModal: !this.state.showUdhaarModal, isUdhaar });
  };

  //add globle discount
  addGlobleDiscount = () => {
    this.setState({ isProductDiscount: false }, () => {
      this.handleDiscountModal();
    });
  };

  //add discount modal handler
  handleDiscountModal = product => {
    let { charge } = this.state;
    if (charge) {
      console.log("handle discount modal: ", this.state.discountModalFlag);
      this.setState({ discountModalFlag: !this.state.discountModalFlag });
    } else {
      alert("your current charges are 0.00");
    }
  };

  //add discount in ratio modal handler
  handleDiscountRatioModal = () => {
    console.log("handle discount ratio modal: ");
    this.setState(
      {
        discountModalFlag: false,
        discountRatioModalFlag: !this.state.discountRatioModalFlag,
        discount_type: "%"
      },
      () => {
        console.log(
          "this.state after updating discountRatioModalFlag: ",
          this.state
        );
      }
    );
  };

  resetisUdhaar = () => {
    this.setState({ isUdhaar: false });
  };
  render() {
    let cartLength = Object.keys(this.props.cart).length;
    console.log("this.state: ", this.state);
    console.log("this.state.tenderFlag: ", this.state.tenderDisabled);
    if (this.state.isOrderDone) {
      return (
        <ThankyouScreen
          history={this.props.history}
          change={this.state.change}
          charge={this.state.charge}
          tenderAmount={this.state.tenderAmount}
        />
      );
    }
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "grid",
          gridTemplateRows: "0.1fr 0.9fr"
        }}
      >
        {/* header start */}
        <header
          style={{
            background: "#662d94",
            display: "grid",
            gridTemplateColumns: "0.1fr 0.9fr"
          }}
        >
          <div
            onClick={this.backArrowClick}
            className="header-wrapper-col-1"
            style={{ borderRight: "2px solid #5e2985" }}
          >
            <div>
              <img
                // className="back-arrow"
                className="menu-img"
                width="25px"
                src={require("../../assets/images/left-arrow.svg")}
              />
            </div>
          </div>

          {/* <div
            onClick={this.backArrowClick}
            className="back-arrow"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img
              width="20px"
              height="30px"
              src={require("../../assets/images/left-arrow.svg")}
            />
          </div> */}
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // background: "#8880b2",
              color: "#fff",
              paddingRight: "10%"
            }}
          >
            Payment
          </div>
        </header>
        {/* header end */}
        <section style={{ height: "100%" }}>
          <div
            className="payment-main"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              height: "100%"
            }}
          >
            <section
              style={{
                ...styles.paymentMethodBtnWrapper,
                borderRight: "2px solid rgb(88, 89, 91)"
              }}
            >
              <div
                style={{
                  height: "20vh",
                  // borderBottom: "2px solid rgb(88, 89, 91)"
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    height: "10vh"
                  }}
                >
                  <div
                    onClick={() => this.props.history.push("/creditHistory")}
                    className="back-btn"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      borderBottom: "1px solid rgb(240, 242, 241)",
                      cursor: "pointer",
                      userSelect: "none",
                      color: "#dfdfdf",
                      borderLeft: "1px solid rgb(240, 242, 241)"
                    }}
                  >
                    <div style={{ marginRight: "0.2em" }}>
                      <img
                        width="35px"
                        style={{
                          width: "23px",
                          marginRight: "7px",
                          marginBottom: "0px"
                        }}
                        src={require("../../assets/images/newicons/OrderHistory.svg")}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "#000"
                      }}
                    >
                      Credit history
                    </div>
                  </div>

                  {/* <div
                className="back-btn"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                  borderBottom: "1px solid rgb(240, 242, 241)",
                  cursor: "pointer",  
                  userSelect: "none",
                  color: "#000",
                  borderLeft: "1px solid rgb(240, 242, 241)"
                }}
                onClick={() => {
                  this.toggleshowCategories();
                  this.trueshowBackArrow();
                }}
              >
                <div>Categories</div>
              </div> */}

                  <div
                    style={{
                      userSelect: cartLength ? "" : "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      borderBottom: "1px solid rgb(240, 242, 241)",
                      cursor: "pointer",
                      userSelect: "none",
                      color: "#dfdfdf",
                      borderLeft: "1px solid rgb(240, 242, 241)"
                    }}
                    // style={{
                    //   userSelect: cartLength ? "" : "none",
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    //   fontSize: "13px",
                    //   borderLeft: "1px solid rgb(240, 242, 241)",
                    //   borderBottom: "1px solid rgb(240, 242, 241)",
                    //   cursor: "pointer",
                    //   color: "#d1d3d4"
                    // }}
                  >
                    <div style={{ marginRight: "0.2em" }}>
                      <img
                        width="35px"
                        style={{
                          width: "23px",
                          marginRight: "7px",
                          marginBottom: "0px",
                          opacity: "0.2"
                        }}
                        src={require("../../assets/images/newicons/Feedback.svg")}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "#dfdfdf"
                      }}
                    >
                      Feedback
                    </div>
                  </div>
                  <div
                    style={{
                      userSelect: cartLength ? "" : "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      borderBottom: "1px solid rgb(240, 242, 241)",
                      cursor: "pointer",
                      userSelect: "none",
                      color: "#dfdfdf",
                      borderLeft: "1px solid rgb(240, 242, 241)"
                    }}
                    // style={{
                    //   userSelect: cartLength ? "" : "none",
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    //   fontSize: "13px",
                    //   borderLeft: "1px solid rgb(240, 242, 241)",
                    //   borderBottom: "1px solid rgb(240, 242, 241)",
                    //   cursor: "pointer",
                    //   color: "#d1d3d4"
                    // }}
                  >
                    <div style={{ marginRight: "0.2em" }}>
                      <img
                        width="35px"
                        style={{
                          width: "23px",
                          marginRight: "7px",
                          marginBottom: "0px",
                          opacity: "0.2"
                        }}
                        src={require("../../assets/images/newicons/Loyalty.svg")}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "#dfdfdf"
                      }}
                    >
                      Loyalty
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    height: "10vh"
                  }}
                >
                  <div
                    onClick={() =>
                      cartLength ? this.addGlobleDiscount() : () => {}
                    }
                    className="back-btn paymentScreenBtn"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      borderBottom: "1px solid rgb(88, 89, 91)",
                      cursor: "pointer",
                      userSelect: "none",
                      color: "#dfdfdf",
                      borderLeft: "1px solid rgb(240, 242, 241)"
                    }}
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    //   fontSize: "13px",
                    //   borderBottom: "1px solid rgb(240, 242, 241)",
                    //   cursor: "pointer",
                    //   userSelect: "none",
                    //   color: "#d1d3d4",
                    //   borderLeft: "1px solid rgb(240, 242, 241)"
                    // }}
                  >
                    <div style={{ marginRight: "0.2em" }}>
                      <img
                        width="35px"
                        style={{
                          width: "23px",
                          marginRight: "7px",
                          marginBottom: "0px"
                        }}
                        src={require("../../assets/images/newicons/Discounts.svg")}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "#000",
                        // color: "#dfdfdf"
                      }}
                    >
                      Discounts
                    </div>
                  </div>
                  <div
                    style={{
                      userSelect: cartLength ? "" : "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      borderBottom: "1px solid rgb(88, 89, 91)",
                      cursor: "pointer",
                      userSelect: "none",
                      color: "#dfdfdf",
                      borderLeft: "1px solid rgb(240, 242, 241)"
                    }}
                    // style={{
                    //   userSelect: cartLength ? "" : "none",
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    //   fontSize: "13px",
                    //   borderLeft: "1px solid rgb(240, 242, 241)",
                    //   borderBottom: "1px solid rgb(240, 242, 241)",
                    //   cursor: "pointer",
                    //   color: "#d1d3d4"
                    // }}
                  >
                    <div style={{ marginRight: "0.2em" }}>
                      <img
                        width="35px"
                        style={{
                          width: "24px",
                          marginRight: "7px",
                          marginBottom: "0px",
                          opacity: "0.2"
                        }}
                        src={require("../../assets/images/newicons/Discounts.svg")}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "#dfdfdf"
                      }}
                    >
                      Tip
                    </div>
                  </div>
                  <div
                    className="back-btn paymentScreenBtn"
                    style={{
                      userSelect: cartLength ? "" : "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      borderBottom: "1px solid rgb(88, 89, 91)",
                      cursor: "pointer",
                      userSelect: "none",
                      color: "#dfdfdf",
                      borderLeft: "1px solid rgb(240, 242, 241)"
                    }}
                    // style={{
                    //   userSelect: cartLength ? "" : "none",
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   alignItems: "center",
                    //   fontSize: "13px",
                    //   borderLeft: "1px solid rgb(240, 242, 241)",
                    //   borderBottom: "1px solid rgb(240, 242, 241)",
                    //   cursor: "pointer",
                    //   color: "#d1d3d4"
                    // }}
                  >
                    <div style={{ marginRight: "0.2em" }}>
                      <img
                        width="35px"
                        style={{
                          width: "24px",
                          marginRight: "7px",
                          marginBottom: "0px",
                          opacity: "0.2"
                        }}
                        src={require("../../assets/images/newicons/Discounts.svg")}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "#000"
                        // color: "#dfdfdf"
                      }}
                    >
                      Print
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ height: "70vh" }}>
                {/* <div
                  style={{
                    ...styles.center,
                    fontSize: "18pt",
                    color: "#00aeef"
                  }}
                >
                  <div>
                    <img
                      src={require("../../assets/images/icons/person-color.svg")}
                    />
                  </div>
                  {(this.props.setCustomerForOrder &&
                    this.props.setCustomerForOrder.name) ||
                    "Add Customer"}
                </div> */}
                <div
                  onClick={() =>
                    this.props.setCustomerForOrder
                      ? this.toggleShowDetails()
                      : this.props.history.push("/customers")
                  }
                  className="back-btn"
                  style={{
                    ...styles.center,
                    fontSize: "18pt",
                    color: "#00aeef",
                    cursor: "pointer",
                    height: "10vh",
                    borderBottom: "1px solid rgb(240, 242, 241)"
                  }}
                >
                  {this.props.setCustomerForOrder &&
                  !this.props.setCustomerForOrder.total_outstanding_payment ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
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
                        <div>{this.props.setCustomerForOrder.name}</div>
                        <div
                          style={{
                            color: "#a7a9ac",
                            fontSize: "13px"
                          }}
                        >
                          {this.props.setCustomerForOrder.phone}
                        </div>
                      </div>
                    </div>
                  ) : this.props.setCustomerForOrder &&
                    this.props.setCustomerForOrder.total_outstanding_payment ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
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
                          <div>{this.props.setCustomerForOrder.name}</div>
                          <div
                            style={{
                              color: "#a7a9ac",
                              fontSize: "13px"
                            }}
                          >
                            {this.props.setCustomerForOrder.phone}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "165px"
                        }}
                      >
                        <div style={{ fontSize: "16px", color: "#a7a9ac" }}>
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
                            this.props.setCustomerForOrder
                              .total_outstanding_payment
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      // style={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      //   fontSize: "16px",
                      //   borderBottom: "1px solid rgb(240, 242, 241)",
                      //   cursor: "pointer",
                      //   userSelect: "none",
                      //   color: "#dfdfdf",
                      //   borderLeft: "1px solid rgb(240, 242, 241)"
                      // }}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0 1em",
                        fontSize: "15px"
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
                      <div
                        style={{
                          ...styles.center,
                          fontSize: "16px",
                          color: "#000",
                          cursor: "pointer"
                        }}
                      >
                        Add Customer
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    height: "30vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      color: "#a7a9ac",
                      fontSize: "22px"
                    }}
                  >
                    Bill Amount
                  </div>
                  <div
                    style={{
                      color: "#58595b",
                      fontSize: "45px",
                      fontWeight: "bold"
                    }}
                  >
                    Rs. {formatNum(Number(this.state.charge).toFixed(2))}
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: "0.3fr 0.3fr 0.3fr",
                    gridTemplateColumns: "1fr",
                    height: "30vh"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "2px solid #e7e7ef",
                      borderTop: "2px solid rgb(231, 231, 239)",
                      padding: "0 3em"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        color: "#a7a9ac"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15pt"
                        }}
                      >
                        Sub-total
                      </div>
                      <div
                        style={{
                          fontSize: "28px"
                        }}
                      >
                        Rs.{formatNum(this.state.charge)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "2px solid #e7e7ef",
                      padding: "0 3em"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        color: "#00aeef"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15pt"
                        }}
                      >
                        Sales Tax
                      </div>
                      <div
                        style={{
                          fontSize: "28px"
                        }}
                      >
                        Rs.{0}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 3em"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        color: "#58595b"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15pt"
                        }}
                      >
                        Total
                      </div>
                      <div
                        style={{
                          fontSize: "28px"
                        }}
                      >
                        Rs.{formatNum(this.state.charge)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              style={
                {
                  // display: "grid",
                  // gridTemplateRows: "0.3fr 0.7fr"
                  // border: "1px solid"
                }
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  height: "10vh"
                }}
              >
                <div
                  onClick={this.resetisUdhaar}
                  className="back-btn"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "16px",
                    borderBottom: "1px solid rgb(240, 242, 241)",
                    cursor: "pointer",
                    userSelect: "none",
                    color: "#80e229",
                    borderLeft: "1px solid rgb(240, 242, 241)",
                    borderTop: !this.state.isUdhaar
                      ? "4px solid #80e229"
                      : "none"
                  }}
                >
                  <div style={{ marginRight: "0.2em" }}>
                    <img
                      width="35px"
                      style={{
                        width: "23px",
                        marginRight: "7px",
                        marginBottom: "0px"
                      }}
                      src={require("../../assets/images/newicons/Cash.svg")}
                    />
                  </div>
                  <div>Cash</div>
                </div>
                <div
                  className="back-btn"
                  style={{
                    userSelect: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "16px",
                    borderLeft: "1px solid rgb(240, 242, 241)",
                    borderBottom: "1px solid rgb(240, 242, 241)",
                    cursor: "pointer",
                    color: "#d1d3d4"
                  }}
                >
                  <div style={{ marginRight: "0.2em" }}>
                    <img
                      width="35px"
                      style={{
                        width: "23px",
                        marginRight: "7px",
                        marginBottom: "0px",
                        opacity: "0.2"
                      }}
                      src={require("../../assets/images/newicons/Card.svg")}
                    />
                  </div>
                  <div>Credit Card</div>
                </div>
                <div
                  onClick={() => {
                    this.props.setCustomerForOrder
                      ? this.toggleshowUdhaarModal()
                      : this.props.history.push('./customers')
                  }}
                  className="back-btn"
                  style={{
                    userSelect: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "16px",
                    borderLeft: "1px solid rgb(240, 242, 241)",
                    borderBottom: "1px solid rgb(240, 242, 241)",
                    cursor: "pointer",
                    color: "#efaa2e",
                    borderTop: this.state.isUdhaar
                      ? "4px solid #efaa2e"
                      : "none"
                  }}
                >
                  <div style={{ marginRight: "0.2em" }}>
                    <img
                      // style={{ opacity: "0.2" }}
                      width="35px"
                      style={{
                        width: "23px",
                        marginRight: "7px",
                        marginBottom: "0px"
                      }}
                      src={require("../../assets/images/newicons/Udhaar.svg")}
                    />
                  </div>
                  <div>Udhaar</div>
                </div>
              </div>
              <div style={{ height: "80vh" }}>
                <div
                  style={{
                    textAlign: "center",
                    // border: "1px solid",
                    textAlign: "center",
                    // border: "1px solid",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: "20vh"
                  }}
                >
                  <div
                    style={{
                      color: "#a7a9ac",
                      fontSize: "22px"
                    }}
                  >
                    Enter {this.state.isUdhaar ? "Aadha Udhaar" : "Bill"} Amount
                  </div>
                  <div
                    style={{
                      color:
                        this.state.tenderAmount > 0 ? "#58595b" : "#d1d3d4",
                      fontSize: "45px",
                      fontWeight: "bold"
                    }}
                  >
                    Rs. {formatNum(Number(this.state.tenderAmount).toFixed(2))}
                  </div>
                </div>
                <div
                  style={{
                    // border: "1px solid",
                    display: "grid",
                    gridTemplateColumns: "0.8fr 0.2fr",
                    // gridColumnGap: "15px",
                    // padding: "7px",
                    height: "50vh"
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gridTemplateRows: "0.25fr 0.25fr 0.25fr 0.25fr"
                    }}
                  >
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("1")}
                      >
                        1
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("2")}
                      >
                        2
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("3")}
                      >
                        3
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("4")}
                      >
                        4
                      </Button>
                    </div>
                    <div>
                      <Button
                        style={styles.calBtn1}
                        onClick={() => this.addThis("5")}
                      >
                        5
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("6")}
                      >
                        6
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("7")}
                      >
                        7
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("8")}
                      >
                        8
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("9")}
                      >
                        9
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("00")}
                      >
                        C
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("0")}
                      >
                        0
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        onClick={() => this.addThis("x")}
                      >
                        <img
                          width={"50px"}
                          src={require("../../assets/images/newicons/DelCount.svg")}
                        />
                      </Button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gridTemplateRows: "0.25fr 0.25fr 0.25fr 0.25fr"
                    }}
                  >
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        // style={{ ...styles.calBtn1 }}
                        onClick={() => this.addThis("100")}
                      >
                        +100
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        // style={{ ...styles.calBtn1 }}
                        onClick={() => this.addThis("500")}
                      >
                        +500
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        // style={{ ...styles.calBtn1 }}
                        onClick={() => this.addThis("1000")}
                      >
                        +1,000
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="calBtn1"
                        style={styles.calBtn1}
                        // style={{ ...styles.calBtn1 }}
                        onClick={() => this.addThis("5000")}
                      >
                        +5,000
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    if (
                      this.state.isUdhaar &&
                      this.state.tenderAmount &&
                      this.state.tenderAmount < this.state.charge
                    ) {
                      this.takeCash(this.state.tenderAmount);
                    }
                    if (
                      !this.state.isUdhaar &&
                      // this.state.tenderAmount &&
                      this.state.tenderAmount >= this.state.charge
                    ) {
                      this.addOrder();
                    }
                  }}
                  style={{
                    height: "10vh",
                    userSelect: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    color:
                      this.state.isUdhaar &&
                      this.state.tenderAmount &&
                      this.state.tenderAmount < this.state.charge
                        ? "#fff"
                        : this.state.tenderAmount >= this.state.charge && !this.state.isUdhaar
                        ? "#fff"
                        : "#d5d8dd",
                    fontSize: "18pt",
                    background:
                      this.state.isUdhaar &&
                      this.state.tenderAmount &&
                      this.state.tenderAmount < this.state.charge
                        ? "#d7df23"
                        : this.state.tenderAmount >= this.state.charge && !this.state.isUdhaar
                        ? "#d7df23"
                        : "#fff"
                  }}
                >
                  Validate
                </div>
              </div>
            </section>
          </div>
        </section>
        <CustomerDetailsModal
          onHide={this.toggleShowDetails}
          customer={this.props.setCustomerForOrder}
          show={this.state.showDetails}
          openUpdateCustomerModal={customer => this.editCustomer(customer)}
          commingFromHome={true}
        />
        <CreateCustomerModal
          show={this.state.showUpdateCustomer}
          onHide={() =>
            this.setState({
              showUpdateCustomer: !this.state.showUpdateCustomer,
              editMode: false
            })
          }
          resetShow={this.resetShow}
          customer={this.props.setCustomerForOrder}
          editMode={true}
          commingFromHome={true}
        />

        {/* *********************** Udhaar Modal ************************* */}

        <UdhaarModal
          show={this.state.showUdhaarModal}
          onHide={isUdhaar => this.toggleshowUdhaarModal(isUdhaar)}
          history={this.props.history}
        />

        {/* *********************** Discount Modal **************************** */}

        <DiscountModal
          applyDiscountOnProduct={(discountAmount, discountType) =>
            this.applyDiscountOnProduct(discountAmount, discountType)
          }
          addGlobleDiscount={this.addGlobleDiscount}
          productForDiscount={this.state.productForDiscount}
          isProductDiscount={this.state.isProductDiscount}
          show={this.state.discountModalFlag}
          onHide={this.handleDiscountModal}
          handleDiscountRatioModal={this.handleDiscountRatioModal}
          handleDiscountRSModal={this.handleDiscountRSModal}
        />

        {/* *********************** Discount In Ratio Modal ************************* */}

        <DiscountInRatioModal
          show={this.state.discountRatioModalFlag}
          onHide={this.handleDiscountRatioModal}
          addDiscountTen={value => this.addDiscount(value)}
          addDiscountQuater={value => this.addDiscount(value)}
          addDiscountHalf={value => this.addDiscount(value)}
        />

        {/* *********************** Discount In Rupees Modal **************************** */}

        <DiscountInRupeesModal
          show={this.state.discountRSModalFlag}
          onHide={this.handleDiscountRSModal}
          onChange={e => {
            console.log("e.target.value: ", );
            console.log("this.state.charge: ", this.state.charge);
            if (e.target.value == 0) {
              this.setState({ discountRs: "" });
            }
            if (e.target.value > 0 && e.target.value.toString().indexOf("-") === -1) {
              this.setState({ discountRs: e.target.value });
            }
          }}
          amount={this.state.discountRs}
          onClick={() => this.addDiscountInRs()}
          charge={this.state.charge}
          clearAmount={() => this.setState({ discountRs: "" })}
        />
        {/* <Footer
          cartLength={this.state.cartLength}
          calculatorSelect={true}
          isPaymentScreen={true}
          addOrder={this.addOrder}
          change={this.state.change}
        /> */}
        {/* <footer className="payment-footer-main">
          <div className="payment-footer-main-col-1">
            <img
              width={"100px"}
              src={require("../../assets/images/dukan-icon.png")}
            />
          </div>
          <div className="payment-footer-main-col-2">
            <div className="payment-footer-main-col-2-1">
              <div>
                <img
                  width="30px"
                  src={require("../../assets/images/person-icon.svg")}
                />
              </div>
              <div>
                Cashier
                <br />
                <span>Zubair</span>
              </div>
            </div>
            <div>
              <img
                width="30px"
                src={require("../../assets/images/stack-icon.svg")}
              />
            </div>
            <div>
              <img
                width="30px"
                src={require("../../assets/images/badge-icon.svg")}
              />
            </div>
            <div>
              <img
                width="30px"
                src={require("../../assets/images/percent-icon.svg")}
              />
            </div>
          </div>
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderLeft: "1px solid rgb(231, 231, 239)",
              borderTop: "1px solid rgb(231, 231, 239)"
            }}
          >
            <button
              onClick={() => this.addOrder()}
              // onClick={()=>alert("adsfdasf")}
              disabled={this.state.tenderDisabled}
              style={{
                color: this.state.change > 0 ? "#fff" : "#d6cfd7",
                backgroundColor: this.state.change > 0 ? "#d7df23" : "#fff",
                fontSize: "25pt",
                fontWeight: "600",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "none"
              }}
            >
              Tender
            </button>
          </div>
        </footer> */}
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from payment.js: ", state);
  return {};
};
let mapDispatchToProps = dispatch => {
  return {};
};
export default connect(state => {
  console.log("reducer state from payment.js: ", state);
  return {
    products: state.products,
    cart: state.cart,
    paymentMethod: state.paymentMethod,
    setCustomerForOrder: state.setCustomerForOrder,
    pos_session_id: state.pos_session_id,
    user: state.userReducer
  };
})(Payment);
