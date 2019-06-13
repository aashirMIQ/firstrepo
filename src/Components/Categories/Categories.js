import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import {
  getCategories,
  getThisSubCategory,
  getThisCategoryProducts
} from "../../oscar-pos-core/actions";
import Loader from "react-loader-spinner";
import CategoryDB from "../../db/categories";
import "./Categories.css";
import { CATEGORY } from "../../oscar-pos-core/actions/types";
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
let CompRef = {};
class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      isLoading: true,
      showMainCategories: false,
      showSubCategories: false,
      showProducts: false,
      mainCategoryName: "",
      subCategoryName: "",
      divRef: {},
      scrollTop: 0,
      categorizedProducts: []
    };
    CompRef = this;
  }
  // componentDidMount() {
  //   this.productsView.addEventListener("scroll", this.callPaging);
  // }
  // componentWillUnmount() {
  //   this.productsView.removeEventListener("scroll");
  // }
  componentDidMount() {
    if (!this.props.mainCategories.length) {
      this.props.dispatch(getCategories(null)).then(res => {
        console.log("categories from database in category component: ", res);
        if (!res || !res.length) {
          CategoryDB.loadCategoriesInDB().then(res => {
            this.props.dispatch(getCategories(null)).then(data => {
              this.setState({ showMainCategories: true });
            });
          });
        } else {
          this.setState({ showMainCategories: true });
        }
      });
    } else {
      this.setState({ showMainCategories: true });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("nextprops from Categories.js::: ", nextProps);
    if (nextProps.getProductFlag) {
      CompRef.setState({
        categorizedProducts: nextProps.categorizedProducts.slice(0, 20)
      });
      nextProps.dispatch({
        type: CATEGORY.RESET_GET_CATEGORIZED_PRODUCT
      });
      CompRef.timer = setInterval(() => {
        CompRef.setState({
          categorizedProducts: [
            ...CompRef.state.categorizedProducts,
            ...CompRef.props.categorizedProducts.slice(
              CompRef.state.categorizedProducts.length - 1,
              CompRef.state.categorizedProducts.length + 10
            )
          ]
        });
      }, 2000);
    }
    return null;
  }
  populateCartItems = () => {
    let { cart, products } = this.props,
      cartItems = [];
    for (let key in cart) {
      for (let i = 0; i < products.length; i++) {
        if (products[i].id == key) {
          cartItems.push({
            displayName: products[i].display_name,
            price: products[i].list_price
          });
          break;
        }
      }
    }
    console.log("cartItems: ", cartItems);
    this.setState({ cartItems });
  };

  getThisSubCategory = category => {
    this.props.toggleshowCategories();
    this.setState({ showMainCategories: false });
    this.props.dispatch(getThisSubCategory(null, category)).then(data => {
      console.log("******************************: ", data);
      this.setState({
        showSubCategories: true,
        mainCategoryName: category
      });
    });
  };
  backToMainCategories = () => {
    this.props.trueshowBackArrow();
    this.setState({ showSubCategories: false, showMainCategories: true });
  };

  getProducts = category => {
    this.setState({
      showProducts: false,
      showMainCategories: false,
      showSubCategories: false,
      subCategoryName: category
    });
    this.props
      .dispatch(
        getThisCategoryProducts(null, this.state.mainCategoryName, category)
      )
      .then(data => {
        this.setState({
          showProducts: true,
          showMainCategories: false,
          showSubCategories: false
        });
      })
      .catch(error => {
        console.log("error from getting subcategory products: ", error);
      });
  };
  backToSubCategories = () => {
    clearInterval(this.timer);
    this.setState({
      showMainCategories: false,
      showProducts: false,
      showSubCategories: true
    });
  };

  callPaging = () => {
    let scrollTop = document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight;
    let offsetHeight = document.documentElement.clientHeight;
    let contentHeight = scrollHeight - offsetHeight;
    console.log("scrollTop: ", scrollTop);
    console.log("scrollHeight: ", scrollHeight);
    console.log("offsetHeight: ", offsetHeight);
    console.log("contentHeight: ", contentHeight);
    this.setState({ scrollTop });
    if (contentHeight <= scrollTop) {
    }
  };

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) => {
    return (
      <div
        key={key}
        className="searched-list"
        style={{
          gridTemplateColumns: "0.2fr 0.7fr 0.2fr",
          gridTemplateRows: "10vh",
          borderBottom: "1px solid #e6e7e8"
        }}
      >
        <div
          // className="searched-list-col-1"
          style={{
            background: "#f1f2f2",
            color: "#939598",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.props.categorizedProducts[index].display_name.slice(0, 2)}
        </div>
        <div
          onClick={e =>
            this.props.addProductInCart(
              e,
              this.props.categorizedProducts[index]
            )
          }
          // className="searched-list-col-2"
          style={{
            // background: i % 2 === 0 ? "#f1f2f2" : "#e6e7e8"
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "2em"
          }}
        >
          <div>{this.props.categorizedProducts[index].display_name}</div>
        </div>
        <div
          style={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold"
          }}
        >
          <div>Rs. {this.props.categorizedProducts[index].list_price}</div>
        </div>
      </div>
    );
  };

  fetchMoreData = () => {
    setTimeout(() => {
      this.setState({
        categorizedProducts: [
          ...this.state.categorizedProducts,
          ...this.props.categorizedProducts.slice(
            this.state.categorizedProducts.length - 1,
            this.state.categorizedProducts.length + 20
          )
        ]
      });
    }, 1500);
  };
  render() {
    if (this.state.showMainCategories) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "5em",
            gridGap: "0.5em",
            // gridAutoRows: "minmax(5em, 7em)",
            // gridTemplateColumns: "repeat(2, 1fr)",
            // gridTemplateRows: "repeat(6, 1fr)",
            // gridGap: "1em",
            // padding: "1em"
            height: "70vh",
            paddingTop: "0.5em",
            paddingLeft: "0.5em",
            paddingRight: "0.5em"
          }}
        >
          {this.props.mainCategories.length &&
            this.props.mainCategories.map((category, i) => {
              return (
                <div
                  className="category-item"
                  onClick={() => this.getThisSubCategory(category)}
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    // border: "1px solid",
                    cursor: "pointer",
                    fontSize: "13px",
                    // background: "#ecf0f1",
                    padding: "1em",
                    color: "#2c3e50",
                    borderRadius: "5px",
                    border: "2px solid #ecf0f1",
                    textAlign: "center"
                    // height:'10vh'
                  }}
                >
                  <div>{category}</div>
                </div>
              );
            })}
        </div>
      );
    }
    if (this.state.showSubCategories) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 9fr",
            height: "90vh"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 7fr",
              height: "10vh",
              borderBottom: "2px solid #dfdfdf"
            }}
          >
            <div
              className="back-btn"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={this.backToMainCategories}
            >
              <img
                width="30px"
                src={require("../../assets/images/back-arrow.svg")}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: "35%"
              }}
            >
              {this.state.mainCategoryName}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "5em",
              gridGap: "0.5em",
              // gridAutoRows: "minmax(5em, 7em)",
              // gridTemplateColumns: "repeat(5, 1fr)",
              // gridTemplateRows: `repeat(${Math.ceil(
              //   this.props.subCategories.length / 5
              // )}, minmax(6em,1fr))`,
              // gridGap: "1em",
              // padding: "1em",
              height: "80vh",
              overflowY: "scroll",
              paddingTop: "0.5em",
              paddingLeft: "0.5em",
              paddingRight: "0.5em"
            }}
          >
            {this.props.subCategories.length &&
              this.props.subCategories.map((category, i) => {
                console.log(
                  "Math.fround(this.props.subCategories.length/5): ",
                  Math.ceil(this.props.subCategories.length / 5)
                );
                return (
                  <div
                    className="category-item"
                    onClick={() => this.getProducts(category)}
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      // border: "1px solid",
                      cursor: "pointer",
                      fontSize: "13px",
                      // background: "#ecf0f1",
                      padding: "1em",
                      color: "#2c3e50",
                      borderRadius: "5px",
                      textAlign: "center"
                      // height:'10vh'
                    }}
                  >
                    <div>{category}</div>
                  </div>
                );
              })}
          </div>
        </div>
      );
    }

    if (this.state.showProducts) {
      return (
        <div
          // ref={ref => (this.productsView = ref)}
          style={{
            display: "grid",
            gridTemplateRows: "1fr 9fr",
            height: "90vh"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 7fr",
              height: "10vh",
              borderBottom: "2px solid #dfdfdf"
            }}
          >
            <div
              className="back-btn"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={this.backToSubCategories}
            >
              <img
                width="30px"
                src={require("../../assets/images/back-arrow.svg")}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: "35%"
              }}
            >
              {this.state.subCategoryName}
            </div>
          </div>
          <div
            ref={ref => (this.divRef = ref)}
            style={{
              // display: "grid",
              // gridTemplateColumns: "2fr 6fr 2fr",
              // gridAutoRows: "5em",

              // gridAutoRows: "minmax(5em, 7em)",
              // gridTemplateColumns: "repeat(4, 1fr)",
              // gridAutoRows: "120px",
              // gridRowGap: ".5em",
              // gridColumnGap: "1em",
              // gridGap: "0.5em",
              height: "80vh",
              overflowY: "scroll",
              paddingTop: "0.5em",
              paddingLeft: "0.5em",
              paddingRight: "0.5em"
            }}
          >
            {this.props.categorizedProducts.length &&
              // (
              //   <AutoSizer rowCount={this.props.categorizedProducts.length}>
              //     {({ height, width }) => (
              //       <List
              //         width={width}
              //         height={height}
              //         // style={{width: '100%', height:'100%'}}
              //         // onScroll={this.callPaging}
              //         rowCount={this.props.categorizedProducts.length}
              //         rowHeight={100}
              //         rowRenderer={this.rowRenderer}
              //         scrollTop={this.state.scrollTop}
              //         // overscanRowCount={3}
              //       />
              //     )}
              //   </AutoSizer>
              // )
              this.state.categorizedProducts.map((product, i) => {
                return (
                  <div
                    onClick={e => this.props.addProductInCart(e, product)}
                    key={i}
                    className="searched-list"
                    style={{
                      gridTemplateColumns: "0.2fr 0.7fr 0.2fr",
                      gridTemplateRows: "10vh",
                      borderBottom: "1px solid #e6e7e8"
                    }}
                  >
                    <div
                      // className="searched-list-col-1"
                      style={{
                        background: "#f1f2f2",
                        color: "#939598",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      {product.display_name.slice(0, 2)}
                    </div>
                    <div
                      // className="searched-list-col-2"
                      style={{
                        // background: i % 2 === 0 ? "#f1f2f2" : "#e6e7e8"
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "2em"
                      }}
                    >
                      <div>{product.display_name}</div>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold"
                      }}
                    >
                      <div>Rs. {product.list_price}</div>
                    </div>
                  </div>
                );
              })
            // <div
            //   key={i}
            //   className="searched-list"
            //   style={{
            //     gridTemplateColumns: "0.2fr 0.7fr 0.2fr",
            //     gridTemplateRows: "10vh",
            //     borderBottom: "1px solid #e6e7e8"
            //   }}
            // >
            //   <div
            //     // className="searched-list-col-1"
            //     style={{
            //       background: "#f1f2f2",
            //       color: "#939598",
            //       display: "flex",
            //       justifyContent: "center",
            //       alignItems: "center"
            //     }}
            //   >
            //     {product.display_name.slice(0, 2)}
            //   </div>
            //   <div
            //     onClick={e => this.props.addProductInCart(e, product)}
            //     // className="searched-list-col-2"
            //     style={{
            //       // background: i % 2 === 0 ? "#f1f2f2" : "#e6e7e8"
            //       fontSize: "13px",
            //       display: "flex",
            //       alignItems: "center",
            //       paddingLeft: "2em"
            //     }}
            //   >
            //     <div>{product.display_name}</div>
            //   </div>
            //   <div
            //     style={{
            //       fontSize: "13px",
            //       display: "flex",
            //       alignItems: "center",
            //       justifyContent: "center",
            //       fontWeight: "bold"
            //     }}
            //   >
            //     <div>Rs. {product.list_price}</div>
            //   </div>
            // </div>
            }
          </div>
        </div>
      );
    }
    //in default loader will be return
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* <Loader type="Grid" color="#662d94" height={50} width={50} /> */}
        <img width="120px" src={require("../../assets/images/loader.gif")} />
      </div>
    );
  }
}

export default connect(state => {
  console.log("reducer state from home.js: ", state);
  return {
    products: state.products,
    cart: state.cart,
    mainCategories: state.mainCategories.mainCategories,
    subCategories: state.mainCategories.subCategories,
    categorizedProducts: state.mainCategories.products,
    getProductFlag: state.mainCategories.getProductFlag
  };
})(Categories);
