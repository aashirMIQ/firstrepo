import React from "react";
import { Route, Switch, Router, HashRouter, Redirect } from "react-router-dom";
import Home from "../Containers/Home/Home";
import Payment from "../Containers/Payment/Payment";
import ThankyouScreen from "../Containers/ThankyouScreeen/ThankyouScreen";
import Customers from "../Containers/Customers/Customers";
import createBrowserHistory from "history/createBrowserHistory";
import BillAmount from "../Containers/BillAmount/BillAmount";
import CloseSession from "../Containers/CloseSession/CloseSession";
import SessionHistory from "../Containers/SessionHistory/SessionHistory";
import SessionDetails from "../Containers/SessionDetail/SessionDetail";
import PincodeScreen from "../Containers/PincodeScreen/PincodeScreen";
import CustomerInfoScreen from "../Components/CustomerInfoScreen/CustomerInfoScreen";
import UdhaarScreen from "../Containers/UdhaarScreen/UdaarScreen";
import UdhaarThankyouScreen from "../Containers/UdhaarThankyouScreen/UdhaarThankyouScreen";
import SignUp from "../Containers/SignUp/SignUp";
import Login from "../Containers/Login/Login";
import Analytics from "../Containers/Analytics/Analytics";
import MainScreen from "../Containers/MainScreen/MainScreen";
import NewUdhaar from "../Containers/NewUdhaar/NewUdhaar";
import ItemScreen from "../Containers/ItemScreen/ItemScreen";
import CreditHistory from "../Containers/CreditHistory/CreditHistory";
import InventoryScreen from "../Containers/InventoryScreen/InventoryScreen";
import ReceiveItems from "../Containers/ReciveItems/ReceiveItems";
import ItemDetails from "../Containers/ItemDetails/ItemDetails";
import AuditItem from "../Containers/AuditItem/AuditItem";
import AuditItemDetails from "../Containers/auditItemDetails/auditItemDetials";
import ProductSearchingList from "../Containers/ProductSearchingList/ProductSearchingList";
import store from "../store";
import GoodReceive from "../Containers/GoodReceive/GoodReceive";
import GoodReceiveAudit from "../Containers/GoodReceiveAudit/GoodReceiveAudit";
const history = createBrowserHistory();

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={props => {
            let user = null;
            if ("user" in localStorage) {
              user = JSON.parse(localStorage.getItem("user"));
            }
            return user !== null ? (
              <Redirect to="/pinCodeScreen" />
            ) : (
              <Login {...props} />
            );
          }}
        />
        <Route
          path="/pinCodeScreen"
          render={props => <PincodeScreen {...props} />}
        />
        <Route path="/mainScreen" render={props => <MainScreen {...props} />} />
        <Route path="/signup" render={props => <SignUp {...props} />} />
        <Route path="/home" render={props => <Home {...props} />} />
        <Route path="/payment" render={props => <Payment {...props} />} />
        <Route
          path="/thankyouScreen"
          render={props => <ThankyouScreen {...props} />}
        />
        <Route path="/customers" render={props => <Customers {...props} />} />
        <Route path="/billamount" render={props => <BillAmount {...props} />} />
        <Route
          path="/closeSession"
          render={props => <CloseSession {...props} />}
        />
        <Route
          path="/sessionHistory"
          render={props => <SessionHistory {...props} />}
        />
        <Route
          path="/sessionDetails"
          render={props => <SessionDetails {...props} />}
        />
        <Route
          path="/customerInfoScreen"
          render={props => <CustomerInfoScreen {...props} />}
        />
        <Route
          path="/udhaarScreen"
          render={props => <UdhaarScreen {...props} />}
        />
        <Route
          path="/udhaarThankyouScreen"
          render={props => <UdhaarThankyouScreen {...props} />}
        />
        <Route
          path="/inventoryScreen"
          render={props => <InventoryScreen {...props} />}
        />
        <Route path="/giveUdhaar" render={props => <NewUdhaar {...props} />} />
        <Route path="/analytics" render={props => <Analytics {...props} />} />
        <Route
          path="/creditHistory"
          render={props => <CreditHistory {...props} />}
        />
        <Route
          path="/reveiveItems"
          render={props => <ReceiveItems {...props} />}
        />
        <Route path="/itemScreen" render={props => <ItemScreen {...props} />} />
        <Route path="/auditItem" render={props => <AuditItem {...props} />} />
        <Route
          path="/searchProduct"
          render={props => <ProductSearchingList {...props} />}
        />
        <Route
          path="/itemDetails"
          render={props => <ItemDetails {...props} />}
        />
        <Route
          path="/auditItemDetails"
          render={props => <AuditItemDetails {...props} />}
        />
        <Route
          path="/goodreceive"
          render={props => <GoodReceive {...props} />}
        />

        <Route
          path="/goodreceiveaudit"
          render={props => <GoodReceiveAudit {...props} />}
        />
      </Switch>
    </HashRouter>
  );
};

export default App;
