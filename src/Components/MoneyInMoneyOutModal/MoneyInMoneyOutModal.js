import React, { Component } from "react";
import { connect } from "react-redux";
import {
  customerSearchingQuery,
  deleteCustomer
} from "../../oscar-pos-core/actions";
import { Button, Modal, Dropdown, DropdownButton } from "react-bootstrap";
import { formatNum, uuid } from "../../oscar-pos-core/constants";
import CreateCustomerModal from "../../Components/CreateCustomerModal/CreateCustomerModal";
import "./MoneyInMoneyOutModal.css";

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
class MoneyInMoneyOutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moneyInOrMoneyOut: "moneyin",
      amount: 0,
      reason: ""
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isMoneyInOrMoneyOut && nextProps.isMoneyInOrMoneyOut !== "") {
      console.log(
        "from component will recive props in moneyinandmoneyoutmodal: ",
        nextProps
      );
      this.setState({ moneyInOrMoneyOut: nextProps.isMoneyInOrMoneyOut });
    }
  }
  setMonyInOrMoneyOut = val => {
    this.setState({ moneyInOrMoneyOut: val });
  };
  setReason = reason => {
    this.setState({ reason });
  };
  addAmount = num => {
    let { amount } = this.state;
    switch (num) {
      case "C":
        amount = "";
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
    this.setState({ amount });
  };

  moneyInOrMoneyOut = () => {
    if (!this.state.amount) {
      alert("Amount must be greater then 0");
      return;
    } else if (this.state.reason.trim() === "") {
      alert("Please select reason");
      return;
    } else if (this.state.amount > 0 && this.state.reason.trim() !== "") {
      this.props
        .moneyInOrMoneyOut({
          amount: this.state.amount,
          method: this.state.moneyInOrMoneyOut,
          reason: this.state.reason
        })
        .then(data => {
          this.setState({ amount: 0, reason: "" });
        });
    }
  };
  render() {
    console.log("this.state from moneyinmoneyoutmodal: ", this.state);
    return (
      <main>
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <div
            style={{
              height: "85vh"
            }}
          >
            <Modal.Header style={{ padding: "0px" }}>
              {/* <Modal.Title>Add Discount</Modal.Title> */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "8fr 2fr",
                  width: "100%",
                  height: "100"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  Money Managment
                </div>
                <div
                  style={{
                    textAlign: "right",
                    height: "100%",
                    width: "100%"
                  }}
                >
                  <DropdownButton
                    alignRight
                    title="Reason"
                    id="dropdown-menu-align-right"
                    className="dropdownbutton"
                    style={{
                      height: "100%",
                      width: "100%"
                    }}
                  >
                    <Dropdown.Item
                      onClick={() => this.setReason("For Personal Reasons")}
                      eventKey="1"
                    >
                      For Personal Reasons
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.setReason("For Sending Money to Friends or Family")
                      }
                      eventKey="2"
                    >
                      For Sending Money to Friends or Family
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.setReason("For Shopping")}
                      eventKey="3"
                    >
                      For Shopping
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => this.setReason("Other")}
                      eventKey="4"
                    >
                      Other
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.setReason("Paying For Bills")}
                      eventKey="4"
                    >
                      Paying For Bills
                    </Dropdown.Item>
                  </DropdownButton>;
                </div>
              </div>
            </Modal.Header>
            <Modal.Body style={{ height: "89.5%", padding: "0" }}>
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gridTemplateRows: "1fr 2fr 4fr 1fr"
                }}
              >
                <div style={styles.center}>
                  <Button
                    disabled={this.props.isMoneyInDisable}
                    className="btn"
                    onClick={() => this.setMonyInOrMoneyOut("moneyin")}
                    style={{
                      fontSize: "8pt",
                      width: "10em",
                      border: 0,
                      borderBottomRightRadius: "0",
                      borderTopRightRadius: "0",
                      background:
                        this.state.moneyInOrMoneyOut === "moneyin"
                          ? "#662d94"
                          : "#d1d3d4"
                    }}
                  >
                    MoneyIn
                  </Button>
                  <Button
                    disabled={this.props.isMoneyOutDisable}
                    className="btn"
                    onClick={() => this.setMonyInOrMoneyOut("moneyout")}
                    style={{
                      fontSize: "8pt",
                      width: "10em",
                      border: 0,
                      borderBottomLeftRadius: "0",
                      borderTopLeftRadius: "0",
                      background:
                        this.state.moneyInOrMoneyOut === "moneyout"
                          ? "#662d94"
                          : "#d1d3d4"
                    }}
                  >
                    MoneyOut
                  </Button>
                </div>
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
                  onClick={this.moneyInOrMoneyOut}
                  style={{ ...styles.center, cursor: "pointer" }}
                >
                  Done
                </div>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </main>
    );
  }
}
let mapStateToProps = state => {
  return {
    // searchedCustomers: state.searchedCustomers
  };
};

export default connect(mapStateToProps)(MoneyInMoneyOutModal);
