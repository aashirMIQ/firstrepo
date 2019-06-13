import React, { Component } from "react";
import { connect } from "react-redux";
import {
  customerSearchingQuery,
  deleteCustomer
} from "../../oscar-pos-core/actions";
import { Button, Modal, Dropdown, DropdownButton } from "react-bootstrap";
import { formatNum, uuid } from "../../oscar-pos-core/constants";
import "./OpenBalanceModal.css";

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
  }
};
class OpenBalanceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moneyInOrMoneyOut: "moneyin",
      amount: 0,
      reason: ""
    };
  }

  setReason = reason => {
    this.setState({ reason });
  };
  addAmount = num => {
    let { amount } = this.state;
    switch (num) {
      case "C":
        amount = 0;
        this.setState({ amount });
        break;
      default: {
        if (amount == "0") {
          amount = "";
          this.setState({ amount });
        }
        amount += num;
      }
    }
    this.setState({ amount: Number(amount) });
  };

  render() {
    return (
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <div
            style={{
              height: "85vh"
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Set Opening Balance</Modal.Title>
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
                  <div>Enter Value</div>
                  <div>RS {formatNum(this.state.amount)}</div>
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
                  onClick={()=>this.props.addOpenBalance(this.state.amount)}
                  style={{ ...styles.center, cursor: "pointer", backgroundColor:'#d7df23', color:'#fff' }}
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

export default connect(mapStateToProps)(OpenBalanceModal);
