import React, { Component } from "react";
import styles from "./styles";
import {
  USER,
  PRODUCT,
  SESSION,
  CUSTOMER
} from "../../oscar-pos-core/actions/types";
import { openPosSession } from "../../oscar-pos-core/actions";
import { connect } from "react-redux";
import "./MainScreen.css";
import {
  submitOrder,
  createCustomer,
  createPayment
} from "../../oscar-pos-core/actions";
import { uuid } from "../../oscar-pos-core/constants";
class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.timeRef = {};
  }
  componentDidMount() {
    localStorage.setItem("open_item_id", JSON.stringify(89835));
    this.props.dispatch({
      type: SESSION.SET_POS_SESSION_ID,
      data: this.props.pos_session_id
    });
    console.log('user props " ', this.props.user);
    // if (this.props.user === null) {
    //   if ("user" in localStorage) {
    //     console.log("from home user in localstorage");
    //     let user = JSON.parse(localStorage.getItem("user"));
    //     if (user) {
    //       console.log("user: ", user);
    //       this.props.dispatch({
    //         type: USER.GET_USER,
    //         data: user
    //       });
    //     }
    //   }
    // }
    // for (var i = 0; i < 2000; i++) {
    //   this.props.dispatch(submitOrder(null, null, 500, 500,
    //     this.props.pos_session_id, null, 89835, false, this.props.user.id))
    // }

    // for (var i = 0; i < 800; i++) {
    //   let key = uuid();
    //   let data = {
    //     _id: key,
    //     id: key,
    //     user_id: this.props.user.id,
    //     name: 'shehzad',
    //     phone: '03122933209',
    //     email: '',
    //     address: '',
    //     total_outstanding_payment: 0,
    //     loyalty_points: 0,

    //   };
    //   this.props.dispatch(createCustomer(null, data)).then(data => {
    //     console.log("data:: ", data);
    //   })
    // }

    let data1 = {
      id: "0002a46e-2e78-4863-893e-3774c39dece8",
      amount: 100,
      session_id: this.props.user.id,
      payment_mode: "Udhaar"
    };
    let i = 0;
    // this.timeRef = setInterval(() => {
    //   if (i < 1200) {
    //     this.props.dispatch(createPayment(null, data1)).then(res => {
    //       i++;
    //     })
    //   }
    // }, 300);
  }
  componentWillUnmount() {
    // clearInterval(this.timeRef)
  }
  render() {
    return (
      <div style={styles.mainContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <img
            src={require("../../assets/images/LOGO.svg")}
            style={styles.oscarImg}
          />
        </div>

        <div style={styles.rowMain}>
          <div
            style={styles.boxMain}
            onClick={() => this.props.history.push("/home")}
          >
            <div style={styles.boxInner} className="boxInner">
              <img
                src={require("../../assets/images/Sales.svg")}
                style={styles.boxIcon}
              />
            </div>
            <span style={styles.text}>Sales</span>
          </div>

          <div style={styles.boxMain}>
            <div
              className="boxInner"
              style={styles.boxInner}
              onClick={() => this.props.history.push("/giveUdhaar")}
            >
              <img
                src={require("../../assets/images/icons/udhar.svg")}
                // style={styles.boxIcon}
                width="55px"
              />
            </div>
            <span style={styles.text}>Udhaar</span>
          </div>

          <div style={styles.boxMain}>
            <div
              style={styles.boxInner}
              className="boxInner"
              onClick={() => this.props.history.push("/itemScreen")}
            >
              <img
                src={require("../../assets/images/Item.svg")}
                style={styles.boxIcon}
              />
            </div>
            <span style={styles.text}>Items</span>
          </div>
        </div>

        <div style={{ ...styles.rowMain, marginBottom: "3em" }}>
          <div style={styles.boxMain}>
            <div
              style={styles.boxInner}
              className="boxInner"
              onClick={() => this.props.history.push("/InventoryScreen")}
            >
              <img
                src={require("../../assets/images/Inventory.svg")}
                // style={styles.boxIcon}
                width="41px"
              />
            </div>
            <span style={styles.text}>Inventory</span>
          </div>

          <div
            style={styles.boxMain}
            onClick={() => this.props.history.push("/customers")}
          >
            <div style={styles.boxInner} className="boxInner">
              <img
                src={require("../../assets/images/Customers-white.svg")}
                // style={styles.boxIcon}
                width="41px"
              />
            </div>
            <span style={styles.text}>Customer</span>
          </div>

          <div style={styles.boxMain}>
            <div
              style={styles.boxInner}
              className="boxInner"
              onClick={() => this.props.history.push("/analytics")}
            >
              <img
                src={require("../../assets/images/Reports.svg")}
                // style={styles.boxIcon}
                width="41px"
              />
            </div>
            <span style={styles.text}>Reports</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    pos_session_id: state.pos_session_id,
    user: state.userReducer
  };
})(MainScreen);
