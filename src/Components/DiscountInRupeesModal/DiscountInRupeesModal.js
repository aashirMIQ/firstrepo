import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { formatNum, uuid, getTotal } from "../../oscar-pos-core/constants";
import "./DiscountInRupeesModal.css";
import { connect } from "react-redux";

// import { getItem, getTotal } from "../../constants";
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
    fontSize: "20px",
    borderRadius:"0 .3rem 0 0",
  },
  modalHeader: {
    // border: "1px solid #e6e7e8",
    padding: "0px",
    display: "grid",
    gridTemplateColumns: "0.2fr 0.6fr 0.2fr",
    height: "10vh"
  }
};
class DiscountInRupeesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0
    };
  }

  addDiscount = () => {
    if (this.props.amount && this.props.amount < this.props.charge) {
      // if (this.props.amount && this.props.amount < getTotal(this.props.cart, this.props.products)) {
      this.props.clearAmount();
      this.props.onClick();
    }
  };
  render() {
    console.log("this.props Discount in rs modal : ", this.props)
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <div
          style={{
            height: "85vh"
          }}
        >
          <Modal.Header style={styles.modalHeader}>
          <div style={{...styles.headerItem, border:'0px'}} />
              <div style={{...styles.headerItem, border:'0px'}}>Add Discountss</div>
              <div onClick={this.props.onHide} className="close-btn" style={{...styles.headerItem, borderBottom: '0px',}}>
              <img
                width="35px"
                src={require("../../assets/images/newicons/Close.svg")}
              />
            </div>
          </Modal.Header>
          <Modal.Body style={{ height: "75vh" }}>
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
                <input
                  className="discountPopInput"
                  type="number"
                  style={{
                    padding: "1em 1em",
                    width: "20em",
                    borderRadius: ".3rem",
                    border: "1px solid gray",
                  }}
                  value={this.props.amount}
                  onChange={e => {
                    console.log(e.target.value, 'e.target.value')
                    console.log(e.target.value !== '0','aaaaa')
                    if (e.target.value !== '0' && e.target.value < this.props.charge) {
                      console.log("HELLO")
                      // if (e.target.value < getTotal(this.props.cart, this.props.products)) {
                      this.props.onChange(e);
                    }
                  }}
                />
              </div>
              <div>
                <div
                  className="discount-btn"
                  style={{
                    marginTop: "2em",
                    width: "13em",
                    background: this.props.amount ? "#958cdc" : 'gray',
                    height: "3em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                     borderRadius : "5px",

                  }}
                  onClick={() => this.addDiscount()}
                >
                  Add Discount
                </div>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  }
}

let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    user: state.userReducer,
    setCustomerForOrder: state.setCustomerForOrder,
    creditHistory: state.creditHistory,
    products: state.products,
    cart: state.cart
  };
};

let mapDispatchToProps = dispatch => { };
export default connect(mapStateToProps)(DiscountInRupeesModal);
