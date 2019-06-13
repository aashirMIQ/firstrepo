import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import "./UpdateProductModal.css";
// import { getItem, getTotal } from "../../constants";
let compRef = {};
class UpdateProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: (this.props.product && this.props.product.display_name) || "",
      barcode: "",
      listPrice: "",
      standardPrice: ""
    };
    compRef = this;
  }

  setValueFlag = () => {
    this.props.setValueFlag();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.product && nextProps.show) {
      console.log("product *****************************: ", nextProps.product);
      compRef.setState(
        {
          name: nextProps.product.display_name,
          barcode: nextProps.product.barcode,
          listPrice: nextProps.product.list_price,
          standardPrice: nextProps.product.standard_price
        },
        () => {
          console.log("this.state: ", compRef.state);
        }
      );
      // compRef.setValueFlag();
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  updateProduct = () =>{
    let {name, barcode, listPrice, standardPrice} = this.state;
    if(name.trim() !== "" && barcode.trim() != "" && listPrice.trim()   && !standardPrice.trim()){
      console.log('formated data')
    }else{
      console.log("data is badly formated")
    }
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <div
          style={{
            height: "85vh"
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  width: "100%"
                }}
              >
                <TextField
                  style={{ width: "100%" }}
                  id="standard-name"
                  label="Name"
                  value={this.state.name}
                  onChange={this.handleChange("name")}
                  margin="normal"
                />
              </div>
              <div
                style={{
                  width: "100%"
                }}
              >
                <TextField
                  style={{ width: "100%" }}
                  id="standard-name"
                  label="Barcode"
                  value={this.state.barcode}
                  onChange={this.handleChange("barcode")}
                  margin="normal"
                />
              </div>
              <div style={{ width: "100%" }}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-name"
                  label="List Price"
                  value={this.state.listPrice}
                  onChange={this.handleChange("listPrice")}
                  margin="normal"
                />
              </div>
              <div style={{ width: "100%" }}>
                <TextField
                  style={{ width: "100%" }}
                  id="standard-name"
                  label="Standard Price"
                  value={this.state.standardPrice}
                  onChange={this.handleChange("standardPrice")}
                  margin="normal"
                />
              </div>
              <div style={{ width: "100%", paddingTop: "5em" }}>
                <Button
                  style={{
                    width: "100%",
                    background: "#c160f3",
                    border: "0",
                    outlineColor: "#c160f3"
                  }}
                  onClick={this.updateProduct}
                >
                  Update Product
                </Button>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  }
}

export default UpdateProductModal;
