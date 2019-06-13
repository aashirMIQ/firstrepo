import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import "./addOpenItemView.css";
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

class AddOpenItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let cartLength = Object.keys(this.props.cart).length;
    return (
      <div
        style={{
          display: "grid",
          gridAutoRows: "1fr 3fr"
        }}
      >
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              height: "10vh"
            }}
          >
            <div
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
              <div>
                <img
                  width="35px"
                  style={{
                    width: "23px",
                    marginRight: "7px",
                    marginBottom: "2px"
                  }}
                  src={require("../../assets/images/Loyalty.svg")}
                />
              </div>
              <div>Loyalty</div>
            </div>
            <div
              className="back-btn"
              style={{
                userSelect: cartLength ? "" : "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                borderLeft: "1px solid rgb(240, 242, 241)",
                borderBottom: "1px solid rgb(240, 242, 241)",
                cursor: "pointer",
                color: cartLength ? "#000" : "#dfdfdf"
              }}
              onClick={() =>
                cartLength ? this.props.addGlobleDiscount() : () => {}
              }
            >
              <div>
                <img
                  width="35px"
                  style={{
                    width: "25px",
                    marginRight: "7px",
                    marginBottom: "2px"
                  }}
                  src={
                    cartLength
                      ? require("../../assets/images/icons/Discounts_icon_color.svg")
                      : require("../../assets/images/icons/Discounts_icon_gray.svg")
                  }
                />
              </div>
              <div>Discounts</div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              height: "10vh"
            }}
          >
            <div
              className="back-btn"
              style={{
                userSelect: cartLength ? "" : "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                borderLeft: "1px solid rgb(240, 242, 241)",
                borderBottom: "1px solid rgb(240, 242, 241)",
                cursor: "pointer",
                color: "#000"
              }}
              onClick={() => {
                cartLength;
                // ? this.props.setCustomerForOrder
                //   ? this.props.toggleShowDetails()
                //   : this.props.history.push("/customers")
                // : () => {};

                this.props.setCustomerForOrder
                  ? this.props.toggleShowDetails()
                  : this.props.history.push("/customers");
              }}
            >
              <div>
                <img
                  width="40px"
                  src={require("../../assets/images/icons/person-color.svg")}
                />
              </div>
              <div>
                {this.props.setCustomerForOrder ? (
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
                ) : (
                  "Add Customer"
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "2fr 4fr"
            // padding: "1em"
          }}
        >
          <div
            style={{
              ...styles.center,
              fontSize: "33pt",
              color: this.props.customAmount > 0 ? "#58595b" : "#d1d3d4",
              fontWeight: "bold"
            }}
          >
            Rs.{formatNum(this.props.customAmount) || "0"}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows: "1fr 1fr 1fr 1fr"
              // background: "#fafbfb"
            }}
          >
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("1")}
              >
                1
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("2")}
              >
                2
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("3")}
              >
                3
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("4")}
              >
                4
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("5")}
              >
                5
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("6")}
              >
                6
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("7")}
              >
                7
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("8")}
              >
                8
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("9")}
              >
                9
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("C")}
              >
                C
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={() => this.props.addCustomAmount("0")}
              >
                0
              </Button>
            </div>
            <div>
              <Button
                className="calBtn1"
                style={styles.calBtn1}
                onClick={
                  this.props.pos_session_id
                    ? this.props.addCustomProduct
                    : () => {
                        // this.props.cleanCustomAmount();
                        alert("please open session for proceeding");
                      }
                }
              >
                +
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
    pos_session_id: state.pos_session_id,
    setCustomerForOrder: state.setCustomerForOrder,
    cart: state.cart
  };
})(AddOpenItemView);
