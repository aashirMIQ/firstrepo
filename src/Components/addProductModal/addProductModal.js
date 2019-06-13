import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Modal,
  Dropdown,
  CustomMenu,
  CustomToggle
} from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import {
  createCustomer,
  updateCustomer,
  createProduct,
  getThisSubCategory,
  updateProduct
} from "../../oscar-pos-core/actions";
import { uuid } from "../../oscar-pos-core/constants";
import validator from "validator";
import { CustomerSchema } from "../../db/Schema";
import "./addProductModal.css";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import { ToastContainer, toast } from "react-toastify";
// import { getItem, getTotal } from "../../constants";
const styles = {
  row: {
    display: "flex",
    flexDirection: "colomn"
  },
  inputWrapper: {
    padding: "0 11px"
  },
  btn: {
    width: "100%"
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  calBtn1: {
    userSelect: "none",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    borderRadius: "0px",
    border: "1px solid #e7e7ef",
    background: "transparent",
    color: "#58595b",
    fontSize: "30px"
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
class CreateProductModal extends Component {
  constructor(props) {
    super(props);
    let customer = this.props.customer;
    this.state = {
      name: "",
      salePrice: "",
      costPrice: "",
      barcode: "",
      qty_in_stock: "",
      category: "",
      subcategory: "",
      disableSubCategory: true,
      editProductId: "",
      productForUpdate: {},
      validation: {
        name: {
          error: false,
          errorText: ""
        },
        salePrice: {
          error: false,
          errorText: ""
        },
        costPrice: {
          error: false,
          errorText: ""
        },
        qty_in_stock: {
          error: false,
          errorText: ""
        },
        category: {
          error: false,
          errorText: ""
        },
        subcategory: {
          error: false,
          errorText: ""
        },
        barcode: {
          error: false,
          errorText: ""
        }
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    let { productObj } = nextProps;
    if (
      nextProps.editMode &&
      nextProps.forUpdateComponentWillReceiveProps &&
      Object.keys(productObj).length
    ) {
      console.log("componentWillReciveProps from addProductModal: ", nextProps);
      let obj = {
        name: productObj.display_name,
        barcode: productObj.barcode,
        salePrice: productObj.list_price,
        costPrice: productObj.standard_price || productObj.list_price,
        category: productObj.category,
        subcategory: productObj.subcategory,
        editProductId: productObj.id,
        qty_in_stock: productObj.qty_in_stock || 0
      };
      this.getThisSubCategory(productObj.category);
      this.setState({
        ...obj,
        productForUpdate: productObj
        // forComponentWillReceiveProps: false
      });
      nextProps.toggleforUpdateComponentWillReceiveProps();
    }
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  createProduct = e => {
    var t0 = Date.now();
    e.preventDefault();
    let {
        name,
        barcode,
        salePrice,
        costPrice,
        qty_in_stock,
        subcategory,
        category,
        editProductId,
        productForUpdate,
        validation
      } = this.state,
      isFound = false,
      isError = false;

    console.log(
      "!name.toString().length >= 3 || !name.toString().length <= 15:: ",
      !name.toString().length >= 3 || !name.toString().length <= 15,
      name.toString().length
    );

    /* validation */
    if (name.toString().length >= 3) {
      validation.name.error = false;
      validation.name.errorText = "";
    } else {
      validation.name.error = true;
      validation.name.errorText = "invalid name";
      isError = true;
    }
    if (barcode.toString().length >= 3 && barcode.toString().length <= 40) {
      validation.barcode.error = false;
      validation.barcode.errorText = "";
    } else {
      validation.barcode.error = true;
      validation.barcode.errorText = "invalid barcode";
      isError = true;
    }
    if (costPrice.toString().length >= 0 && costPrice.toString().length <= 6) {
      validation.costPrice.error = false;
      validation.costPrice.errorText = "";
    } else {
      validation.costPrice.error = true;
      validation.costPrice.errorText = "invalid costPrice";
      isError = true;
    }
    if (qty_in_stock.toString().length > 0) {
      validation.qty_in_stock.error = false;
      validation.qty_in_stock.errorText = "";
    } else {
      validation.qty_in_stock.error = true;
      validation.qty_in_stock.errorText = "invalid quantity";
      isError = true;
    }
    if (category.toString().length > 0) {
      validation.category.error = false;
      validation.category.errorText = "";
    } else {
      validation.category.error = true;
      validation.category.errorText = "invalid category";
      isError = true;
    }
    if (subcategory && subcategory.toString().length > 0) {
      validation.subcategory.error = false;
      validation.subcategory.errorText = "";
    } else {
      validation.subcategory.error = true;
      validation.subcategory.errorText = "invalid subcategory";
      isError = true;
    }
    // let data = {
    //   id: uuid(),
    //   display_name: name,
    //   barcode,
    //   price: parseInt(salePrice),
    //   list_price: parseInt(salePrice),
    //   standard_price: parseInt(costPrice),
    //   qty_in_stock: parseInt(qty_in_stock) || 0,
    //   subcategory,
    //   category
    // };
    // for (let i = 0; i < this.props.products.length; i++) {
    //   if (this.props.products[i].barcode == data.barcode) {
    //     isFound = true;
    //   }
    // }
    // if (isFound) {
    //   validation.barcode.error = true;
    //   validation.barcode.errorText = "Barcode Already exist";
    //   isError = true;
    // }

    /* validation */
    /* for alerting */
    if (isError) {
      this.setState({ validation });
      return;
    }
    /* for alerting */

    if (!this.props.editMode) {
      let data = {
        id: uuid(),
        display_name: name,
        barcode,
        price: parseInt(salePrice),
        list_price: parseInt(salePrice),
        standard_price: parseInt(costPrice),
        qty_in_stock: parseInt(qty_in_stock) || 0,
        subcategory,
        category
      };
      for (let i = 0; i < this.props.products.length; i++) {
        if (this.props.products[i].barcode == data.barcode) {
          isFound = true;
        }
      }
      if (!isFound) {
        this.props
          .dispatch(createProduct(null, data))
          .then(res => {
            console.log("res from addProductModal : ", res);
            var t1 = Date.now();
            console.log(
              "Time consume (Create Product)= ",
              (t1 - t0) / 1000,
              " sec"
            );
            validation.barcode.error = false;
            validation.barcode.errorText = "";
            isError = false;
            this.setState({
              validation
            });
            toast.success("Item Successfully Created !", {
              position: toast.POSITION.BOTTOM_LEFT
            });
            this.resetState();
            this.props.onHide();
          })
          .catch(error => {
            console.log("error res from addProductModal: ", error);
          });
      } else {
        alert("this barcode associate with another product");
      }
    } else {
      let data = {
        id: editProductId,
        display_name: name,
        barcode,
        price: parseInt(salePrice),
        list_price: parseInt(salePrice),
        standard_price: parseInt(costPrice),
        qty_in_stock: parseInt(qty_in_stock) || 0,
        subcategory: subcategory,
        category
      };
      let product = {
        product_data: { ...productForUpdate, ...data },
        product_id: data.id
      };

      this.props
        .dispatch(updateProduct(null, product))
        .then(res => {
          console.log(
            "product updated in database from addProductModal: ",
            res
          );
          var t1 = Date.now();
          console.log(
            "Time consume (Update Product)= ",
            (t1 - t0) / 1000,
            " sec"
          );
          toast.success("Item Successfully Updated !", {
            position: toast.POSITION.BOTTOM_LEFT
          });
          this.resetState();
          this.props.onHide();
          this.props.resetEditMode();
        })
        .catch(error => {
          console.error(
            "error product update in database from addProductModal: ",
            error
          );
        });
    }
  };

  setCategory = category => {
    this.setState({ category, subcategory: "" });
    this.getThisSubCategory(category);
  };
  setSubCategory = subcategory => {
    this.setState({ subcategory });
  };

  getThisSubCategory = category => {
    this.setState({ disableSubCategory: true });
    this.props.dispatch(getThisSubCategory(null, category)).then(data => {
      console.log("******************************: ", data);
      this.setState({
        disableSubCategory: false
      });
    });
  };

  resetState = () => {
    this.setState({
      name: "",
      salePrice: "",
      costPrice: "",
      barcode: "",
      qty_in_stock: "",
      category: "",
      subcategory: "",
      disableSubCategory: true,
      editProductId: "",
      productForUpdate: {}
    });
  };
  render() {
    console.log("this.state: ", this.state);
    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={() => {
            this.resetState();
            this.props.onHide();
          }}
        >
          <div
            style={{
              height: "85vh"
            }}
          >
            <Modal.Header style={styles.modalHeader}>
              <div style={styles.headerItem} />
              <div style={styles.headerItem}>Add Product</div>
              <div style={styles.headerItem}>
                <img
                  width="50px"
                  onClick={() => {
                    this.props.onHide();
                    this.resetState();
                  }}
                  src={require("../../assets/images/icons/close.svg")}
                />
              </div>
              {/* <Modal.Title>Customer Details</Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
              <form
                onSubmit={this.createProduct}
                style={{
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={styles.row}>
                  <div style={styles.inputWrapper}>
                    <TextField
                      error={this.state.validation.name.error}
                      required={true}
                      helperText={this.state.validation.name.errorText}
                      id="standard-name"
                      type="text"
                      label="Name"
                      value={this.state.name}
                      onChange={this.handleChange("name")}
                      margin="normal"
                      inputProps={{ maxLength: "30" }}
                    />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={styles.inputWrapper}>
                    <TextField
                      error={this.state.validation.costPrice.error}
                      required={true}
                      helperText={this.state.validation.costPrice.errorText}
                      id="standard-name"
                      label="Cost Price"
                      value={this.state.costPrice}
                      onChange={this.handleChange("costPrice")}
                      margin="normal"
                      type="number"
                      onInput={e => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                    />
                  </div>
                  <div style={styles.inputWrapper}>
                    <TextField
                      error={this.state.validation.barcode.error}
                      required={true}
                      helperText={this.state.validation.barcode.errorText}
                      id="standard-name"
                      label="Barcode"
                      value={this.state.barcode}
                      onChange={this.handleChange("barcode")}
                      margin="normal"
                      type="barcode"
                      inputProps={{ maxLength: "40" }}
                    />
                  </div>
                </div>
                <div
                  style={{ ...styles.row, width: "100%", padding: "0 11px" }}
                >
                  <div style={{ ...styles.inputWrapper, width: "100%" }}>
                    <TextField
                      error={this.state.validation.qty_in_stock.error}
                      required={true}
                      helperText={this.state.validation.qty_in_stock.errorText}
                      style={{ width: "100%" }}
                      id="standard-name"
                      label="qty"
                      value={this.state.qty_in_stock}
                      onChange={this.handleChange("qty_in_stock")}
                      margin="normal"
                      type="number"
                      inputProps={{ maxLength: "10" }}
                      onInput={e => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                    />
                  </div>
                  <div style={styles.inputWrapper}>
                    <TextField
                      error={this.state.validation.salePrice.error}
                      required={true}
                      helperText={this.state.validation.salePrice.errorText}
                      id="standard-name"
                      label="Sale Price"
                      value={this.state.salePrice}
                      onChange={this.handleChange("salePrice")}
                      margin="normal"
                      type="number"
                      onInput={e => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: "50%",
                    padding: "0 11px"
                  }}
                >
                  <Dropdown
                    style={{
                      width: "100%"
                    }}
                  >
                    <Dropdown.Toggle
                      className="bootstrap-btn"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgb(193, 96, 243)",
                        border: "none",
                        color: "rgba(0,0,0,0.5)",
                        background: "transparent",
                        borderBottom: "1px solid rgba(0,0,0,0.5)",
                        borderRadius: "0px"
                      }}
                      id="dropdown-custom-components"
                    >
                      {this.state.category || "Add Category"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {this.props.mainCategories.map((category, i) => {
                        return (
                          <Dropdown.Item
                            eventKey={`${i}`}
                            onClick={() => this.setCategory(category)}
                          >
                            {category}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                  <div style={{ color: "#f44336" }}>
                    {this.state.validation.category.error &&
                      this.state.validation.category.errorText}
                  </div>
                </div>
                <div
                  style={{
                    width: "50%",
                    padding: "0 11px"
                  }}
                >
                  <Dropdown
                    style={{
                      width: "100%"
                    }}
                  >
                    <Dropdown.Toggle
                      disabled={this.state.disableSubCategory}
                      className="bootstrap-btn"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgb(193, 96, 243)",
                        border: "none",
                        color: "rgba(0,0,0,0.5)",
                        background: "transparent",
                        borderBottom: "1px solid rgba(0,0,0,0.5)",
                        borderRadius: "0px"
                      }}
                      id="dropdown-custom-components"
                    >
                      {this.state.subcategory || "Sub Category"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {this.props.subCategories.map((category, i) => {
                        return (
                          <Dropdown.Item
                            eventKey={`${i}`}
                            onClick={() => this.setSubCategory(category)}
                          >
                            {category}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                  <div style={{ color: "#f44336" }}>
                    {this.state.validation.subcategory.error &&
                      this.state.validation.subcategory.errorText}
                  </div>
                </div>
                <div
                  style={{ ...styles.row, width: "100%", padding: "0 22px" }}
                >
                  <button
                    style={{
                      ...styles.btn,
                      background: "#8dc63f",
                      border: "none",
                      padding: "0.5em",
                      color: "#fff",
                      borderRadius: "0px"
                    }}
                    // onSubmit={this.createProduct}
                    type="submit"
                  >
                    {this.props.editMode ? "Update Product" : "Add New Product"}
                  </button>
                </div>
              </form>
            </Modal.Body>
          </div>
        </Modal>
        <ToastContainer autoClose={2000} />
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    user: state.userReducer,
    products: state.products,
    mainCategories: state.mainCategories.mainCategories,
    subCategories: state.mainCategories.subCategories
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps)(CreateProductModal);
