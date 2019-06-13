import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import {
  getProducts,
  checkPosSession,
  getCategories
} from "../../oscar-pos-core/actions"; //start from there
import { connect } from "react-redux";
import { formatNum, uuid, getTotal } from "../../oscar-pos-core/constants";
import ProductDB from "../../db/product";
import CategoryDB from "../../db/categories";
import "./PincodeScreen.css";
import { SESSION, USER } from "../../oscar-pos-core/actions/types";

const styles = {
  calBtn1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: "0",
    borderColor: "transparent",
    background: "transparent",
    fontSize: "27pt"
  }
};

const materialStyles = theme => ({
  multilineColor: {
    color: "red"
  }
});
class PincodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeBox: [
        { fill: false },
        { fill: false },
        { fill: false },
        { fill: false }
      ],
      code: "",
      isLoading: true
    };
  }

  componentWillMount() {
    // let pos_session_id = localStorage.getItem("pos_session_id");
    // pos_session_id = pos_session_id ? JSON.parse(pos_session_id) : null;
    // let pos_session_id = JSON.parse((localStorage.getItem("pos_session_id") && localStorage.getItem("pos_session_id")));
    if ("pos_session_id" in localStorage) {
      console.log("from Pincodescree pos_session_id in localstorage");
      let pos_session_id = JSON.parse(localStorage.getItem("pos_session_id"));
      if (pos_session_id) {
        this.props.dispatch({
          type: SESSION.SET_POS_SESSION_ID,
          data: pos_session_id
        });
        return;
      }
    } else {
      let pos_session_id = uuid();
      localStorage.setItem("pos_session_id", JSON.stringify(pos_session_id));
      this.props.dispatch({
        type: SESSION.SET_POS_SESSION_ID,
        data: pos_session_id
      });
    }
    // this.props.dispatch(checkPosSession()).then(user => {
    //   if (user && user.state == "open") {
    //     localStorage.setItem("pos_session_id", JSON.stringify(user.id));
    //     this.props.dispatch({
    //       type: SESSION.SET_POS_SESSION_ID,
    //       data: user.id
    //     });
    //   }
    // });
  }
  componentDidMount() {
    var t0 = Date.now();
    if (!this.props.products.length) {
      this.props
        .dispatch(getProducts())
        .then(data => {
          var t1 = Date.now();
          console.log("Time consume (Get Products from DB)= ", (t1 - t0) / 1000, " sec")
          if (!this.props.products.length) {
            this.setState({ isLoading: true });
            ProductDB.loadProductsInDB().then(res => {
              this.props.dispatch(getProducts()).then(data => {
                var t1 = Date.now();
                console.log("Time consume (Bulk insertion of products)= ", (t1 - t0) / 1000, " sec")

                this.setState({ isLoading: false });
              });
            });
          } else {
            this.setState({ isLoading: false });
          }
        })
        .catch(error => {
          console.error("error from getting product in PinCodeScreen: ", error);
        });
    }
    if (!this.props.mainCategories.length) {
      this.props.dispatch(getCategories(null)).then(res => {
        console.log("categories from database in category component: ", res);
        if (!res || !res.length) {
          CategoryDB.loadCategoriesInDB().then(res => {
            this.props.dispatch(getCategories(null)).then(data => {
              // this.setState({ showMainCategories: true });
            });
          });
        } else {
          // this.setState({ showMainCategories: true });
        }
      });
    } else {
      if (this.props.mainCategories.length && this.props.products.length) {
        this.setState({ isLoading: false });
      }
    }
    console.log('this.props.user : ', this.props.user)
    if (this.props.user === null) {
      if ("user" in localStorage) {
        console.log("from home user in localstorage");
        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          console.log("user: ", user);
          this.props.dispatch({
            type: USER.GET_USER,
            data: user
          });
        }
      }
    }
  }
  addCode = num => {
    let { code } = this.state;
    switch (num) {
      case "C":
        code = "";
        this.setState({ code });
        break;
      case "x": {
        console.log("code.length: ", code.length, code);
        // this.setState({
        //   code: code.length >= 2 ? code.slice(0, Math.abs(code.length - 1)) : ""
        // });
        if (code.length >= 2) {
          code = code.slice(0, Math.abs(code.length - 1));
        } else {
          code = "";
        }
        this.setState({ code });
        break;
      }
      default: {
        if (code == "0") {
          code = "";
          this.setState({ code });
        }
        if (code.length < 4) {
          code += num;
          this.setState({ code, invalidCode: false });
        }
        if (code.length == 4 && code == "1256") {
          this.setState({ code, invalidCode: false }, () => {
            setTimeout(() => {
              // this.props.history.replace("/home");
              this.props.history.replace("/mainScreen");
            }, 500);
          });
        }
        if (code.length == 4 && code != "1256") {
          this.setState({ code, invalidCode: false }, () => {
            setTimeout(() => {
              this.setState({ invalidCode: true, code: "" });
            }, 500);
          });
          return;
        }
      }
    }
  };
  render() {
    if (this.state.isLoading) {
      return (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            backgroundImage: "linear-gradient(#776cd3 ,#d35ffb)",
            color: "#fff"
          }}
        >
          Please Wait
        </div>
      );
    }
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundImage: "linear-gradient(#776cd3 ,#d35ffb)",
          display: "grid",
          gridTemplateRows: "3.5fr 1fr 0.5fr 5fr",
          gridTemplateColumns: "1fr",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <img src={require("../../assets/images/Oscar_logo-02.svg")} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          {this.state.codeBox.map((data, i) => {
            return (
              <div
                key={i}
                style={{
                  border: "1px solid #fff",
                  height: "20px",
                  width: "20px",
                  borderRadius: "20px",
                  margin: "0 1em",
                  backgroundColor:
                    this.state.code.length >= i + 1 ? "#fff" : "transparent"
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#fff"
          }}
        >
          {this.state.invalidCode ? "Invalid Code" : <div />}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(4, 1fr)",
              width: "380px",
              height: "300px"
            }}
          >
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("1")}>
                1
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("2")}>
                2
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("3")}>
                3
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("4")}>
                4
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("5")}>
                5
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("6")}>
                6
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("7")}>
                7
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("8")}>
                8
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("9")}>
                9
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("C")}>
                C
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("0")}>
                0
              </Button>
            </div>
            <div className="pinscreenButton">
              <Button style={styles.calBtn1} onClick={() => this.addCode("x")}>
                x
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  console.log("reducer state from home.js: ", state);
  return {
    products: state.products,
    cart: state.cart,
    sessions: state.sessions,
    user: state.userReducer,
    mainCategories: state.mainCategories.mainCategories
  };
})(PincodeScreen);
