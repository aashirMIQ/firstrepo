import React, { Component } from "react";
import { connect } from "react-redux";
import {
  customerSearchingQuery,
  deleteCustomer
} from "../../oscar-pos-core/actions";
import { Button, Modal, Dropdown, DropdownButton } from "react-bootstrap";
import { formatNum, uuid } from "../../oscar-pos-core/constants";
import "./TakeCashModal.css";

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
class TakeCashModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moneyInOrMoneyOut: "moneyin",
      amount: 0,
      reason: "",
      disableBtn: false
    };
  }

  setReason = reason => {
    this.setState({ reason });
  };
  addAmount = num => {
    console.log("number is updating::: ", num);
    let { amount } = this.state;
    switch (num) {
      case "C":
        amount = 0;
        this.setState({ amount: Number(amount) });
        break;
      default: {
        if (amount == "0") {
          amount = "";
          this.setState({ amount });
        }
        amount += num;
        console.log(
          "amount:::, this.props.amount:: ",
          amount,
          this.props.amount
        );
        // if (amount >= this.props.amount) {
        //   this.setState({ disableBtn: true });
        //   return;
        // }
        if (amount <= this.props.amount) {
          this.setState({ amount: Number(amount), disableBtn: false });
        }
      }
    }
    // this.setState({ amount: Number(amount), disableBtn: false });
  };

  render() {
    console.log("this.props:: ", this.props);
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <div
          style={{
            height: "85vh"
          }}
        >
          <Modal.Header style={styles.modalHeader}>
            <div style={{ ...styles.headerItem, border: "0px" }} />
            <div style={{ ...styles.headerItem, border: "0px" }}>TAKE CASH</div>
            <div
              style={{
                ...styles.headerItem,
                borderBottom: "0px"
              }}
              className="close-btn"
              onClick={this.props.onHide}
            >
              <img
                width="28px"
                src={require("../../assets/images/newicons/Close.svg")}
              />
            </div>
          </Modal.Header>
          <Modal.Body style={{ height: "89.5%", padding: "0" }}>
            <div
              style={{
                height: "100%",
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "2fr 4fr 1fr"
              }}
            >
              <div style={{ ...styles.center, flexDirection: "column" }}>
                <div style={{ color: "#ecf0f1", fontSize: "25px" }}>
                  Enter Cash Amount
                </div>
                <div
                  style={{
                    color: this.state.amount > 0 ? "#2c3e50" : "#ecf0f1",
                    fontSize: "27px",
                    fontWeight: "bold"
                  }}
                >
                  RS {formatNum(this.state.amount)}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gridTemplateRows: "1fr 1fr 1fr 1fr",
                  background: "#fafbfb"
                }}
              >
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("1")}
                  >
                    1
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("2")}
                  >
                    2
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("3")}
                  >
                    3
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("4")}
                  >
                    4
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("5")}
                  >
                    5
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("6")}
                  >
                    6
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("7")}
                  >
                    7
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("8")}
                  >
                    8
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("9")}
                  >
                    9
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("C")}
                  >
                    C
                  </Button>
                </div>
                <div>
                  <Button
                    style={styles.calBtn1}
                    onClick={() => this.addAmount("0")}
                  >
                    0
                  </Button>
                </div>
                <div>
                  <Button style={styles.calBtn1}>.</Button>
                </div>
              </div>
              <div
                //   onClick={()=>this.props.addCloseBalance(this.state.amount)}
                // disabled={this.state.amount > 0 ? false : true}
                onClick={() => {
                  if (this.state.amount) {
                    this.props.takeCash(this.state.amount);
                    setTimeout(() => {
                      this.setState({ amount: 0 });
                    });
                  }
                }}
                style={{
                  ...styles.center,
                  cursor: "pointer",
                  backgroundColor: this.state.amount > 0 ? "#d7df23" : "#fff",
                  color: this.state.amount > 0 ? "#fff" : "#ecf0f1",
                  fontSize: "27px",
                  fontWeight: "bold"
                }}
              >
                Done
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  }
}
let mapStateToProps = state => {
  return {
    // searchedCustomers: state.searchedCustomers
  };
};

export default connect(mapStateToProps)(TakeCashModal);
