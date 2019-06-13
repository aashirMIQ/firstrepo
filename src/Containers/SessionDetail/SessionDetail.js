import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import { connect } from "react-redux";
import { formatNum, uuid, getTotal } from "../../oscar-pos-core/constants";
import MoneyInMoneyOutModal from "../../Components/MoneyInMoneyOutModal/MoneyInMoneyOutModal";
import CloseBalanceModal from "../../Components/CloseBalanceModal/CloseBalanceModal";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import {
  emptyCart,
  setPaymentMethod,
  getSessionSummary,
  close_pos_session,
  submitMoneyIn,
  submitMoneyOut,
  set_closing_balance,
  getAllSessions
} from "../../oscar-pos-core/actions";
import "./SessionDetail.css";

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};
class SessionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionData: {},
      sessionDetails: {}
    };
  }

  viewDetails = data => {
    //start working from there to navigate new screen
    console.log("data: ", data);
  };
  render() {
    console.log("nextProps: ", this.props.location.state.sessionDetails);
    let { sessionDetails } = this.props.location.state;
    return (
      <div
        style={{
          height: "100vh",
          display: "grid",
          gridTemplateRows: "1fr 9fr"
        }}
      >
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 9fr",
            background: "#662d94"
          }}
        >
          <div style={{ ...styles.center, cursor: "pointer" }}>
            <img
              className="back-arrow"
              width="50px"
              onClick={() => this.props.history.goBack()}
              src={require("../../assets/images/icons/back-icon.svg")}
            />
          </div>
          <div
            style={{
              color: "#fff",
              ...styles.center,
              paddingRight: "10%"
            }}
          >
            Session Details
          </div>
        </header>
        <section
          style={{
            background: "#fff",
            overflow: "scroll"
          }}
        >
          <List component="nav">
            <ListItem button>
              <div>State: {sessionDetails.state}</div>
            </ListItem>
            <ListItem button>
              <div>POS Session ID: {sessionDetails.id}</div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Opening Date </div>
                <div>{sessionDetails.start_at}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Closing Date </div>
                <div>{sessionDetails.stop_at}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Opening Balance </div>
                <div>{sessionDetails.cash_register_balance_start}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Expected Closing Balance </div>
                <div>{sessionDetails.cash_register_balance_end}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Real Closing Balance </div>
                <div>{sessionDetails.cash_register_balance_end_real}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Difference </div>
                <div>{sessionDetails.cash_register_difference}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>No of transection </div>
                <div>{sessionDetails.no_of_transections}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>No of Customers </div>
                <div>{sessionDetails.no_of_customers}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Total Money In amount </div>
                <div>{sessionDetails.total_money_in_amount}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Total Money Out amount </div>
                <div>{sessionDetails.total_money_out_amount}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Total Transection amount </div>
                <div>{sessionDetails.total_transections_amount}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Total Amount Paid </div>
                <div>{sessionDetails.total_amount_paid}</div>
              </div>
            </ListItem>
            <ListItem button>
              <div>
                <div>Total Outstanding Amount </div>
                <div>{sessionDetails.total_outstanding_amount}</div>
              </div>
            </ListItem>
          </List>
        </section>
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
    sessions: state.sessions,
  };
})(SessionDetails);
