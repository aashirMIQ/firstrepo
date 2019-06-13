import React, { Component } from "react";
import { Button, Modal, DropdownButton, Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import Badge from "@material-ui/core/Badge";
import BarcodeReader from "react-barcode-reader";
import Fuse from "fuse.js";
import { ToastContainer, toast } from "react-toastify";
import {
  onLogin,
  addProduct,
  getProducts,
  removeProductFromCart,
  addDiscountOnItem,
  addDiscountProduct,
  productSearchingQuery,
  decQty,
  clearEmptyCartFlag,
  orderSearchingQuery,
  customerSearchingQuery,
  addCustomProduct,
  submitMoneyIn,
  submitMoneyOut,
  openPosSession,
  emptyCart,
  setEmptyCartFlag,
  close_pos_session,
  getCreditHistory
} from "../../oscar-pos-core/actions"; //start from there
import CategoryDB from "../../db/categories";
import CreateCustomerModal from "../../Components/CreateCustomerModal/CreateCustomerModal";
import DiscountInRupeesModal from "../../Components/DiscountInRupeesModal/DiscountInRupeesModal";
import DiscountInRatioModal from "../../Components/DiscountInRatioModal/DiscountInRatioModal";
import DiscountModal from "../../Components/DiscountModal/DiscountModal";
import SearchSection from "../../Components/CustomerAndProductSearch/CustomerAndProductSearch";
import Footer from "../../Components/Footer/footer";
import NewFooter from "../../Components/NewFooter/Footer";
import Header from "../../Components/Header/Header";
import AddOpenItemView from "../../Components/addOpenItemView/addOpenItemView";
import Categories from "../../Components/Categories/Categories";
import logo from "../../assets/images/GifLoader.gif";
import MoneyInMoneyOutModal from "../../Components/MoneyInMoneyOutModal/MoneyInMoneyOutModal";
import SellingItem from "../../Components/SellingItems/SellingItems";
import CustomerDetailsModal from "../../Components/CustomerDetailsModal/CustomerDetailsModal";
import "./Home.css";
import { getItem, getTotal } from "../../oscar-pos-core/constants";
import { searchedOrders } from "../../oscar-pos-core/reducers";
import { formatNum, uuid } from "../../oscar-pos-core/constants";
import db from "../../db/product";
import { CustomerSchema } from "../../db/Schema";
import {
  USER,
  PRODUCT,
  SESSION,
  CUSTOMER
} from "../../oscar-pos-core/actions/types";
// import PouchDB from 'pouchdb';
// import Products from "../../LocalDB/products";

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

const colors = ["#32C6E9", "#FEBF21", "#FB7447", "#D7E60A", "#5A2C8C"];

let homeThis = {};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      orderID: "",
      searchItemText: "",
      searchedProducts: [],
      badgeNum: 0,
      addedProducts: [],
      charge: "0.00",
      chargeData: {},
      discountModalFlag: false,
      discountRatioModalFlag: false,
      discountRSModalFlag: false,
      discountRs: "",
      discountedAmount: 0,
      isProductDiscount: false,
      productForDiscount: null,
      searchingLoading: false,
      searchOrderText: "",
      showOrders: false,
      searchedView: false,
      cartLength: 0,
      searchCustomerFlag: false,
      searchProductFlag: true, //because if user focus on input field so product will search by default.
      showSnackbar: false,
      calculatorSelect: true,
      customAmount: "0",
      isCartView: false,
      isMoneyInMoneyOutModal: false,
      showDetails: false,
      showUpdateCustomer: false
    };
    homeThis = this;
    this.inputValue = "";
    this.timmerRef = {};
    this.deleteBtn = {};
  }
  componentWillUnmount() {
    // clearInterval(this.timmerRef);
  }
  componentDidMount() {
    /* for inserting products into database */
    // console.log("all Products: ", Produts);
    // console.log('all products: ', Products);
    // let newProducts =[];
    // Products.map(product=>{
    //   product['_id'] = `${product.id}`;
    //   newProducts.push(product);
    // })
    // console.log('new Products: ', newProducts);
    // db.insertBulk(newProducts);
    // db.deleteAllProducts();
    // db.getProductsFromDb();
    /* for inserting products into database */

    // db.createIndexing();
    // let obj = {
    //   id: "",
    //   user_id: "",
    //   name: "",
    //   phone: "",
    //   email: "",
    //   address: "",
    //   total_outstanding_payment: "",
    //   loyalty_points: 0
    //   // birthDate
    // };
    // let customerObjKeys = Object.keys(obj);
    // console.log("customerObjKeys: ", customerObjKeys);
    // for (let i in CustomerSchema.properties) {
    //   if (customerObjKeys.indexOf(i) !== -1) {
    //     console.log("property found: ", i, customerObjKeys.indexOf(i));
    //   } else {
    //     console.log("property not found: ", i);
    //   }
    // }

    // localStorage.setItem("open_item_id", JSON.stringify(89835));
    // this.props.dispatch({
    //   type: SESSION.SET_POS_SESSION_ID,
    //   data: this.props.pos_session_id
    // });
    this.populateCart();

    let discount_product = {
      product_tmpl_id: [91303, "Discount"],
      tracking: "none",
      list_price: 1,
      description: false,
      pos_categ_id: false,
      price: 1,
      barcode: "191303",
      item_code: "191303",
      kitchen_code: false,
      uom_id: [1, "Unit(s)"],
      allow_custom_price: false,
      default_code: false,
      product_modifiers: [],
      to_weight: false,
      display_name: "Discount",
      description_sale: false,
      id: 89834,
      _id: 89834,
      taxes_id: []
    };
    // if (this.props.user === null) {
    //   if ("user" in localStorage) {
    //     console.log("from home user in localstorage");
    //     let user = JSON.parse(localStorage.getItem("user"));
    //     if (user) {
    //       console.log("user: ", user);
    //       this.props.dispatch({
    //         type: USER.GET_USER,
    //         data: user
    //       });
    //     }
    //   }
    // }
    if (!discount_product) {
      // localStorage.setItem("discount_product", JSON.stringify(forSaving));
    }
  }

  static getDerivedStateFromProps = nextProps => {
    console.log("from home getDrivedStateFromProps: ", nextProps);
    if (nextProps.emptyCartFlag) {
      homeThis.populateCart();
      nextProps.dispatch(clearEmptyCartFlag());
    }
    return null;
  };

  //searching product
  searchItem = event => {
    let { value } = event.target;
    console.log("check isNaN: ", isNaN(value));
    if (value.length == 0) {
      this.props.dispatch({
        type: PRODUCT.CLEAR_SEARCHED_PRODUCTS
      });
    }
    // if (value.length > 0) {
    //   this.setState({ searchingLoading: true });
    //   setTimeout(() => {
    //     this.props.dispatch(productSearchingQuery(null, value)).then(data => {
    //       this.setState({ searchingLoading: false });
    //     });
    //   }, 500);
    // }
    this.setState({
      searchItemText: value
    });
  };

  resetSearchItemText = () =>{
    this.setState({searchItemText: ""});
  }

  setSearchingTextForCustomer = e => {
    let { value } = e.target;
    this.setState({ searchItemText: value });
  };
  //searching customers
  searchCustomer = e => {
    // if (!value.length) {
    //   this.setState({ showSearchCustomer: false });
    // }
    let { searchItemText } = this.state;
    if (searchItemText.length > 0) {
      this.setState({ searchingLoading: true });
      this.props
        .dispatch(
          customerSearchingQuery(null, searchItemText, this.props.user.id)
        )
        .then(response => {
          console.log("response from searching customer: ", response);
          this.setState({ searchingLoading: false });
        })
        .catch(error => {
          console.log("error form searching customer: ", error);
        });
    }
  };

  switchToCustomerSearching = () => {
    this.setState({ searchProductFlag: false, searchCustomerFlag: true });
  };

  switchToProductSearching = () => {
    this.setState({ searchCustomerFlag: false, searchProductFlag: true });
  };

  searchOrder = event => {
    let { value } = event.target;
    this.setState({
      searchOrderText: value
    });
    if (value.length > 0) {
      this.setState({ searchingLoading: true });
      this.props.dispatch(orderSearchingQuery(null, value)).then(data => {
        this.setState({
          searchingLoading: false,
          showOrders: data.length ? true : false
        });
      });
    }
    if (value.length === 0) {
      this.setState({ showOrders: false });
    }
  };

  populateCart() {
    // console.log('cart: ', cart)
    let virtualCart = [];
    let { addedProducts } = this.state,
      objForSlide = {};
    for (let i = 0; i < addedProducts.length; i++) {
      if (addedProducts[i].isSlide === true) {
        objForSlide[addedProducts[i].product_id] = true;
      }
    }
    let { products, cart } = this.props;
    let charge = 0;
    for (let key in cart) {
      var cartProd = products.find((product, i) => {
        return product.id == key || product.id == parseInt(key);
      });
      console.log("cartProd***************** : ", cartProd);
      console.log("cart[key]***************** : ", cart[key]);
      var data = {
        product_id: (cartProd && cartProd._id) || cart[key].id || cart[key]._id,
        price_unit: (cartProd && cartProd.price) || cart[key].price,
        name: cartProd ? cartProd.display_name : "Open Item",
        qty: cart[key].qty,
        price_subtotal: cart[key].price
          ? cart[key].price * cart[key].qty
          : cart[key].qty * cartProd.price,
        isSlide:
          (objForSlide[key] && objForSlide[key]) ||
          (objForSlide[cart[key].id] && objForSlide[cart[key].id]) ||
          false
      };
      if (!cartProd) {
        data.uuid = key;
      }
      if (cart[key].discount) {
        let discount = cart[key].discount;
        let discount_type = cart[key].discount_type;
        data.discount = discount;
        data.discount_type = discount_type;
        data.price_subtotal =
          discount_type === "rs"
            ? data.price_subtotal - discount
            : data.price_subtotal - (data.price_subtotal * discount) / 100;
      }

      virtualCart.push(data);
    }
    let totalCharge = getTotal(this.props.cart, this.props.products);
    let count = 0;
    console.log("totalCharge: ", totalCharge);
    for (let i in cart) {
      count += cart[i].qty;
    }
    this.setState(
      {
        addedProducts: virtualCart,
        charge: totalCharge,
        discountRSModalFlag: false,
        discountRatioModalFlag: false,
        cartLength: count
      },
      () => {
        console.log("addedProducts: ", this.state.addedProducts);
      }
    );
    return virtualCart;
  }

  addProductInCart = (e, product) => {
    e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation()
    console.log("this.props.pos_session_id: ", this.props.pos_session_id);
    console.log("product: ", product);
    if (this.props.pos_session_id) {
      //see either session is open or not
      console.log("product: ", product);
      this.setState({ showSnackbar: true });
      toast.success("1 Item Added", {
        position: toast.POSITION.BOTTOM_LEFT
      });
      this.props.dispatch(
        addProduct(product.uuid || product._id || product.product_id)
      );
      setTimeout(() => {
        this.populateCart();
      });
    } else {
      alert("please open the session");
    }
  };

  handleCloseSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  //for navigate to payment screen
  navigateToPayment = () => {
    // console.log("this.props.history: ", this.props);
    this.props.history.push("payment");
  };

  //add discount modal handler
  handleDiscountModal = product => {
    let { charge } = this.state;
    // if (charge) {
    console.log("handle discount modal: ", this.state.discountModalFlag);
    this.setState({ discountModalFlag: !this.state.discountModalFlag });
    // } else {
    //   alert("your current charges are 0.00");
    // }
  };

  //add discount in ratio modal handler
  handleDiscountRatioModal = () => {
    console.log("handle discount ratio modal: ");
    this.setState({
      discountModalFlag: false,
      discountRatioModalFlag: !this.state.discountRatioModalFlag,
      discount_type: "%"
    });
  };

  //add discount in Rupees modal handler
  handleDiscountRSModal = () => {
    console.log("request for discount ", this.state.discountRSModalFlag);

    this.setState({
      discountRSModalFlag: !this.state.discountRSModalFlag,
      discountModalFlag: false,
      discount_type: "rs",
      discountRs: ""
    });
  };

  //apply discount on product new UI function
  applyDiscountOnProduct = (discountAmount, discountType) => {
    console.log(
      "add item discount on new UI: ************************",
      discountAmount
    );
    let { productForDiscount, isProductDiscount } = this.state;
    if (isProductDiscount && productForDiscount) {
      this.props.dispatch(
        addDiscountOnItem({
          id: productForDiscount.uuid || productForDiscount.product_id,
          discount: discountAmount,
          discount_type: discountType
        })
      );
      // this.populateCart();
      this.setState(
        {
          discountRSModalFlag: false,
          discountModalFlag: false,
          discountRatioModalFlag: false,
          productForDiscount: null,
          isProductDiscount: false
        },
        () => {
          this.populateCart();
        }
      );
    }
  };
  //add discount in percentage
  addDiscount = discountAmount => {
    let { isProductDiscount, productForDiscount, discount_type } = this.state;
    if (isProductDiscount && productForDiscount && this.state.charge) {
      this.props.dispatch(
        addDiscountOnItem({
          id: productForDiscount.uuid || productForDiscount.product_id,
          discount: discountAmount,
          discount_type
        })
      );
      // this.populateCart();
      this.setState(
        {
          discountRSModalFlag: false,
          discountModalFlag: false,
          discountRatioModalFlag: false,
          productForDiscount: null,
          isProductDiscount: false
        },
        () => {
          this.populateCart();
        }
      );
    } else {
      if (this.state.charge) {
        let discountProduct = {
          product_tmpl_id: [91303, "Discount"],
          tracking: "none",
          list_price: 1,
          description: false,
          pos_categ_id: false,
          price: 1,
          barcode: "191303",
          item_code: "191303",
          kitchen_code: false,
          uom_id: [1, "Unit(s)"],
          allow_custom_price: false,
          default_code: false,
          product_modifiers: [],
          to_weight: false,
          display_name: "Discount",
          description_sale: false,
          id: 89834,
          _id: 89834,
          taxes_id: []
        };
        let total = this.props.cart[discountProduct.id]
          ? getTotal(this.props.cart, this.props.products) +
            Math.abs(this.props.cart[discountProduct.id].price)
          : getTotal(this.props.cart, this.props.products);

        console.log("totoal before dispatching : ", total);
        let price =
          discount_type === "rs"
            ? discountAmount
            : (discountAmount * total) / 100;
        this.props.dispatch(
          addDiscountProduct(discountProduct.id, price - price * 2)
        );
        setTimeout(() => {
          this.populateCart();
        }, 100);
      } else {
        this.setState({
          discountModalFlag: false,
          discountRatioModalFlag: false,
          isProductDiscount: false
        });
      }
    }
  };

  //add discount in rupees
  addDiscountInRs = () => {
    let {
      charge,
      discountRs,
      isProductDiscount,
      productForDiscount,
      discount_type
    } = this.state;
    if (isProductDiscount && productForDiscount) {
      this.props.dispatch(
        addDiscountOnItem({
          id: productForDiscount.uuid || productForDiscount.product_id,
          discount: discountRs,
          discount_type
        })
      );
      this.populateCart();
      this.setState({
        discountRSModalFlag: false,
        discountModalFlag: false,
        productForDiscount: null,
        isProductDiscount: false
      });
    } else {
      let discountProduct = {
        product_tmpl_id: [91303, "Discount"],
        tracking: "none",
        list_price: 1,
        description: false,
        pos_categ_id: false,
        price: 1,
        barcode: "191303",
        item_code: "191303",
        kitchen_code: false,
        uom_id: [1, "Unit(s)"],
        allow_custom_price: false,
        default_code: false,
        product_modifiers: [],
        to_weight: false,
        display_name: "Discount",
        description_sale: false,
        id: 89834,
        _id: 89834,
        taxes_id: []
      };
      let total = this.props.cart[discountProduct.id]
        ? getTotal(this.props.cart, this.props.products) +
          Math.abs(this.props.cart[discountProduct.id].price)
        : getTotal(this.props.cart, this.props.products);

      console.log("totoal before dispatching : ", total);
      let price =
        discount_type === "rs" ? discountRs : (discountRs * total) / 100;
      this.props.dispatch(
        addDiscountProduct(discountProduct.id, price - price * 2)
      );
      setTimeout(() => {
        this.populateCart();
      }, 100);
    }
  };

  //delete product from cart and addedProduct handler
  deleteProductFromCart = (e, product) => {
    e.stopPropagation();
    // e.stopImmediatePropagation();
    let cartKeys = Object.keys(this.props.cart);
    if (cartKeys.length == 2) {
      setTimeout(() => {
        this.populateCart();
      }, 150);
    }
    this.props.dispatch(
      removeProductFromCart(product.uuid || product.product_id)
    );
    this.populateCart();
  };

  //add discount on product
  addDiscountOnProduct = (e, product) => {
    e.stopPropagation();
    // this.makeViewFalse(i)
    // e.nativeEvent.stopImmediatePropagation();
    console.log("product: ", product);
    this.setState(
      { isProductDiscount: true, productForDiscount: product },
      () => {
        this.handleDiscountModal();
      }
    );
  };

  //add globle discount
  addGlobleDiscount = () => {
    this.setState({ isProductDiscount: false }, () => {
      this.handleDiscountModal();
    });
  };

  //decrement product quantity
  decrementProductQty = (e, product) => {
    e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    if (product.qty > 1) {
      this.props.dispatch(decQty(product.uuid || product.product_id));
      this.populateCart();
    }
  };

  //this function called by header for toggling search view
  toggleSearchView = () => {
    this.setState({
      searchedView: !this.state.searchedView,
      calculatorSelect: false
    });
  };
  //this function called by header for clearing the inputfield
  clearInput = () => {
    this.setState({ searchItemText: "" });
  };

  //this will show customer info
  showCustomerInfoModal = customer => {
    console.log("customer: ", customer);
  };

  //this function switch the main screen from searching screen
  showHomeContent = () => {
    this.setState({
      searchedView: false,
      searchCustomerFlag: false,
      searchProductFlag: true,
      searchItemText: "",
      calculatorSelect: true,
      isCartView: false
    });
  };

  //this function update the inserted amount accordingly input
  addCustomAmount = num => {
    let { customAmount } = this.state;
    switch (num) {
      case "+":
        break;
      case "C":
        customAmount = "";
        break;
      default: {
        if (customAmount === "0") {
          customAmount = "";
        }
        if (customAmount.toString().length <= 6) {
          customAmount += num;
        }
      }
    }
    this.setState({ customAmount });
  };

  //for adding the custom product in cart
  addCustomProduct = () => {
    let { customAmount } = this.state;
    if (customAmount > 0) {
      let value = "89835";
      let data = {
        uuid: uuid(),
        id: parseInt(value),
        _id: parseInt(value),
        price: parseInt(customAmount)
      };
      this.props.dispatch(addCustomProduct(data));
      setTimeout(() => {
        this.populateCart();
      });
      this.setState({ customAmount: "" });
    }
  };

  //for sliding the icons view
  toggleSlide = index => {
    let { addedProducts } = this.state;
    for (let i = 0; i < addedProducts.length; i++) {
      if (index == i) {
        console.log("onClick on col-2:: ", addedProducts[i]);
        addedProducts[i].isSlide === undefined ||
        addedProducts[i].isSlide === false
          ? (addedProducts[i].isSlide = true)
          : (addedProducts[i].isSlide = true);
        this.setState({ addedProducts });
        break;
      }
    }
  };

  makeViewFalse = index => {
    let { addedProducts } = this.state;
    for (let i = 0; i < addedProducts.length; i++) {
      if (index == i) {
        console.log("onClick on col-2:: ", addedProducts[i]);
        addedProducts[i].isSlide == undefined
          ? (addedProducts[i].isSlide = false)
          : (addedProducts[i].isSlide = false);
        this.setState({ addedProducts });
        break;
      }
    }
  };

  //make isProductDiscount false
  toggleToGlobleDiscount = () => {
    this.setState({ isProductDiscount: false });
  };

  handleError = error => {
    console.error(error);
  };
  handleScan = data => {
    console.log(data);
    this.props.dispatch(productSearchingQuery(null, data)).then(data => {
      console.log("data **************: ", data);
      if (data.length) {
        this.addProductInCart(data[0]);
      } else {
        alert("Item not fount");
      }
    });
  };

  //set cart items view
  setCartView = () => {
    this.setState(
      {
        isCartView: true,
        searchedView: false,
        searchCustomerFlag: false,
        searchProductFlag: true,
        searchItemText: "",
        calculatorSelect: false
      },
      () => {
        console.log("isCartView: ", this.state.isCartView);
      }
    );
  };

  //enter press on input field add item if it only one
  enterPress = key => {
    let { searchedProducts } = this.props;
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
    if (key == "Enter") {
      if (searchedProducts.length == 1) {
        this.addProductInCart(searchedProducts[0]);
        return;
      }
      console.log("enter pressed");

      var fuseRef = new Fuse(this.props.products, options);
      var result = fuseRef.search(this.state.searchItemText);
      console.log("result: ", result.slice(0, 20));
      this.props.dispatch({
        type: PRODUCT.SEARCHED_PRODUCT,
        data: result.slice(0, 20)
      });
    }
  };

  //toggle moneyIn moneyOut modal
  showMoneyInMoneyOutModal = () => {
    this.setState({
      isMoneyInMoneyOutModal: !this.state.isMoneyInMoneyOutModal
    });
  };
  cleanCustomAmount = () => {
    this.setState({ customAmount: "0" });
  };

  //add money in or money out
  moneyInOrMoneyOut = obj => {
    let { amount, method, reason } = obj;
    let param = {
      id: uuid(),
      user_id: "1",
      pos_session_id: this.props.pos_session_id,
      amount: parseInt(amount),
      reason
    };
    return new Promise((resolve, reject) => {
      if (method === "moneyin") {
        console.log("params: ", param);
        this.props
          .dispatch(submitMoneyIn(null, param))
          .then(data => {
            console.log("add opening balance");
            this.setState({ isMoneyInMoneyOutModal: false });
            resolve(data);
          })
          .catch(error => {
            console.error("error add openin balance: ", error);
            reject(error);
          });
      } else {
        this.props
          .dispatch(submitMoneyOut(null, param))
          .then(data => {
            console.log("add closing balance");
            this.setState({ isMoneyInMoneyOutModal: false });
            resolve(data);
          })
          .catch(error => {
            console.error("error add closing balance: ", error);
            reject(error);
          });
      }
    });
  };
  //open pos session
  openSession = () => {
    console.log("open session");

    return new Promise((resolve, reject) => {
      this.props
        .dispatch(openPosSession(null, this.props.user.id))
        .then(data => {
          console.log("pos_session_open: ", data);
          resolve(data);
        })
        .catch(error => {
          console.log("error pos_session_open: ", error);
          reject(error);
        });
    });
  };

  //close pos session
  closeSession = () => {
    this.props.history.push("closeSession");
    // let this.props.pos_session_id = JSON.parse(localStorage.getItem('this.props.pos_session_id'));
    // this.props.dispatch(close_pos_session(null, this.props.pos_session_id, 1)).then(data=>{
    //   console.log('now session is closed: ', data);
    //   localStorage.setItem('this.props.pos_session_id', null);
    // })
    // .catch(error=>{
    //   console.log('error session close: ', error);
    // })
  };

  navigateToBillAmount = () => {
    if (this.cartLength) {
      this.props.history.push("/payment");
      // this.props.history.push("/billamount");
    }
  };

  clearCart = () => {
    this.props.dispatch(emptyCart());
    setTimeout(() => {
      this.props.dispatch(setEmptyCartFlag());
      this.props.dispatch({
        type: CUSTOMER.RESET_CUSTOMER_FOR_ORDER
      });
    }, 100);
  };

  showDetails = customer => {
    this.props.dispatch(
      getCreditHistory(null, this.props.setCustomerForOrder.id)
    ); //start from there
    // this.setState({ customerObj: customer }, () => {
    this.toggleShowDetails();
    // });
  };

  toggleShowDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };
  editCustomer = customer => {
    this.setState({
      // customerObj: customer,
      showDetails: !this.state.showDetails,
      editMode: true,
      showUpdateCustomer: !this.state.showUpdateCustomer
    });
  };
  render() {
    this.cartLength = Object.keys(this.props.cart).length;
    console.log("this.state: ", this.state);
    // for displaying searched products;
    //this view toggled by header input field
    if (this.state.searchedView) {
      return (
        <main
          className="home-main"
          style={{
            gridTemplateRows: this.state.searchCustomerFlag
              ? "0.1fr 0.9fr"
              : "0.1fr 0.9fr"
          }}
        >
          <Header
            onChange={
              this.state.searchCustomerFlag
                ? this.setSearchingTextForCustomer
                : this.searchItem
            }
            emptyInput = {this.resetSearchItemText}
            showHomeContent={this.showHomeContent}
            toggleSearchView={this.toggleSearchView}
            searchedView={this.state.searchedView}
            clearInput={this.clearInput}
            searchItemText={this.state.searchItemText}
            searchCustomerFlag={this.state.searchCustomerFlag}
            searchProductFlag={this.state.searchCustomerFlag}
            switchToCustomerSearching={this.switchToCustomerSearching}
            switchToProductSearching={this.switchToProductSearching}
            enterPress={
              this.state.searchCustomerFlag
                ? this.searchCustomer
                : this.enterPress
            }
            history={this.props.history}
          />
          <SearchSection
            searchingLoading={this.state.searchingLoading}
            searchItemText={this.state.searchItemText}
            searchProductFlag={this.state.searchProductFlag}
            addProductInCart={(e, product) => this.addProductInCart(e, product)}
            searchCustomerFlag={this.state.searchCustomerFlag}
          />
          {/* <NewFooter
            history={this.props.history}
            searchCustomerFlag={this.state.searchCustomerFlag}
            cartLength={this.state.cartLength}
            showHomeContent={this.showHomeContent}
            handleDiscountModal={this.handleDiscountModal}
            navigateToPayment={this.navigateToPayment}
            charge={this.state.charge}
            calculatorSelect={this.state.calculatorSelect}
            setCartView={this.setCartView}
            isCartView={this.state.isCartView}
          /> */}
          {/* snackbar dispaly when ever item added into cart */}
          <div />
        </main>
      );
    }
    /* ******************************************* This work for order searching ******************** */
    if (this.props.searchedOrders.length > 0 && this.state.showOrders) {
      console.log(
        "from orders block: ****************************************S"
      );
      return (
        <div className="home-main">
          <Header
            history={this.props.history}
            onChange={this.searchItem}
            orderOnChange={this.searchOrder}
            searchedView={this.state.searchedView}
          />
          {/* Home body */}
          <section
            style={{
              height: "80vh",
              overflow: "scroll",
              overflowY: "scroll",
              overflowX: "hidden"
            }}
          >
            {this.state.searchingLoading ? (
              <div className="no-product-home">
                {/* <Loader type="Grid" color="#d051fa" height={50} width={50} /> */}
                <img width={"50px"} src={logo} alt="giflogo" />
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 0.2fr)"
                  }}
                >
                  <div>Date &amp time</div>
                  <div>OrderID</div>
                  <div>CustomerID</div>
                  <div>Order Status</div>
                  <div>Total Amount</div>
                </div>
                {this.props.searchedOrders.map(order => {
                  return (
                    <div
                      key={order.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 0.2fr)"
                      }}
                    >
                      <div>{order.creation_date}</div>
                      <div>{order.id}</div>
                      <div>CustomerID</div>
                      <div>Order Status</div>
                      <div>{order.amount_total}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <Footer
            handleDiscountModal={this.handleDiscountModal}
            navigateToPayment={this.navigateToPayment}
            charge={this.state.charge}
          />

          {/* *********************** Discount Modal **************************** */}

          <DiscountModal
            show={this.state.discountModalFlag}
            onHide={this.handleDiscountModal}
            handleDiscountRatioModal={this.handleDiscountRatioModal}
            handleDiscountRSModal={this.handleDiscountRSModal}
          />

          {/* *********************** Discount In Ratio Modal ************************* */}

          <DiscountInRatioModal
            show={this.state.discountRatioModalFlag}
            onHide={this.handleDiscountRatioModal}
            addDiscountTen={value => this.addDiscount(value)}
            addDiscountQuater={value => this.addDiscount(value)}
            addDiscountHalf={value => this.addDiscount(value)}
          />

          {/* *********************** Discount In Rupees Modal **************************** */}

          <DiscountInRupeesModal
            show={this.state.discountRSModalFlag}
            onHide={this.handleDiscountRSModal}
            onChange={e => this.setState({ discountRs: e.target.value })}
            onClick={() => this.addDiscountInRs()}
            clearAmount={() => this.setState({ discountRs: "" })}
          />
        </div>
      );
    }

    /* ******************************************* This work for order searching ******************** */

    return (
      <div className="home-main">
        <Header
          history={this.props.history}
          onChange={this.searchItem}
          enterPress={this.enterPress}
          orderOnChange={this.searchOrder}
          toggleSearchView={this.toggleSearchView}
          searchedView={this.state.searchedView}
          addGlobleDiscount={this.addGlobleDiscount}
          showMoneyInMoneyOutModal={this.showMoneyInMoneyOutModal}
          openSession={this.openSession}
          closeSession={this.closeSession}
        />
        {/* Home body */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            height: "90vh"
          }}
        >
          <SellingItem
            addProductInCart={(e, product) => {
              this.addProductInCart(e, product);
            }}
          />
          {this.state.isCartView ? (
            <Categories
              addProductInCart={(e, product) =>
                this.addProductInCart(e, product)
              }
            />
          ) : (
            <AddOpenItemView
              toggleShowDetails={this.showDetails}
              history={this.props.history}
              addCustomAmount={data => this.addCustomAmount(data)}
              customAmount={this.state.customAmount}
              addCustomProduct={this.addCustomProduct}
              cleanCustomAmount={this.cleanCustomAmount}
              addGlobleDiscount={this.addGlobleDiscount}
            />
          )}
          <div
            style={{
              height: "80vh"
            }}
          >
            {this.state.addedProducts && this.state.addedProducts.length ? (
              <div
                style={{
                  borderLeft: "3px solid rgb(240, 242, 241)",
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: "3px solid #f0f2f1"
                }}
              >
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
                      color: "#efefef"
                    }}
                  >
                    <div>
                      <img
                        width="35px"
                        style={{
                          width: "25px",
                          marginRight: "7px",
                          marginBottom: "2px"
                        }}
                        src={require("../../assets/images/newicons/SaveCart.svg")}
                      />
                    </div>
                    <div>Save Cart</div>
                  </div>
                  <div
                    className="back-btn"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "16px",
                      borderLeft: "1px solid rgb(240, 242, 241)",
                      borderBottom: "1px solid rgb(240, 242, 241)",
                      cursor: "pointer"
                    }}
                    onClick={this.clearCart}
                  >
                    <div>
                      <img
                        width="35px"
                        style={{
                          width: "25px",
                          marginRight: "7px",
                          marginBottom: "2px"
                        }}
                        src={require("../../assets/images/newicons/ClearCart.svg")}
                      />
                    </div>
                    <div>Clear Cart</div>
                  </div>
                </div>
                {/* <div
                  onClick={() =>
                    this.props.setCustomerForOrder
                      ? this.props.history.push("/customerInfoScreen")
                      : this.props.history.push("/customers")
                  }
                  style={{
                    ...styles.center,
                    fontSize: "18pt",
                    color: "#00aeef",
                    cursor: "pointer",
                    height: "10vh"
                  }}
                >
                  <div>
                    <img
                      src={require("../../assets/images/icons/person-color.svg")}
                    />
                  </div>
                  {this.props.setCustomerForOrder
                    ? this.props.setCustomerForOrder.name
                    : "Add Customer"}
                </div> */}
                <div
                  style={{
                    overflow: "scroll",
                    overflowY: "scroll",
                    overflowX: "hidden",
                    height: "70vh"
                  }}
                >
                  {this.state.addedProducts.map((product, i) => {
                    return (
                      <div
                        key={i}
                        className="searched-list"
                        style={{
                          gridTemplateColumns: "0.1fr 1fr",
                          height: "10vh",
                          borderBottom: "1px solid rgb(240, 242, 241)"
                        }}
                        onMouseLeave={() => this.makeViewFalse(i)}
                      >
                        <div
                          className="searched-list-col-1"
                          style={{
                            height: "100%",
                            width: "12vh",
                            padding: "0"
                          }}
                          // onMouseOver={() => this.makeViewFalse(i)}
                        >
                          {product.qty}
                        </div>
                        <div
                          onClick={
                            product.name === "Discount"
                              ? () =>
                                  toast.warn("Warning Notification !", {
                                    position: toast.POSITION.BOTTOM_LEFT
                                  })
                              : () => this.toggleSlide(i)
                          }
                          className="searched-list-col-2"
                          style={{
                            // background: "#f1f2f2",
                            gridTemplateColumns: "1fr",
                            fontSize: "13px",
                            // fontWeight: "bold",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%"
                            }}
                          >
                            <div>
                              <div>
                                {product.name === "Discount"
                                  ? "Global Discount"
                                  : product.name.toString().length > 31
                                  ? `${product.name.slice(0, 31)}...`
                                  : product.name}
                              </div>
                            </div>
                            <div style={{ fontSize: "20px" }}>
                              <span>
                                Rs. {Number(product.price_subtotal).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "rgb(167, 169, 172)",
                              fontWeight: "lighter",
                              width: "100%"
                            }}
                          >
                            {/* Unit Rs. {product.price_unit}.00 */}
                            <div
                              style={{
                                fontSize: "12px",
                                color: "rgb(167, 169, 172)",
                                fontWeight: "lighter"
                              }}
                            >
                              {product.discount && product.discount_type ? (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                  }}
                                >
                                  <div>
                                    <img
                                      width={"15px"}
                                      src={require("../../assets/images/icons/discount.svg")}
                                    />
                                    <span style={{ marginLeft: "5px" }}>
                                      Special Discount
                                    </span>
                                  </div>
                                  <div style={{ textTransform: "capitalize" }}>
                                    {product.discount_type}.{product.discount}
                                  </div>
                                </div>
                              ) : (
                                <span />
                              )}
                            </div>
                          </div>
                          <div
                            // onMouseOut={() =>{
                            //   setTimeout(()=>{
                            //     this.toggleSlide(i)
                            //   }, 300)
                            // }}

                            style={{
                              display: "flex",
                              position: "absolute",
                              right: product.isSlide ? "0px" : "-449px",
                              height: "100%",
                              width: "121%",
                              background: "#fff",
                              transition: "0.5s",
                              zIndex: 1
                              // display:'none'
                              // flexDirection: "row-reverse",
                              // justifyContent: "space-between"
                            }}
                          >
                            {product.name === "Discount" ? (
                              <span />
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  width: "100%"
                                }}
                              >
                                <div style={{ display: "flex", width: "20%" }}>
                                  <div
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                      borderRadius: "0",
                                      backgroundColor: "#5d5d5d",
                                      border: "0",
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center"
                                    }}
                                    // onBlur={() => alert("onblur triggered")}
                                    onClick={e =>
                                      this.addDiscountOnProduct(e, product)
                                    }
                                    clickFocus={false}
                                    ref={deleteBtn =>
                                      (this.deleteBtn = deleteBtn)
                                    }
                                  >
                                    <img
                                      width="15px"
                                      src={require("../../assets/images/product-discount-icon.svg")}
                                    />
                                  </div>
                                </div>
                                <div
                                  style={{
                                    width: "60%",
                                    backgroundColor: "#958cdc"
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      height: "100%",
                                      width: "100%",
                                      // border: "1px solid",
                                      // marginRight: "15px",
                                      color: "#fff",
                                      backgroundColor: "#958cdc"
                                    }}
                                  >
                                    {/* <div> */}
                                    <div
                                      onClick={e =>
                                        this.addProductInCart(e, product)
                                      }
                                      title="increment"
                                      style={{
                                        height: "100%",
                                        fontSize: 30,
                                        width: "33.33%",
                                        borderRadius: "0",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        userSelect: "none"
                                      }}
                                    >
                                      +
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        fontSize: 30,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        width: "33.33%",
                                        userSelect: "none"
                                      }}
                                    >
                                      {product.qty}
                                    </div>
                                    <div
                                      onClick={e =>
                                        this.decrementProductQty(e, product)
                                      }
                                      title="decrement"
                                      style={{
                                        height: "100%",
                                        fontSize: 30,
                                        width: "33.33%",
                                        borderRadius: "0",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        userSelect: "none"
                                      }}
                                    >
                                      -
                                    </div>
                                    {/* </div> */}
                                  </div>
                                </div>
                                <div style={{ display: "flex", width: "20%" }}>
                                  <div
                                    style={{
                                      textAlign: "center",
                                      height: "100%",
                                      width: "100%",
                                      borderRadius: "0",
                                      backgroundColor: "#ed1c24",
                                      border: "0",
                                      // margin: "0 3px",
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      userSelect: "none"
                                    }}
                                  >
                                    <img
                                      onClick={e =>
                                        this.deleteProductFromCart(e, product)
                                      }
                                      width="20px"
                                      src={require("../../assets/images/delete-icon.svg")}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f0f2f1",
                    color: "#58595b",
                    fontWeight: "bold",
                    padding: "0 2em"
                  }}
                  >
                  <div>Taxes</div>
                  <div>Rs. 0</div>
                </div> */}
                <div
                  onClick={this.navigateToBillAmount}
                  style={{
                    height: "10vh",
                    fontSize: "23px",
                    color:
                      // this.state.charge
                      this.cartLength > 0 ? "#fff" : "#d1d3d4",
                    fontWeight: "500",
                    background:
                      // this.state.charge
                      this.cartLength > 0 ? "#d7df23" : "#fff",
                    width: "100%",
                    // height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {// this.state.charge
                  this.cartLength > 0 ? (
                    <span>
                      Charge Rs.
                      {formatNum(
                        Math.abs(Number(this.state.charge)).toFixed(2)
                      )}
                    </span>
                  ) : (
                    <span>Rs.{this.state.charge}</span>
                  )}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "1em"
                }}
                className="no-product-home"
              >
                <div>
                  <img
                    className="basket-image"
                    width="145px"
                    src={require("../../assets/images/cart-icon.svg")}
                  />
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "17pt",
                    marginTop: "1em"
                  }}
                >
                  Add Items Using <br />
                  Barcode Scanner or Search
                </div>
              </div>
            )}
            {this.state.discountedAmount ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.1fr 0.6fr 0.3fr",
                  borderBottom: "1px solid #e6e7e8"
                }}
              >
                <div style={{ background: "rgb(250, 251, 251)" }} />
                <div
                  className="searched-list-col-1"
                  style={{
                    background: "#fafbfb",
                    fontSize: "15pt",
                    fontWeight: "bold",
                    color: "#58595b",
                    alignItems: "left",
                    flexDirection: "column",
                    padding: "1em 0 1em 2em",
                    borderBottomWidth: "0px"
                  }}
                >
                  <div>Discount </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#a7a9ac",
                      fontWeight: "lighter",
                      backgroundColor: "rgb(250, 251, 251)"
                    }}
                  >
                    New Customer Discount (%10)
                  </div>
                </div>
                <div
                  className="searched-list-col-2"
                  style={{
                    background: "#f1f2f2",
                    flexDirection: "row-reverse",
                    backgroundColor: "rgb(250, 251, 251)",
                    fontWeight: "bold",
                    fontSize: "15pt"
                  }}
                >
                  <div>
                    <div>- Rs. {this.state.discountedAmount}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
        </section>

        {/* <Footer
          handleDiscountModal={this.handleDiscountModal}
          navigateToPayment={this.navigateToPayment}
          charge={this.state.charge}
        /> */}

        {/* <NewFooter
          history={this.props.history}
          searchCustomerFlag={this.state.searchCustomerFlag}
          cartLength={this.state.cartLength}
          charge={this.state.charge}
          showHomeContent={this.showHomeContent}
          handleDiscountModal={this.handleDiscountModal}
          navigateToPayment={this.navigateToPayment}
          charge={this.state.charge}
          calculatorSelect={this.state.calculatorSelect}
          setCartView={this.setCartView}
          isCartView={this.state.isCartView}
        /> */}

        {/* *********************** Create Update Customer ******************** */}

        <CreateCustomerModal
          show={this.state.showUpdateCustomer}
          onHide={() =>
            this.setState({
              showUpdateCustomer: !this.state.showUpdateCustomer,
              editMode: false
            })
          }
          resetShow={this.resetShow}
          customer={this.props.setCustomerForOrder}
          editMode={true}
          commingFromHome={true}
        />

        {/* *********************** Customer Detail *************************** */}

        <CustomerDetailsModal
          onHide={this.toggleShowDetails}
          customer={this.props.setCustomerForOrder}
          show={this.state.showDetails}
          openUpdateCustomerModal={customer => this.editCustomer(customer)}
          commingFromHome={true}
        />

        {/* *********************** Discount Modal **************************** */}
        <MoneyInMoneyOutModal
          show={this.state.isMoneyInMoneyOutModal}
          onHide={this.showMoneyInMoneyOutModal}
          moneyInOrMoneyOut={obj => this.moneyInOrMoneyOut(obj)}
          // isMoneyInOrMoneyOut = "moneyin"
        />
        {/* *********************** Discount Modal **************************** */}

        <DiscountModal
          applyDiscountOnProduct={(discountAmount, discountType) =>
            this.applyDiscountOnProduct(discountAmount, discountType)
          }
          addGlobleDiscount={this.addGlobleDiscount}
          productForDiscount={this.state.productForDiscount}
          isProductDiscount={this.state.isProductDiscount}
          show={this.state.discountModalFlag}
          onHide={this.handleDiscountModal}
          handleDiscountRatioModal={this.handleDiscountRatioModal}
          handleDiscountRSModal={this.handleDiscountRSModal}
        />

        {/* *********************** Discount In Ratio Modal ************************* */}

        <DiscountInRatioModal
          show={this.state.discountRatioModalFlag}
          onHide={this.handleDiscountRatioModal}
          addDiscountTen={value => this.addDiscount(value)}
          addDiscountQuater={value => this.addDiscount(value)}
          addDiscountHalf={value => this.addDiscount(value)}
        />

        {/* *********************** Discount In Rupees Modal **************************** */}

        <DiscountInRupeesModal
          show={this.state.discountRSModalFlag}
          onHide={this.handleDiscountRSModal}
          onChange={e => {
            console.log("e.target.value: ", e.target.value);
            console.log("this.state.charge: ", this.state.charge);
            if (e.target.value == 0) {
              this.setState({ discountRs: "" });
            }
            if (e.target.value > 0) {
              this.setState({ discountRs: e.target.value });
            }
          }}
          amount={this.state.discountRs}
          onClick={() => this.addDiscountInRs()}
          charge={this.state.charge}
          clearAmount={() => this.setState({ discountRs: "" })}
        />
        <ToastContainer autoClose={2000} />

        <BarcodeReader onError={this.handleError} onScan={this.handleScan} />
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
    searchedProducts: state.searchedProducts,
    emptyCartFlag: state.emptyCartFlag,
    searchedOrders: state.searchedOrders,
    searchedCustomers: state.searchedCustomers,
    user: state.userReducer,
    customerForOrder: state.setCustomerForOrder,
    setCustomerForOrder: state.setCustomerForOrder,
    pos_session_id: state.pos_session_id
  };
})(Home);
