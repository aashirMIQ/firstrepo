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
import MoneyInMoneyOutModal from "../../Components/MoneyInMoneyOutModal/MoneyInMoneyOutModal";
import CloseBalanceModal from "../../Components/CloseBalanceModal/CloseBalanceModal";
import {
  emptyCart,
  setPaymentMethod,
  getSessionSummary,
  close_pos_session,
  submitMoneyIn,
  submitMoneyOut,
  set_closing_balance
} from "../../oscar-pos-core/actions";
import "./CloseSession.css";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};
class CloseSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: 0,
      sessionData: {},
      show: false,
      isMoneyInDisable: false,
      isMoneyOutDisable: false,
      moneyInOrMoneyOut: "",
      showCloseBalanceModal: false,
      sesssionClosingBalance: 0
    };
  }

  componentWillMount() {
    this.props
      .dispatch(getSessionSummary(null, this.props.pos_session_id))
      .then(res => {
        this.setState({ sessoinData: res });
        console.log("session summary geted: ", res);
      })
      .catch(error => {
        console.error("error session summary geted: ", error);
      });
  }

  closeSession = () => {
    this.props
      .dispatch(close_pos_session(null, this.props.pos_session_id, 1))
      .then(data => {
        console.log("now session is closed: ", data);
        localStorage.setItem("pos_session_id", null);
      })
      .catch(error => {
        console.log("error session close: ", error);
      });
  };
  handleMoneyInMoneyOutModel = which => {
    let obj = {
      isMoneyInDisable: which === "moneyin" ? false : true,
      isMoneyOutDisable: which === "moneyout" ? false : true,
      moneyInOrMoneyOut: which
    };
    console.log(obj);
    this.setState(obj, () => {
      this.setState({ show: !this.state.handleMoneyInMoneyOutModel });
    });
  };

  moneyInOrMoneyOut = obj => {
    let { amount, method, reason } = obj;
    let param = {
      id: uuid(),
      user_id: "1",
      pos_session_id: this.props.pos_session_id,
      amount: parseInt(amount),
      reason
    };
    return new Promise((resolve, reject) => {
      if (method === "moneyin") {
        console.log("params: ", param);
        this.props
          .dispatch(submitMoneyIn(null, param))
          .then(data => {
            console.log("add opening balance");
            this.props
              .dispatch(getSessionSummary(null, this.props.pos_session_id))
              .then(res => {
                this.setState({ show: false });
                resolve(data);
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
            console.error("error add openin balance: ", error);
            reject(error);
          });
      } else {
        this.props
          .dispatch(submitMoneyOut(null, param))
          .then(data => {
            console.log("add closing balance");
            this.props
              .dispatch(getSessionSummary(null, this.props.pos_session_id))
              .then(res => {
                this.setState({ show: false });
                resolve(data);
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
            console.error("error add closing balance: ", error);
            reject(error);
          });
      }
    });
  };

  closeSession = () => {
    this.props
      .dispatch(close_pos_session(null, this.props.pos_session_id, 1))
      .then(data => {
        console.log("now session is closed: ", data);
        this.props.dispatch(emptyCart());
        localStorage.setItem("pos_session_id", null);
        this.props.history.replace("/home");
      })
      .catch(error => {
        console.log("error session close: ", error);
      });
  };

  handleCloseBalanceModal = () => {
    this.setState({ showCloseBalanceModal: !this.state.showCloseBalanceModal });
  };

  addCloseBalance = amount => {
    console.log("add close balance amount: ", amount);
    this.props
      .dispatch(set_closing_balance(null, amount, this.props.pos_session_id))
      .then(res => {
        console.log("add close balance amount response: ", res);
        this.setState({
          showCloseBalanceModal: !this.state.showCloseBalanceModal,
          sessionData: res
        });
      })
      .catch(error => {
        console.log("error add close balance amount respose: ", error);
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
            gridTemplateColumns: "1fr 9fr",
            background: "#662d94"
          }}
        >
          <div style={{ ...styles.center, cursor: "pointer" }}>
            <img
              className="back-arrow"
              width="50px"
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
            Register Managment
          </div>
        </header>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "2fr 2fr 5fr 1fr",
            background: "#fff"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <div style={{ fontWeight: "bold", color: "#828381" }}>
              Session ID
            </div>
            <div
              style={{
                background: "#f2f2f2",
                padding: "1em 2em"
              }}
            >
              {this.props.pos_session_id}
            </div>
          </div>
          <div>Text container</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  borderRight: "1px solid #8f9090"
                }}
              >
                <div
                  style={{
                    color: "#8f9090",
                    fontSize: "15pt"
                  }}
                >
                  MoneyIn
                </div>
                <div
                  style={{
                    fontSize: "17pt"
                  }}
                >
                  {this.props.sessionSummary &&
                    this.props.sessionSummary.total_money_in_amount}
                </div>
              </div>
              <div
                style={{
                  padding: "0 4em"
                }}
              >
                <Button
                  style={{
                    border: "1px solid #0060b3",
                    padding: "1em 2em"
                  }}
                  onClick={() => this.handleMoneyInMoneyOutModel("moneyin")}
                >
                  Add MoneyIn Amount
                </Button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  borderRight: "1px solid #8f9090"
                }}
              >
                <div
                  style={{
                    color: "#8f9090",
                    fontSize: "15pt"
                  }}
                >
                  MoneyOut
                </div>
                <div
                  style={{
                    fontSize: "17pt"
                  }}
                >
                  {this.props.sessionSummary &&
                    this.props.sessionSummary.total_money_out_amount}
                </div>
              </div>
              <div
                style={{
                  padding: "0 4em"
                }}
              >
                <Button
                  style={{
                    border: "1px solid #0060b3",
                    padding: "1em 2em"
                  }}
                  onClick={() => this.handleMoneyInMoneyOutModel("moneyout")}
                >
                  Add MoneyOut Amount
                </Button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    color: "#8f9090",
                    fontSize: "15pt"
                  }}
                >
                  Closing Balance
                </div>
                <div
                  style={{
                    fontSize: "17pt"
                  }}
                >
                  {this.props.sessionSummary &&
                    this.props.sessionSummary.cash_register_balance_end_real}
                </div>
              </div>
              <div
                style={{
                  padding: "0 4em"
                }}
              >
                <Button
                  style={{
                    border: "1px solid #0060b3",
                    padding: "1em 2em"
                  }}
                  onClick={this.handleCloseBalanceModal}
                >
                  Add Closing Balance
                </Button>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Button
              style={{
                backgroundColor: "#424242",
                borderColor: "#424242",
                width: "100vw",
                padding: "1em 0",
                borderRadius: "0",
                margin: "0",
                height: "100%"
              }}
              onClick={this.closeSession}
            >
              Close Session
            </Button>
          </div>
        </section>
        <MoneyInMoneyOutModal
          show={this.state.show}
          onHide={this.handleMoneyInMoneyOutModel}
          moneyInOrMoneyOut={data => this.moneyInOrMoneyOut(data)}
          isMoneyInDisable={this.state.isMoneyInDisable}
          isMoneyOutDisable={this.state.isMoneyOutDisable}
          isMoneyInOrMoneyOut={this.state.moneyInOrMoneyOut}
        />
        <CloseBalanceModal
          show={this.state.showCloseBalanceModal}
          onHide={this.handleCloseBalanceModal}
          addCloseBalance={amount => this.addCloseBalance(amount)}
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
    sessionSummary: state.sessionSummary,
    pos_session_id: state.pos_session_id
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
  };
})(CloseSession);
