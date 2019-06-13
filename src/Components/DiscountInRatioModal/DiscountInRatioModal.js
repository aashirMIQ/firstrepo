import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "./DiscountInRatioModal.css";
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

let DiscountInRatioModal = props => {
  console.log("from DiscountInRatioModal: ", props.show);
  return (
    <Modal show={props.show} onHide={props.onHide}>
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
            className="discount-btn"
            style={{ ...styles.headerItem, borderBottom: "0px" }}
            className="close-btn"
            onClick={props.onHide}
          >
            <img
              width="28px"
              src={require("../../assets/images/newicons/Close.svg")}
            />
          </div>
        </Modal.Header>
        <Modal.Body
          style={{
            height: "80%"
          }}
        >
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
                  height: '4em',
                  margin: "1em 0px",
                  background: "#958cdc",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.5em 0em",
                  cursor: "pointer",
                  borderRadius: '5px'
                }}
                onClick={() => props.addDiscountTen(10)}
              >
                <div>New Customer Promo 10.00%</div>
                {/* <div></div> */}
              </div>
            </div>
            <div>
              <div
                className="discount-btn"
                style={{
                  width: "21em",
                  height: '4em',
                  margin: "1em 0px",
                  background: "#958cdc",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.5em 0em",
                  cursor: "pointer",
                  borderRadius: '5px'
                }}
                onClick={() => props.addDiscountQuater(25)}
              >
                <div>New Customer Promo 25.00%</div>
                {/* <div></div> */}
              </div>
            </div>
            <div>
              <div
                className="discount-btn"
                style={{
                  width: "21em",
                  height: '4em',
                  margin: "1em 0px",
                  background: "#958cdc",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.5em 0em",
                  cursor: "pointer",
                  borderRadius: '5px'
                }}
                onClick={() => props.addDiscountHalf(50)}
              >
                <div>New Customer Promo 50.00%</div>
                {/* <div></div> */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default DiscountInRatioModal;
