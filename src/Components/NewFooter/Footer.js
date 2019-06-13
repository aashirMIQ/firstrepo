import React, { Component } from "react";
import { submitOrder } from "../../oscar-pos-core/actions";
import { formatNum, uuid } from "../../oscar-pos-core/constants";
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calculatorSelect: false
    };
  }

  showHomeContent = () => {
    this.props.showHomeContent();
  };

  navigateToBillAmount = () => {
    if (this.props.charge) {
      this.props.history.push("/payment");
    }
  };

  render() {
    return (
      <footer
        style={{
          display: this.props.searchCustomerFlag ? "none" : "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          height: "100%"
        }}
      >
        <div
          onClick={
            !this.props.isPaymentScreen
              ? this.showHomeContent
              : () => alert("already selected")
          }
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:
              this.props.calculatorSelect && !this.props.isCartView
                ? "#662d94"
                : "#f5f5f5",
            cursor: "pointer"
          }}
        >
          <img
            width="55px"
            src={
              this.props.calculatorSelect && !this.props.isCartView
                ? require("../../assets/images/icons/calculator-white.svg")
                : require("../../assets/images/icons/calculator.svg")
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff"
          }}
        >
          {/* if footer component involked in payment screen so render TENDER button */}
          {this.props.isPaymentScreen ? (
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
                onClick={() => this.props.addOrder()}
                // onClick={()=>alert("adsfdasf")}
                disabled={this.props.tenderDisabled}
                style={{
                  color: this.props.change > 0 ? "#fff" : "#d6cfd7",
                  backgroundColor: this.props.change > 0 ? "#d7df23" : "#fff",
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
          ) : (
            <div
              onClick={this.navigateToBillAmount}
              style={{
                fontSize: "15pt",
                color: this.props.charge > 0 ? "#fff" : "#d1d3d4",
                fontWeight: "500",
                background: this.props.charge > 0 ? "#d7df23" : "#fff",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              {this.props.charge > 0 ? (
                <span>Charge RS. {formatNum(this.props.charge)}</span>
              ) : (
                <span>RS. {this.props.charge}</span>
              )}
            </div>
          )}
        </div>
      </footer>
    );
  }
}

export default Footer;
