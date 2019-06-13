import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import {
  cartReducer,
  productReducer,
  currentOrderInfoReducer,
  searchedProducts,
  emptyCartFlag,
  searchedOrders,
  searchedCustomers,
  paymentMethod,
  globalDiscount,
  mainCategories,
  sessionSummaryReducer,
  sessionReducer,
  userReducer,
  customerReducer,
  setCustomerForOrder,
  setCustomerForDetails,
  posSessionIdReducer,
  creditHistoryReducer,
  analyticsReducer,
  setCustomerForUdhaar,
  topProductReducer,
  setProductForReveiceItem
  // paymentJournal,
  // orderReducer,
  // moneyInReducer,
  // moneyOutReducer,
  // reasonsReducer,
} from "../oscar-pos-core/reducers";

const loggerMiddleware = createLogger();

const reducers = combineReducers({
  cart: cartReducer,
  products: productReducer,
  searchedProducts,
  emptyCartFlag,
  searchedOrders,
  searchedCustomers,
  paymentMethod,
  globalDiscount,
  mainCategories,
  sessionSummary: sessionSummaryReducer,
  sessions: sessionReducer,
  userReducer,
  customers: customerReducer,
  setCustomerForOrder: setCustomerForOrder,
  setCustomerForDetails,
  setCustomerForUdhaar,
  pos_session_id: posSessionIdReducer,
  creditHistory: creditHistoryReducer,
  analytics: analyticsReducer,
  topProductReducer,
  setProductForReveiceItem

  // paymentJournals: paymentJournal,
  // orders: orderReducer,
  // moneyIn: moneyInReducer,
  // moneyOut: moneyOutReducer,
  // reasons: reasonsReducer,
});

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk, loggerMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

export default store;
