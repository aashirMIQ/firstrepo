import React, { Component } from "react";
import { connect } from "react-redux";
import Ripple from "../../Components/RippleComponent/RippleComponent";
import Loader from "react-loader-spinner";
import { Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import UpdateProductModal from "../../Components/UpdateProductModal/UpdateProductModal";
import AddProductModal from "../../Components/addProductModal/addProductModal";
import { removeProduct } from "../../oscar-pos-core/actions"; //start from there
import "./CustomerAndProductSearch.css";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

const colors = ["#32C6E9", "#FEBF21", "#FB7447", "#D7E60A", "#5A2C8C"];

class SearchSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      productForUpdate: {},
      isSetValueFlag: false,
      forUpdateComponentWillReceiveProps: true
    };
  }

  // data = {
  //   display_name: name,
  //   barcode,
  //   price: parseInt(price),
  //   list_price: parseInt(price),
  //   standard_price: parseInt(costPrice)
  // };
  onHide = (product = {}) => {
    this.setState({ productForUpdate: product, isSetValueFlag: true }, () => {
      this.setState({
        show: !this.state.show,
        forUpdateComponentWillReceiveProps: !this.state
          .forUpdateComponentWillReceiveProps
      });
    });
  };

  setValueFlag = () => {
    this.setState({
      setValueFlag: false,
      forUpdateComponentWillReceiveProps: true
    });
  };

  toggleforUpdateComponentWillReceiveProps = () => {
    this.setState({
      forUpdateComponentWillReceiveProps: !this.state
        .forUpdateComponentWillReceiveProps
    });
  };

  deleteProduct = product => {
    console.log("product: ", product);
    this.props.dispatch(removeProduct(null, product.id));
  };

  render() {
    return (
      <section
        style={{
          height: this.state.searchCustomerFlag ? "90vh" : "80vh",
          overflow: "scroll",
          overflowY: "scroll",
          overflowX: "hidden"
        }}
      >
        {this.props.searchItemText.length &&
        !this.props.searchingLoading &&
        !this.props.searchedProducts.length &&
        !this.props.searchedCustomers.length ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100%"
            }}
          >
            <div style={{ textAlign: "center" }}>
              Sorry we couldn't find any matches for "
              {this.props.searchItemText}"
              <br />
              <img
                width="250px"
                style={{ marginTop: "1em" }}
                src={require("../../assets/images/icons/notfound-icon.svg")}
              />
            </div>
          </div>
        ) : (
          <span />
        )}
        {!this.props.searchingLoading && !this.props.searchItemText.length && (
          <section
            style={{
              height: "100%",
              width: "100%",
              display: "grid",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                width="250px"
                src={require("../../assets/images/icons/search.svg")}
              />
              <div
                style={{
                  fontSize: "20pt",
                  color: "#d1d3d4"
                }}
              >
                Search items, Barcode, and Customers
              </div>
            </div>
          </section>
        )}
        {this.props.searchingLoading ? (
          <div className="no-product-home">
            <Loader type="Grid" color="#662d94" height={50} width={50} />
            {/* <img width={"50px"} src={logo} alt="giflogo" /> */}
          </div>
        ) : (
          <div>
            {/* searched products will be rendered there */}
            {this.props.searchItemText.length > 0 &&
            this.props.searchedProducts.length > 0 &&
            this.props.searchProductFlag ? (
              this.props.searchedProducts.map((product, i) => {
                console.log("each product ::::: ", product);
                if (product.display_name)
                  return (
                    <div
                      key={i}
                      className="searched-list hover-style"
                      style={{
                        gridTemplateColumns: " 0.1fr 0.9fr ",
                        borderBottom: "1px solid #efefef"
                      }}
                    >
                      <div
                        className="searched-list-col-1"
                        style={{
                          background: "#f1f2f2",
                          color: "#939598"
                        }}
                      >
                        {product.display_name.slice(0, 2)}
                      </div>
                      <div
                        onClick={e => this.props.addProductInCart(e, product)}
                        className="searched-list-col-2"
                        style={{
                          // background: i % 2 === 0 ? "#f1f2f2" : "#e6e7e8"
                          paddingLeft: "3em"
                        }}
                      >
                        <div>{product.display_name}</div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end"
                          }}
                        >
                          <div>Rs. {product.list_price}</div>
                        </div>
                      </div>
                      {/* <div
                      style={{
                        background: i % 2 === 0 ? "#f1f2f2" : "#e6e7e8",
                        ...styles.center
                      }}
                    >
                      <Button
                        style={{
                          borderRadius: "50px",
                          outline: "none",
                          border: "0"
                        }}
                        onClick={() => this.onHide(product)}
                      >
                        <img
                          width="25px"
                          src={require("../../assets/images/edit-white.svg")}
                        />
                      </Button>
                      <Button
                        onClick={() => this.deleteProduct(product)}
                        style={{
                          borderRadius: "50px",
                          backgroundColor: "#ff7675",
                          outline: "none",
                          border: "0"
                        }}
                      >
                        <img
                          width="25px"
                          src={require("../../assets/images/delete-icon.svg")}
                        />
                      </Button>
                    </div> */}
                    </div>
                  );
              })
            ) : (
              <div
                style={{
                  padding:
                    this.props.searchCustomerFlag && this.props.searchItemText
                      ? "1em 2em"
                      : "0"
                }}
              >
                {/* searched customers will be rendered there */}
                {this.props.searchItemText.length > 0 &&
                  this.props.searchedCustomers &&
                  this.props.searchCustomerFlag &&
                  this.props.searchedCustomers.map((customer, i) => {
                    let sliceName =
                      customer.name.split(" ")[0][0].toUpperCase() +
                      customer.name.split(" ")[1][0].toUpperCase();
                    return (
                      <div
                        // onClick={() => this.showCustomerInfoModal(customer)}
                        key={customer.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "0.1fr 0.7fr 0.2fr",
                          padding: "1em",
                          borderBottom: "3px solid #eeeeee",
                          cursor: "pointer"
                        }}
                      >
                        <div style={styles.center}>
                          <div
                            style={{
                              ...styles.center,
                              color: "#fff",
                              backgroundColor: colors[i]
                                ? colors[i]
                                : colors[0],
                              height: "4em",
                              width: "4em",
                              borderRadius: "4em"
                            }}
                          >
                            {sliceName}
                          </div>
                        </div>
                        <div
                          style={{
                            ...styles.center,
                            paddingLeft: "1em",
                            alignItems: "none",
                            flexDirection: "column"
                          }}
                        >
                          <div style={{ fontSize: "19pt" }}>
                            {customer.name}
                          </div>
                          <div>{customer.phone}</div>
                        </div>
                        <div style={styles.center}>
                          {customer.loyalty_point || "0"}
                        </div>
                        {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end"
                              }}
                            >
                              <div
                                tyle={{
                                  cursor: "pointer"
                                }}
                                // onClick={() => this.editCustomer(customer)}
                              >
                                <img
                                  width="20px"
                                  src={require("../../assets/images/edit-icon.svg")}
                                />
                              </div>
                              <div
                                style={{
                                  cursor: "pointer"
                                }}
                                // onClick={() => this.deleteCustomer(customer)}
                              >
                                <img
                                  width="20px"
                                  src={require("../../assets/images/black-delete-icon.svg")}
                                />
                              </div>
                            </div> */}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
        {/* <UpdateProductModal
          setValueFlag={() => this.setState({ isSetValueFlag: false })}
          setValueFlag={this.state.setValueFlag}
          product={this.state.productForUpdate}
          show={this.state.show}
          onHide={this.onHide}
        /> */}
        <AddProductModal
          forUpdateComponentWillReceiveProps={
            this.state.forUpdateComponentWillReceiveProps
          }
          show={this.state.show}
          onHide={this.onHide}
          product={this.state.productForUpdate}
          editMode={true}
          toggleforUpdateComponentWillReceiveProps={
            this.toggleforUpdateComponentWillReceiveProps
          }
        />
        <ToastContainer autoClose={2000} />
      </section>
    );
  }
}

export default connect(state => {
  console.log("reducer state from home.js: ", state);
  return {
    products: state.products,
    cart: state.cart,
    searchedProducts: state.searchedProducts,
    emptyCartFlag: state.emptyCartFlag,
    searchedOrders: state.searchedOrders,
    searchedCustomers: state.searchedCustomers
  };
})(SearchSection);
