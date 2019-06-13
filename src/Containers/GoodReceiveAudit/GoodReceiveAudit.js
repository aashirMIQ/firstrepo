import React, { Component } from "react";
import { connect } from "react-redux";
import { formatNum } from "../../oscar-pos-core/constants";
import { PRODUCT, CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";
import Fuse from "fuse.js";
import { updateProduct } from "../../oscar-pos-core/actions";
import Autocomplete from "react-autocomplete";
import { ToastContainer, toast } from "react-toastify";
import "./GoodReveiveAudit.css";

class GoodReceive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barcode: "",
      updateRows: [],
      products: []
    };
  }

  componentDidMount() {
    this.setState({ products: this.props.products.slice(0, 10) }, () => {
      console.log("products:: ", this.state.products);
    });
  }

  searchProducts = e => {
    let options = {
      shouldSort: true,
      threshold: 0.0,
      tokenize: true,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: this.state.barcode.length,
      caseSensitive: false,
      keys: ["barcode"]
    };
    if (e.key == "Enter" && this.state.barcode.length >= 3) {
      var fuseRef = new Fuse(this.props.products, options);
      var result = fuseRef.search(this.state.barcode);
      console.log("result: ", result);
      if (result.length) {
        this.props.dispatch({
          type: PRODUCT.SET_PRODUCT_FOR_RECEIVE_ITEM,
          data: result[0]
        });
        this.props.history.push("/itemDetails");
      } else {
        alert("product not found");
      }
    }
  };

  addRow = () => {
    let { updateRows } = this.state;
    let obj = {
      productName: "",
      barcode: "",
      qty: "",
      cost: "",
      salePrice: "",
      total: ""
    };
    this.setState({ updateRows: [...updateRows, obj] });
  };

  deleteRow = i => {
    let { updateRows } = this.state;
    updateRows.splice(i, 1);
    this.setState({ updateRows });
  };

  onChange = (value, property, i) => {
    let { updateRows } = this.state;
    updateRows[i][property] = value;
    this.setState({ updateRows }, () => {
      console.log(property, value);
    });
    if (property === "display_name") {
      this.searchProducts(value);
    }
  };

  //enter press on input field add item if it only one
  searchProducts = value => {
    // let { searchedProducts } = this.props;
    let options = {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      caseSensitive: false,
      keys: ["display_name"]
    };
    var fuseRef = new Fuse(this.props.products, options);
    var result = fuseRef.search(value);
    this.setState({ products: result.slice(0, 10) });
  };

  setValue = (obj, i) => {
    let { updateRows } = this.state;
    // updateRows[i].productName = obj.display_name;
    // updateRows[i].barcode = obj.barcode;
    // updateRows[i].qty = obj.qty_in_stock;
    // updateRows[i].cost = obj.standard_price;
    // updateRows[i].salePrice = obj.list_price;
    // updateRows[i].total = obj.standard_price * obj.qty_in_stock;
    updateRows[i] = obj;
    this.setState({ updateRows }, () => {
      console.log("update row: ", this.state.updateRows);
    });
  };

  updateInventory = () => {
    let { updateRows } = this.state;
    console.log("updateRow: ", this.state.updateRows);
    for (let i = 0; i < this.state.updateRows.length; i++) {
      updateRows[i].product_id = updateRows[i].id;
      let obj = {
        product_id: updateRows[i].id,
        product_data: updateRows[i]
      };
      this.props.dispatch(updateProduct(null, obj));
    }
    setTimeout(() => {
      this.setState({ updateRows: [] }, () => {
        toast.success("Items Successfully Updated !", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      });
    });
  };

  render() {
    return (
      <div>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 9fr",
            background: "#662d94",
            height: "10vh"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer"
            }}
          >
            <img
              onClick={() => this.props.history.push("/inventoryScreen")}
              className="menu-img"
              width="30px"
              src={require("../../assets/images/left-arrow.svg")}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              color: "#fff",
              paddingRight: "10vw"
            }}
          >
            INVENTORY MANAGEMENT
          </div>
        </header>
        <section
          style={{
            height: "90vh",
            overflowX: "hidden",
            justifyItems: "center"
          }}
        >
          <div className="main-title">
            <div>ITEM AUDIT</div>
            <div>
              <button
                disabled={!this.state.updateRows.length}
                onClick={this.updateInventory}
              >
                Update Inventory
              </button>
            </div>
          </div>
          <div className="audit-titles">
            <div>#</div>
            <div>Product</div>
            <div>BARCODE</div>
            <div>QTY</div>
          </div>
          {this.state.updateRows &&
            this.state.updateRows.map((data, i) => {
              return (
                <div className="audit-titles" key={i}>
                  <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>{i + 1}</div>
                  <div style={{ height: "100%" }}>
                    <Autocomplete
                      inputProps={{
                        placeholder: "Product Name",
                        // style: { height: "100%", textAlign: "left" },
                        className:"inventory-input"
                      }}
                      placeholder="Product Name"
                      getItemValue={item => item.display_name}
                      items={this.state.products}
                      renderItem={(item, isHighlighted) => (
                        <div key={Math.random()}>
                          <div
                            style={{
                              background: isHighlighted ? "lightgray" : "white",
                              cursor: "pointer"
                            }}
                            className="product-list-item"
                            onKeyPress={e => {
                              if (e.key === "Enter") {
                                this.setValue(item, i);
                              }
                            }}
                            onClick={() => this.setValue(item, i)}
                          >
                            {item.display_name}
                          </div>
                        </div>
                      )}
                      value={data.display_name}
                      onChange={e => {
                        console.log("e.target: ", e.target.value);
                        this.onChange(e.target.value, "display_name", i);
                      }}
                      onSelect={val => this.onChange(val, "display_name", i)}
                    />
                    {/* <input
                    placeholder="Product Name"
                    value={data.productName}
                    onChange={e =>
                      this.onChange(e.target.value, "productName", i)
                    }
                  /> */}
                  </div>
                  <div style={{ height: "100%", display:'flex', justifyContent:'center', alignItems:'center' }}>{data.barcode}</div>
                  <div style={{ height: "100%" }}>
                    <input
                      className="inventory-input"
                      type="number"
                      placeholder="Quantity"
                      value={data.qty_in_stock}
                      onChange={e =>
                        this.onChange(e.target.value, "qty_in_stock", i)
                      }
                    />
                  </div>
                  <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                    <img
                        style={{cursor: 'pointer'}}
                      onClick={() => this.deleteRow(i)}
                      width="20px"
                      src={require("../../assets/images/delete-icon-red.svg")}
                    />
                  </div>
                </div>
              );
            })}
          <div style={{ borderBottom: "2px solid #dfdfdf" }}>
            <button
              style={{ background: "transparent", border: "none" }}
              onClick={this.addRow}
              className="add-item"
            >
              Add an item
            </button>
          </div>
        </section>
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
    topProduct: state.topProductReducer,
    setProductForReceiveItem: state.setProductForReceiveItem
  };
})(GoodReceive);
