import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddProductModal from "../../Components/addProductModal/addProductModal";
import { CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
import Drawer from "../../Components/Drawer/Drawer";
import { ToastContainer, toast } from "react-toastify";
import Fuse from "fuse.js";
import {
  emptyCart,
  setEmptyCartFlag,
  set_opening_balance,
  logout,
  createPayment,
  getTopProducts,
  removeProduct
} from "../../oscar-pos-core/actions";
import "./ItemScreen.css";

const styles = {
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
class ItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: 0,
      tenderAmount: 0,
      open: false,
      udhaarAmount: 0,
      productSearchingQuery: "",
      products: [],
      showAddProductModal: false,
      editMode: false,
      productObj: {},
      forUpdateComponentWillReceiveProps: false,
      searchedProducts: []
    };
  }

  componentDidMount() {
    // this.props.dispatch(getTopProducts(null));
    this.setState({ products: this.props.products.slice(0, 20) });
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "all product from component will receive props: ",
      nextProps.topProduct
    );
    this.setState({ products: nextProps.products.slice(0, 20) });
  }

  logout = () => {
    this.props.dispatch(emptyCart());
    // localStorage.setItem("pos_session_id", null);
    this.props
      .dispatch(logout())
      .then(() => {
        localStorage.setItem("user", null);
        this.props.dispatch({
          type: CUSTOMER.RESET_CUSTOMER_FOR_ORDER
        });
        this.props.dispatch({
          type: SESSION.RESET_POS_SESSION_ID
        });
        this.props.history.replace("/");
      })
      .catch(error => {
        console.log("error logout function ");
      });
  };

  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  toggleSlide = (index, fromSearchedProducts = false) => {
    console.log("fromSearchedProducts: ", fromSearchedProducts);
    let { products, searchedProducts } = this.state;
    for (let i = 0; i < products.length; i++) {
      if (index == i && !fromSearchedProducts) {
        products[i].isSlide === undefined || products[i].isSlide === false
          ? (products[i].isSlide = true)
          : (products[i].isSlide = true);

        this.setState({ products });
        break;
      }
      if (index == i && fromSearchedProducts) {
        searchedProducts[i].isSlide === undefined ||
        searchedProducts[i].isSlide === false
          ? (searchedProducts[i].isSlide = true)
          : (searchedProducts[i].isSlide = true);
        this.setState({ searchedProducts });
        break;
      }
    }
  };
  makeViewFalse = (index, fromSearchedProducts = false) => {
    let { products, searchedProducts } = this.state;
    for (let i = 0; i < products.length; i++) {
      if (index == i && !fromSearchedProducts) {
        products[i].isSlide == undefined
          ? (products[i].isSlide = false)
          : (products[i].isSlide = false);
        this.setState({ products });
        break;
      }
      if (index == i && fromSearchedProducts) {
        searchedProducts[i].isSlide == undefined
          ? (searchedProducts[i].isSlide = false)
          : (searchedProducts[i].isSlide = false);
        this.setState({ searchedProducts });
        break;
      }
    }
  };

  editProduct = product => {
    this.setState(
      {
        productObj: product,
        editMode: true,
        forUpdateComponentWillReceiveProps: true
      },
      () => {
        this.handleAddProductModal();
      }
    );
  };

  handleAddProductModal = () => {
    this.setState({ showAddProductModal: !this.state.showAddProductModal });
  };

  deleteProduct = product => {
    var t0 = Date.now();
    this.props.dispatch(removeProduct(null, product.id)).then(data => {
      toast.success("Item Successfully Removed !", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.searchProducts("searchProduct");
    });
    var t1 = Date.now();
    console.log("Time consume (Remove Product)= ", (t1 - t0) / 1000, " sec");
  };

  onChange = e => {
    this.setState({ productSearchingQuery: e.target.value });
    if (e.target.value.length == 0) {
      this.setState({
        products: this.props.products.slice(0, 20),
        searchedProducts: []
      });
    }
  };

  searchProducts = e => {
    let options = {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      caseSensitive: false,
      keys: ["barcode", "display_name", "id"]
    };
    if (e.key == "Enter" || e == "searchProduct") {
      var fuseRef = new Fuse(this.props.products, options);
      var result = fuseRef.search(this.state.productSearchingQuery);
      console.log("result: ", result.slice(0, 20));
      if (!result.length) {
        toast.warn("Not Found !", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        return;
      }
      this.setState({ searchedProducts: result.slice(0, 20) });
    }
  };

  resetEditMode = () => {
    this.setState({ editMode: false });
  };
  render() {
    return (
      <div>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 8fr 1fr",
            background: "#662d94",
            height: "10vh"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderRight: "2px solid #5e2985"
            }}
          >
            <img
              onClick={this.toggleDrawer}
              className="menu-img"
              src={require("../../assets/images/menuicon.svg")}
            />
          </div>
          <div className="header-wrapper-col-2">
            <div style={{ display: "flex", width: "100%" }}>
              <img
                onClick={() => this.props.history.goBack()}
                src={require("../../assets/images/searchicon.svg")}
                width={"32px"}
              />
              <input
                className="input"
                // onFocus={this.onFocusOnInput}
                placeholder="Search Product by name or barcode"
                onChange={this.onChange}
                onKeyPress={this.searchProducts}
                style={{ width: "90%" }}
                // width="90%"
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderLeft: "2px solid #5e2985"
            }}
          >
            <img
              onClick={this.handleAddProductModal}
              className="menu-img"
              width="30px"
              src={require("../../assets/images/Add.svg")}
            />
          </div>
        </header>
        <div
          className="itemTableHeader"
          style={{
            height: "10vh",
            display: "grid",
            gridTemplateColumns: "0.66fr 2fr repeat(4, 1fr)",
            alignItems: "center",
            borderBottom: "1px solid #f8f8f8"
          }}
        >
          <div>#</div>
          <div>Item Name</div>
          <div>Category</div>
          <div>Barcode</div>
          <div>Qty in Stock</div>
          <div>Sale Price</div>
        </div>
        <section style={{ height: "80vh", overflowX: "hidden" }}>
          {!this.state.searchedProducts.length
            ? this.state.products.map((customer, i) => {
                return (
                  <div
                    className="itemTablebody"
                    onClick={() => this.toggleSlide(i, false)}
                    onMouseLeave={() => this.makeViewFalse(i, false)}
                    key={customer.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.66fr 2fr repeat(4, 1fr)",
                      // paddingLeft: "1em",
                      borderBottom: "1px solid #eeeeee",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ ...styles.center }}>
                      <div
                        style={{
                          ...styles.center,
                          color: "#fff",
                          // backgroundColor: colors[i] ? colors[i] : colors[0],
                          // border: "1px solid #000",
                          color: "#000"
                          // height: "3em",
                          // width: "3em",
                          // borderRadius: "3em",
                          // padding: "1em"
                        }}
                      >
                        {/* {customer.display_name.slice(0, 2)} */}
                        {i + 1}
                      </div>
                    </div>
                    <div
                      className="itemnameColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        alignItems: "none",
                        flexDirection: "column"
                      }}
                    >
                      <div
                        className="itemnameInnertext"
                        style={{ fontSize: "16px" }}
                      >
                        {customer.display_name}
                      </div>
                      {/* <div>{customer.phone}</div> */}
                    </div>
                    <div
                      className="catergoryColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span>{customer.subcategory}</span>
                      </div>
                    </div>
                    <div
                      className="barcodeColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span>{customer.barcode}</span>
                      </div>
                    </div>
                    <div
                      className="qtyColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span>{customer.qty_in_stock}</span>
                      </div>
                    </div>
                    <div
                      className="priceColumn"
                      style={{
                        ...styles.center,
                        flexDirection: "column",
                        position: "relative"
                        // paddingLeft: "10em"
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "row"
                        }}
                      >
                        Rs <span>{customer.list_price}</span>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          width: "100%",
                          height: "100%",
                          right: customer.isSlide ? "0px" : "-534px",
                          transition: "0.5s"
                        }}
                      >
                        <div
                          onClick={() => this.editProduct(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "50%",
                            fontSize: "10px",
                            background: "#00aeef",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => this.deleteProduct(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "50%",
                            fontSize: "10px",
                            background: "#f76161",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : this.state.searchedProducts.map((customer, i) => {
                return (
                  <div
                    className="itemTablebody"
                    onClick={() => this.toggleSlide(i, true)}
                    onMouseLeave={() => this.makeViewFalse(i, true)}
                    key={customer.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.66fr 2fr repeat(4, 1fr)",
                      // paddingLeft: "1em",
                      borderBottom: "1px solid #eeeeee",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ ...styles.center }}>
                      <div
                        style={{
                          ...styles.center,
                          color: "#fff",
                          // backgroundColor: colors[i] ? colors[i] : colors[0],
                          // border: "1px solid #000",
                          color: "#000"
                          // height: "3em",
                          // width: "3em",
                          // borderRadius: "3em",
                          // padding: "1em"
                        }}
                      >
                        {/* {customer.display_name.slice(0, 2)} */}
                        {i + 1}
                      </div>
                    </div>
                    <div
                      className="itemnameColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        alignItems: "none",
                        flexDirection: "column"
                      }}
                    >
                      <div
                        className="itemnameInnertext"
                        style={{ fontSize: "16px" }}
                      >
                        {customer.display_name}
                      </div>
                      {/* <div>{customer.phone}</div> */}
                    </div>
                    <div
                      className="catergoryColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span>{customer.subcategory}</span>
                      </div>
                    </div>
                    <div
                      className="barcodeColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span>{customer.barcode}</span>
                      </div>
                    </div>
                    <div
                      className="qtyColumn"
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span>{customer.qty_in_stock}</span>
                      </div>
                    </div>
                    <div
                      className="priceColumn"
                      style={{
                        ...styles.center,
                        flexDirection: "column",
                        position: "relative"
                        // paddingLeft: "10em"
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "row"
                        }}
                      >
                        Rs <span>{customer.list_price}</span>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          width: "100%",
                          height: "100%",
                          right: customer.isSlide ? "0px" : "-534px",
                          transition: "0.5s"
                        }}
                      >
                        <div
                          onClick={() => this.editProduct(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "50%",
                            fontSize: "10px",
                            background: "#00aeef",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => this.deleteProduct(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "50%",
                            fontSize: "10px",
                            background: "#f76161",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </section>

        <Drawer
          history={this.props.history}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          logout={this.logout}
        />

        <AddProductModal
          show={this.state.showAddProductModal}
          onHide={this.handleAddProductModal}
          editMode={this.state.editMode}
          resetEditMode={this.resetEditMode}
          productObj={this.state.productObj}
          forUpdateComponentWillReceiveProps={
            this.state.forUpdateComponentWillReceiveProps
          }
          toggleforUpdateComponentWillReceiveProps={() =>
            this.setState({
              forUpdateComponentWillReceiveProps: false
            })
          }
        />
        <ToastContainer autoClose={2000} />
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {};
};

let mapDispatchToProps = dispatch => {
  return {};
};
export default connect(state => {
  console.log("reducer state from home.js: ", state);
  return {
    products: state.products,
    cart: state.cart,
    user: state.userReducer,
    pos_session_id: state.pos_session_id,
    customer: state.setCustomerForOrder,
    setCustomerForUdhaar: state.setCustomerForUdhaar,
    topProduct: state.topProductReducer
  };
})(ItemScreen);
