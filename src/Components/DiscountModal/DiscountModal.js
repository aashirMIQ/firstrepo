import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { formatNum, uuid } from "../../oscar-pos-core/constants";
import "./DiscountModal.css";
import { getTotal } from "../../constants";
// import { getItem, getTotal } from "../../constants";
import { connect } from "react-redux";

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

class DiscountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discountAmount: "",
      discountType: "rs"
    };
  }

  applyDiscountOnProduct = () => {
    let { discountAmount, discountType } = this.state;
    if (discountType == "%") {
      if (
        getTotal(this.props.cart, this.props.products) -
          (discountAmount * this.props.productForDiscount.price_unit) / 100 >
        0
      ) {
        this.props.applyDiscountOnProduct(discountAmount, discountType);
        setTimeout(() => {
          this.setState({ discountAmount: "" });
        }, 200);
        return;
      } else {
        alert(
          "Can't apply Discount because Bill amount is going to 0 or less than 0"
        );
      }
    } else if (discountType == "rs") {
      if (getTotal(this.props.cart, this.props.products) - discountAmount > 0) {
        this.setState({ discountAmount: "" }, () => {
          this.props.applyDiscountOnProduct(discountAmount, discountType);
        });
      } else {
        alert(
          "Can't apply Discount because Bill amount is going to 0 or less than 0"
        );
      }
    }
  };

  addDiscountAmount = num => {
    let { discountAmount, discountType } = this.state;
    switch (num) {
      case "C":
        discountAmount = "";
        this.setState({ discountAmount });
        break;
      default: {
        console.log("discountAmount : ", discountAmount);
        console.log("num : ", num);

        if (num == 0 && discountAmount == "") {
          discountAmount = "";
          this.setState({ discountAmount });
          return;
        }
        discountAmount += num;
        if (
          discountType == "rs" &&
          discountAmount <= this.props.productForDiscount.price_unit
        ) {
          this.setState({ discountAmount });
          return;
        } else if (discountType == "%" && discountAmount <= 100) {
          this.setState({ discountAmount });
        }
      }
    }
    // this.setState({ discountAmount });
  };

  setDiscountType = type => {
    this.setState({ discountType: type, discountAmount: "" });
  };
  render() {
    console.log("props from discount modal:: ", this.props);
    //to check either to preform action accordingly line discount or globle discount
    if (this.props.isProductDiscount) {
      return (
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <div
            style={{
              height: "85vh"
            }}
          >
            <Modal.Header style={styles.modalHeader}>
              <div style={{ ...styles.headerItem, border: "0px" }} />
              <div style={{ ...styles.headerItem, border: "0px" }}>
                DISCOUNTS
              </div>
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
            <Modal.Body style={{ height: "88%", padding: "0" }}>
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gridTemplateRows: "1fr 2fr 4fr 1fr"
                }}
              >
                <div style={styles.center}>
                  <div
                    onClick={() => this.setDiscountType("rs")}
                    style={{
                      fontSize: "8pt",
                      width: "10em",
                      borderRadius: "5px 0 0 5px",
                      background:
                        this.state.discountType === "rs" ? "#958cdc" : "#fff",
                      color:
                        this.state.discountType === "rs" ? "#fff" : "#300f38",

                      height: "4em",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderWidth: "1px solid #b7b1e8",
                      border:
                        this.state.discountType === "%"
                          ? "1px solid #dfdfdf"
                          : "0"
                    }}
                  >
                    RUPEES
                  </div>
                  <div
                    onClick={() => this.setDiscountType("%")}
                    style={{
                      fontSize: "8pt",
                      width: "10em",
                      borderRadius: "0 5px 5px 0",
                      background:
                        this.state.discountType === "%" ? "#958cdc" : "#fff",
                      color:
                        this.state.discountType === "%" ? "#fff" : "#300f38",
                      height: "4em",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderWidth: "1px solid #b7b1e8",
                      border:
                        this.state.discountType === "rs"
                          ? "1px solid #dfdfdf"
                          : "0"
                    }}
                  >
                    PERCENTAGE
                  </div>
                </div>
                <div
                  style={{
                    ...styles.center,
                    flexDirection: "column",
                    color: "#a7a9ac"
                  }}
                >
                  <div style={{ fontSize: "20px" }}>Enter Discount Value</div>
                  <div
                    style={{
                      color: this.state.discountAmount ? "#300f38" : "#d1d3d4",
                      fontSize: "35px",
                      fontWeight: "bold"
                    }}
                  >
                    {this.state.discountType == "rs" ? "RS" : "%"}{" "}
                    {this.state.discountAmount
                      ? formatNum(this.state.discountAmount)
                      : "0"}
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
                      onClick={() => this.addDiscountAmount("1")}
                    >
                      1
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("2")}
                    >
                      2
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("3")}
                    >
                      3
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("4")}
                    >
                      4
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("5")}
                    >
                      5
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("6")}
                    >
                      6
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("7")}
                    >
                      7
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("8")}
                    >
                      8
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("9")}
                    >
                      9
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("C")}
                    >
                      C
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      onClick={() => this.addDiscountAmount("0")}
                    >
                      0
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={styles.calBtn1}
                      // onClick={this.addCustomProduct}
                    >
                      .
                    </Button>
                  </div>
                </div>
                {/* <div */}
                <Button
                  onClick={this.applyDiscountOnProduct}
                  disabled={!this.state.discountAmount ? true : false}
                  style={{
                    ...styles.center,
                    fontWeight: "bold",
                    color: this.state.discountAmount > 0 ? "#fff" : "#d1d3d4",
                    background:
                      this.state.discountAmount > 0 ? "#d7df23" : "transparent",
                    fontSize: "20px",
                    cursor: "pointer",
                    borderWidth: "0px"
                  }}
                >
                  Apply Discount
                </Button>

                {/* </div> */}
              </div>
            </Modal.Body>
          </div>
        </Modal>
      );
    }
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <div
          style={{
            height: "85vh"
          }}
        >
          <Modal.Header style={styles.modalHeader}>
            <div style={{ ...styles.headerItem, border: "0px" }} />
            <div style={{ ...styles.headerItem, border: "0px" }}>
              Add Discount
            </div>
            <div
              onClick={this.props.onHide}
              style={{ ...styles.headerItem, borderBottom: "0px" }}
              className="close-btn"
            >
              <img
                width="28px"
                src={require("../../assets/images/newicons/Close.svg")}
              />
            </div>
          </Modal.Header>
          <Modal.Body style={{ height: "80%" }}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div>
                <div
                  className="discount-btn"
                  style={{
                    width: "21em",
                    margin: "1em 0",
                    border: "none",
                    height: "4em",
                    fontSize: "15px",
                    ...styles.center,
                    background: "#958cdc",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                  onClick={() => this.props.handleDiscountRatioModal()}
                >
                  Add discount in %
                </div>
              </div>
              <div>
                <div
                  className="discount-btn"
                  style={{
                    width: "21em",
                    margin: "1em 0",
                    border: "none",
                    height: "4em",
                    fontSize: "15px",
                    ...styles.center,
                    background: "#958cdc",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius: "5px"
                  }}
                  onClick={() => this.props.handleDiscountRSModal()}
                >
                  Add discount in Rs
                </div>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  }
}

export default connect(state => {
  return {
    products: state.products,
    cart: state.cart
  };
})(DiscountModal);
