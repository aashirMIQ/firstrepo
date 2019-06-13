import React from "react";
// import {
//   TouchableNativeFeedback,
//   Platform,
//   TouchableOpacity,
//   TouchableHighlight,
//   NetInfo
// } from "react-native";
// import { NavigationActions, StackActions } from 'react-navigation';

export const BASE_URL = "192.168.10.24:8069";

// export const Touchable = props => {
//   return Platform.OS === "android" ? (
//     <TouchableNativeFeedback
//       // onPress={props.onPress}
//       background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0.3)")}
//       disabled={props.disabled || false}
//       onPress={() => {
//         setTimeout(() => {
//           if (props.onPress) {
//             props.onPress();
//           }
//         })
//       }}
//     >
//       {props.children}
//     </TouchableNativeFeedback>
//   ) : (
//       <TouchableOpacity onPress={props.onPress}>
//         {props.children}
//       </TouchableOpacity>
//     );
// };

export const formatNum = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// export const toggleDrawer = navigation => () => {
//   // console.log('toggle drawer')
//   navigation.toggleDrawer();
// };

// export const isInternetConnected = () => {
//   return new Promise((resolve, reject) => {

//     NetInfo.isConnected.fetch().then(isConnected => {
//       console.log(isConnected, 'isConnected in did mount')
//       if (isConnected) {
//         resolve(isConnected)
//       }
//       else {
//         reject(isConnected)
//       }
//     })
//   })
// }

export var getTotal = (cart, products) => {
  let total = 0;
  for (let key in cart) {
    var cartProd = products.find(product => {
      // console.log('product:: ', product);
      return product.id == key || product.id == parseInt(key);
    });
    // console.log('cartProd, cart[key]::: ', cartProd, cart[key]);
    let price = cart[key].price || cartProd.price;
    total += cart[key].qty * price;
    if (cart[key].discount_type) {
      if (cart[key].discount_type === "rs") {
        total -= cart[key].discount;
      } else {
        total -= (cart[key].discount * (cart[key].qty * price)) / 100;
      }
    }
  }
  return total;
};

// export var resetRoutes = (navigation) => {
//   navigation.dispatch(
//     StackActions.reset({
//       index: 0,
//       actions: [NavigationActions.navigate({ routeName: "home" })]
//     })
//   );
// }
export var getCustomer = (partner_id, customers) => {
  var temp = customers.find(item => {
    return item.id === parseInt(partner_id);
  });

  return temp;
};

export var themeStyleSheet = {
  //Theme Color
  statusbarColor: "#552484",
  whitecolor: "#fff",
  //disableColor: "#d6cfd7",
  disableColor: "#ddd",
  containerColor: "#fafbfb",
  searchContMain: "#f5f5f6",
  searchTextColor: "#414042",
  searchTextColorupdate: "#cecece",
  iconLightColor: "#d1d3d4",
  SearchBoxDarkColor: "#8880b2",
  lightPurpleColor: "#615b81",
  productListBgColor: "#F1F2F2",
  productIntialColor: "#958CDC",
  productNameColor: "#58595B",
  productDetailTextColor: "#A7A9AC",
  productChargeBtn: "#D7DF23",
  addCutomerColor: "#00AEEF",
  paymentButton: "#EFEFEF",
  paymentButtonDisable: "#fbfbfb",
  udhaarButton: "#ffbc29",
  paymentButtonIcon: "#300F38",
  segmentBgColor: "#E6E7E8",
  switchDeactivatebg: "#BCBEC0",
  switchActivatebg: "#8DC63F",
  progressbarColor: "#a67be5",
  discountBtnBg: "#5D5D5D",
  addBtnBg: "#958CDC",
  voidBtnBg: "#FF9900",
  dltBtnBg: "#ED1C24",
  orderStatusText: "#FBB040",
  headerbgColor: "#662d94",
  qtyBorderColor: "#f0f1f5",
  removeBtBg: "#ea4335",
  cashButtonBg: "#31cfe8",
  disableBtn: "#f4f4f4",
  calculatorBorder: "#f0f1f1",
  disableColornew: "#dedede",
  greenColor: "#39b54a",
  udharAmunt: "#ff714a",
  customerPhoneNumber: "#575757",
  tableHeaderbg: "#fcfcfc",
  udhartableCell: "#e51a32",
  splashScreenBg: "#d14ffb",
  newBgColor: "#f2f3f3",
  payNowButton: "#27aae1",

  //Theme Color
  borderLightColor: "rgba(0,0,0,0.1)",

  // Font Family
  robotoFont: "robotoRegular",
  robotoBoldFont: "robotoBold",
  robotoBoldFont: "robotoBold",
  robotoLightFont: "robotoLight",
  robotoThinFont: "robotoThin",
  robotoMediumFont: "robotoMedium",

  // Header Styling
  headerHeight: 65,
  headerSingleColor: "#a180e2",

  // FONT SIZE
  fontSize16: 16,
  fontSize12: 12,
  fontSize14: 14,
  fontSize16: 16,
  fontSize18: 18,
  fontSize20: 20,
  fontSize22: 22,
  fontSize24: 24,
  fontSize26: 26,
  fontSize28: 28,
  fontSize30: 30,
  fontSize32: 32,
  fontSize34: 34,
  fontSize36: 36,
  fontSize38: 38,
  fontSize40: 40,
  fontSize42: 42,
  fontSize44: 44,
  fontSize46: 46,
  fontSize66: 66,
  fontSize70: 70,
  fontSize90: 90,
  fontSize120: 120,
  fontSize150: 150,

  //Padding
  padding: 0,
  paddingTen: 10,
  paddingTewelve: 12,
  paddingFifteen: 15,
  paddingTewenty: 20,
  paddingTewentyFive: 25,

  //Padding Top
  paddingTp: 0,
  paddingTpFive: 5,
  paddingTpTen: 10,
  paddingTpTewelve: 12,
  paddingTpFifteen: 15,
  paddingTpTewenty: 20,
  //Padding Bottom
  paddingBt: 0,
  paddingBtFive: 5,
  paddingBtTen: 10,
  paddingBtFifteen: 15,
  paddingBtTewenty: 20,
  //Padding Left
  paddingLt: 0,
  paddingLtFive: 5,
  paddingLtTen: 10,
  paddingLtFifteen: 15,
  paddingLtTewenty: 20,
  //Padding Right
  paddingRt: 0,
  paddingRtFive: 5,
  paddingRtTen: 10,
  paddingRtFifteen: 15,
  paddingRtTewenty: 20,

  //Margin
  margin: 0,
  marginTen: 10,
  marginTewelve: 12,
  marginFifteen: 15,
  marginTewenty: 20,
  marginTewentyFive: 25,
  //Margin Top
  marginTp: 0,
  marginTpFive: 5,
  marginTpTen: 10,
  marginTpFifteen: 15,
  marginTpTewenty: 20,
  //Margin Bottom
  marginBt: 0,
  marginBtFive: 5,
  marginBtTen: 10,
  marginBtFifteen: 15,
  marginBtTewenty: 20,
  //Margin Left
  marginLt: 0,
  marginLtFive: 5,
  marginLtTen: 10,
  marginLtFifteen: 15,
  marginLtTewenty: 20,
  //Margin Right
  marginRt: 0,
  marginRtFive: 5,
  marginRtTen: 10,
  marginRtFifteen: 15,
  marginRtTewenty: 20,

  //Margin MinusRight
  marginRtMinusFive: -5,
  marginRtMinusTen: -10,
  marginRtMinusFifteen: -15,
  marginRtMinusTewenty: -20,
  //Margin MinusLeft
  marginLtMinusFive: -5,
  marginLtMinusTen: -10,
  marginLtMinusFifteen: -15,
  marginLtMinusTewenty: -20,
  //Margin MinusTop
  marginTpMinusFive: -5,
  marginTpMinusTen: -10,
  marginTpMinusFifteen: -15,
  marginTpMinusTewenty: -20,
  //Margin MinusBottom
  marginBtMinusFive: -5,
  marginBtMinusTen: -10,
  marginBtMinusFifteen: -15,
  marginBtMinusTewenty: -20
};
