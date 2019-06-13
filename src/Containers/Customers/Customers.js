import React, { Component } from "react";
import { connect } from "react-redux";
import {
  customerSearchingQuery,
  deleteCustomer,
  getCustomers,
  setCustomerForDetails,
  getCreditHistory
} from "../../oscar-pos-core/actions";
import { CUSTOMER } from "../../oscar-pos-core/actions/types";
import CreateCustomerModal from "../../Components/CreateCustomerModal/CreateCustomerModal";
import CustomerDetailsModal from "../../Components/CustomerDetailsModal/CustomerDetailsModal";
import { ToastContainer, toast } from "react-toastify";
const colors = ["#32C6E9", "#FEBF21", "#FB7447", "#D7E60A", "#5A2C8C"];
const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};
class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerSearchingText: "",
      customerSearchingQuery: "",
      showSearchCustomer: false,
      customerObj: null,
      show: false,
      editMode: false,
      showCustomers: "all",
      customers: [],
      searchedCustomers: [],
      showDetails: false
    };
  }

  componentWillReceiveProps(props) {
    console.log("componentWillReceiveProps from Customers Screen: ", props);
    if (this.state.customerSearchingQuery.length) {
      this.setState({
        // customers: props.customers
        searchedCustomers: props.searchedCustomers
      });
    } else if (!this.state.customerSearchingQuery.length) {
      this.setState({
        customers: props.customers
        // searchedCustomers: props.searchedCustomers
      });
    }
  }

  componentDidMount() {
    var t0 = Date.now();
    this.props
      .dispatch(getCustomers(null, this.props.user.id))
      .then(data => {
        var t1 = Date.now();
        console.log("Time consume (Get customers)= ", (t1 - t0) / 1000, " sec");
        console.log("customers get from database: ", data);
      })
      .catch(error => {
        console.log("error customer get from database: ", error);
      });
  }
  searchCustomer = e => {
    let { value } = e.target;
    this.setState({ customerSearchingQuery: value });
    if (!value.length) {
      this.setState({ showSearchCustomer: false });
      return;
    }
    if (value.length > 0) {
      this.props
        .dispatch(customerSearchingQuery(null, value, this.props.user.id))
        .then(response => {
          console.log("response from searching customer: ", response);
          this.setState({ showSearchCustomer: true });
        })
        .catch(error => {
          console.log("error form searching customer: ", error);
        });
    }
  };

  editCustomer = customer => {
    this.setState({
      customerObj: customer,
      show: !this.state.show,
      editMode: true
    });
  };

  deleteCustomer = customer => {
    this.props
      .dispatch(deleteCustomer(null, customer.id))
      .then(data => {
        // console.log("deleted customer from component: ", data);
      })
      .catch(error => {
        console.log("error from delete customer component: ", error);
      });
    console.log(customer);
  };

  addCustomer = () => {
    this.setState({ show: !this.state.show, editMode: false });
  };
  resetShow = () => {
    this.setState({ show: !this.state.show });
  };
  setCustomerForOrder = customer => {
    toast.success("Customer Successfully Add !", {
      position: toast.POSITION.BOTTOM_LEFT
    });
    setTimeout(() => {
      if (
        this.props.location.state &&
        this.props.location.state.commingFromNewUdhaar
      ) {
        this.props.dispatch({
          type: CUSTOMER.SET_CUSTOMER_FOR_UDHAAR,
          payload: customer
        });
        this.props.history.goBack();
        return;
      }
      this.props.dispatch({
        type: CUSTOMER.SET_CUSTOMER_FOR_ORDER,
        payload: customer
      });
      if (this.props.location.state && this.props.location.state.isUdhaar) {
        this.props.history.push({
          pathname: "/udhaarScreen",
          state: {
            to_invoice: true
          }
        });
        return;
      }
      this.props.history.goBack();
    }, 1000);
  };

  //for sliding the icons view
  toggleSlide = (index, fromSearchedCustomers = false) => {
    let { customers, searchedCustomers } = this.state;
    for (let i = 0; i < customers.length; i++) {
      if (index == i && !fromSearchedCustomers) {
        console.log("onClick on col-2:: ", customers[i]);
        customers[i].isSlide === undefined || customers[i].isSlide === false
          ? (customers[i].isSlide = true)
          : (customers[i].isSlide = true);

        this.setState({ customers });
        break;
      }
      if (index == i && fromSearchedCustomers) {
        console.log("onClick on col-2:: ", searchedCustomers[i]);
        searchedCustomers[i].isSlide === undefined ||
        searchedCustomers[i].isSlide === false
          ? (searchedCustomers[i].isSlide = true)
          : (searchedCustomers[i].isSlide = true);
        this.setState({ searchedCustomers });
        break;
      }
    }
  };
  makeViewFalse = (index, fromSearchedCustomers = false) => {
    let { customers, searchedCustomers } = this.state;
    for (let i = 0; i < customers.length; i++) {
      if (index == i && !fromSearchedCustomers) {
        console.log("onClick on col-2:: ", customers[i]);
        customers[i].isSlide == undefined
          ? (customers[i].isSlide = false)
          : (customers[i].isSlide = false);
        this.setState({ customers });
        break;
      }
      if (index == i && fromSearchedCustomers) {
        console.log("onClick on col-2:: ", searchedCustomers[i]);
        searchedCustomers[i].isSlide == undefined
          ? (searchedCustomers[i].isSlide = false)
          : (searchedCustomers[i].isSlide = false);
        this.setState({ searchedCustomers });
        break;
      }
    }
  };

  showDetails = customer => {
    this.props.dispatch(setCustomerForDetails(customer)).then(() => {
      this.props.dispatch(
        getCreditHistory(null, this.props.setCustomerForDetails.id)
      ); //start from there
      this.setState({ customerObj: customer }, () => {
        this.toggleShowDetails();
      });
    });
  };
  toggleShowDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };
  render() {
    console.log("this.props from customers screen: ", this.props);
    console.log("yea this is rendering there ::::::::::::::::::: ");
    console.log(
      `this.state.customerSearchingQuery.length &&
    this.props.searchedCustomers.length::: `,
      this.state.customerSearchingQuery.length &&
        this.props.searchedCustomers.length,
      this.state.customerSearchingText.length,
      this.props.searchedCustomers.length,
      this.state.searchedCustomers
    );
    return (
      <main
        style={{
          display: "grid",
          gridTemplateRows: "0.1fr 0.1fr 0.8fr",
          height: "100vh",
          gridTemplateColumns: "1fr"
        }}
      >
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "0.1fr 0.8fr 0.1fr",
            background: "#662d94"
          }}
        >
          <div
            onClick={() => this.props.history.goBack()}
            className="header-wrapper-col-1"
            style={{ borderRight: "2px solid #5e2985" }}
          >
            <div>
              <img
                // className="back-arrow"
                className="menu-img"
                width="25px"
                src={require("../../assets/images/left-arrow.svg")}
              />
            </div>
          </div>
          <div className="header-wrapper-col-2">
            <div style={{ display: "flex", width: "100%" }}>
              <img
                src={require("../../assets/images/searchicon.svg")}
                width={"32px"}
              />
              <input
                className="input"
                // onFocus={this.onFocusOnInput}
                placeholder="Search customer by Name and Phone"
                value={this.state.customerSearchingQuery}
                onChange={this.searchCustomer}
                style={{ width: "90%" }}
                // width="90%"
              />
            </div>
          </div>
          <div
            onClick={this.addCustomer}
            className="header-wrapper-col-3"
            style={{ borderLeft: "3px solid #5e2985 !important" }}
          >
            <img
              width="42px"
              src={require("../../assets/images/newicons/AddCusotmer.svg")}
            />
          </div>
        </header>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            alignItems: "center",
            borderBottom: "1px solid #f8f8f8"
          }}
        >
          {/* <button
            onClick={() => this.setState({ showCustomers: "all" })}
            style={{
              width: "50vw",
              height: "100%",
              background: "transparent",
              border: "none",
              color: this.state.showCustomers == "all" ? "#662d94" : "#595a5c",
              outline: "none",
              fontSize: "20px",
              borderBottom:
                this.state.showCustomers == "all" ? "1px solid #662d94" : "0"
            }}
          >
            All
          </button>
          <button
            onClick={() => this.setState({ showCustomers: "credit" })}
            style={{
              width: "50vw",
              height: "100%",
              background: "transparent",
              border: "none",
              color:
                this.state.showCustomers == "credit" ? "#662d94" : "#595a5c",
              outline: "none",
              fontSize: "20px",
              borderBottom:
                this.state.showCustomers == "credit" ? "1px solid #662d94" : "0"
            }}
          >
            Credit
          </button> */}
          <div>Name</div>
          <div>Phone #</div>
          <div>Email</div>
          <div>Loyalty Point</div>
          <div>Udhaar</div>
        </div>
        <section
          style={{
            overflow: "scroll",
            overflowX: "hidden"
          }}
        >
          {this.state.customerSearchingQuery.length
            ? this.state.searchedCustomers.map((customer, i) => {
                // let sliceName =
                //   customer.name.split(" ")[0][0].toUpperCase() +
                //   customer.name.split(" ")[1][0].toUpperCase();
                console.log("console from searching customers is: ", customer);
                return (
                  <div
                    onClick={() => this.toggleSlide(i, true)}
                    onMouseLeave={() => this.makeViewFalse(i, true)}
                    key={customer.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.5fr repeat(4, 1fr) 2fr",
                      paddingLeft: "1em",
                      borderBottom: "3px solid #eeeeee",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ ...styles.center, padding: "1em" }}>
                      <div
                        style={{
                          ...styles.center,
                          color: "#fff",
                          // backgroundColor: colors[i] ? colors[i] : colors[0],
                          border: "1px solid #000",
                          color: "#000",
                          height: "3em",
                          width: "3em",
                          borderRadius: "4em",
                          padding: "1em"
                        }}
                      >
                        {customer.name.slice(0, 2)}
                      </div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        // padding: "1em",
                        alignItems: "none",
                        flexDirection: "column"
                      }}
                    >
                      <div style={{ fontSize: "16px" }}>{customer.name}</div>
                      {/* <div>{customer.phone}</div> */}
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        padding: "1em",
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "1em",
                        alignItems: "center"
                      }}
                    >
                      {/* {customer.total_outstanding_payment ? (
                      <React.Fragment>
                        <div style={{ color: "#353b48" }}>Udhaar Given</div>
                        <div style={{ fontSize: "19pt", color: "#e84118" }}>
                          {customer.total_outstanding_payment}
                        </div>
                      </React.Fragment>
                    ) : (
                      <div />
                    )} */}
                      <div>{customer.phone}</div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        padding: "1em",
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "1em",
                        alignItems: "center"
                      }}
                    >
                      <div>{customer.email}</div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        padding: "1em",
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "1em",
                        alignItems: "center"
                      }}
                    >
                      <div>-</div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        flexDirection: "column",
                        position: "relative",
                        paddingLeft: "10em"
                      }}
                    >
                      {/* {customer.loyalty_point || "0"} */}
                      {customer.total_outstanding_payment ? (
                        <React.Fragment>
                          <div style={{ color: "#353b48" }}>Udhaar Given</div>
                          <div style={{ fontSize: "19pt", color: "#e84118" }}>
                            {customer.total_outstanding_payment}
                          </div>
                        </React.Fragment>
                      ) : (
                        <div />
                      )}
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
                          onClick={() => this.setCustomerForOrder(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
                            background: "#d7df23",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Add To Sale
                        </div>
                        <div
                          onClick={() => this.editCustomer(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
                            background: "#662d94",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          View Details
                        </div>
                        <div
                          onClick={() => this.editCustomer(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
                            background: "#00aeef",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => this.deleteCustomer(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
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
            : this.state.showCustomers == "all" &&
              this.state.customers.length &&
              !this.state.customerSearchingQuery.length
            ? this.state.customers.slice(0, 20).map((customer, i) => {
                // let sliceName =
                //   customer.name.split(" ")[0][0].toUpperCase() +
                //   customer.name.split(" ")[1][0].toUpperCase();
                console.log("console from all customers is: ", customer);
                return (
                  <div
                    onClick={() => this.toggleSlide(i)}
                    onMouseLeave={() => this.makeViewFalse(i)}
                    key={customer.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr) 2fr",
                      paddingLeft: "1em",
                      borderBottom: "1px solid #eeeeee",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ ...styles.center, padding: "1em" }}>
                      <div
                        style={{
                          ...styles.center,
                          color: "#fff",
                          // backgroundColor: colors[i] ? colors[i] : colors[0],
                          border: "1px solid #000",
                          color: "#000",
                          height: "3em",
                          width: "3em",
                          borderRadius: "4em"
                          // padding: "1em"
                        }}
                      >
                        {customer.name.slice(0, 2)}
                      </div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        padding: "1em",
                        alignItems: "none",
                        flexDirection: "column"
                      }}
                    >
                      <div style={{ fontSize: "16px" }}>{customer.name}</div>
                      {/* <div>{customer.phone}</div> */}
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        padding: "1em",
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "1em",
                        alignItems: "center"
                      }}
                    >
                      {/* {customer.total_outstanding_payment ? (
                      <React.Fragment>
                        <div style={{ color: "#353b48" }}>Udhaar Given</div>
                        <div style={{ fontSize: "19pt", color: "#e84118" }}>
                          {customer.total_outstanding_payment}
                        </div>
                      </React.Fragment>
                    ) : (
                      <div />
                    )} */}
                      <div>{customer.phone}</div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        padding: "1em",
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "1em",
                        alignItems: "center"
                      }}
                    >
                      <div>{customer.email}</div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        padding: "1em",
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "1em",
                        alignItems: "center"
                      }}
                    >
                      <div>-</div>
                    </div>
                    <div
                      style={{
                        ...styles.center,
                        flexDirection: "column",
                        position: "relative",
                        paddingLeft: "10em"
                      }}
                    >
                      {/* {customer.loyalty_point || "0"} */}
                      {customer.total_outstanding_payment ? (
                        <React.Fragment>
                          <div style={{ color: "#353b48" }}>Udhaar Given</div>
                          <div style={{ fontSize: "19pt", color: "#e84118" }}>
                            {customer.total_outstanding_payment}
                          </div>
                        </React.Fragment>
                      ) : (
                        <div />
                      )}
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
                          onClick={() => this.setCustomerForOrder(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
                            background: "#d7df23",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Add To Sale
                        </div>
                        <div
                          onClick={() => this.showDetails(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
                            background: "#662d94",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          View Details
                        </div>
                        <div
                          onClick={() => this.editCustomer(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
                            background: "#00aeef",
                            color: "#fff",
                            alignItems: "center"
                          }}
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => this.deleteCustomer(customer)}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "5px 0px",
                            width: "25%",
                            fontSize: "15px",
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
            : this.state.customers.slice(0, 20).map((customer, i) => {
                // let sliceName =
                //   customer.name.split(" ")[0][0].toUpperCase() +
                //   customer.name.split(" ")[1][0].toUpperCase();
                if (customer.total_outstanding_payment)
                  return (
                    <div
                      onClick={() => this.toggleSlide(i)}
                      onMouseLeave={() => this.makeViewFalse(i)}
                      key={customer.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "0.1fr 0.25fr 0.25fr 0.4fr",
                        paddingLeft: "1em",
                        borderBottom: "1px solid #eeeeee",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ ...styles.center, padding: "1em" }}>
                        <div
                          style={{
                            ...styles.center,
                            color: "#fff",
                            // backgroundColor: colors[i] ? colors[i] : colors[0],
                            border: "1px solid #000",
                            color: "#000",
                            height: "3em",
                            width: "3em",
                            borderRadius: "3em",
                            padding: "1em"
                          }}
                        >
                          {customer.name.slice(0, 2)}
                        </div>
                      </div>
                      <div
                        style={{
                          ...styles.center,
                          padding: "1em",
                          alignItems: "none",
                          flexDirection: "column"
                        }}
                      >
                        <div style={{ fontSize: "16px" }}>{customer.name}</div>
                        {/* <div>{customer.phone}</div> */}
                      </div>
                      <div
                        style={{
                          ...styles.center,
                          padding: "1em",
                          display: "flex",
                          justifyContent: "space-evenly",
                          padding: "1em",
                          alignItems: "center"
                        }}
                      >
                        {/* {customer.total_outstanding_payment ? (
                      <React.Fragment>
                        <div style={{ color: "#353b48" }}>Udhaar Given</div>
                        <div style={{ fontSize: "19pt", color: "#e84118" }}>
                          {customer.total_outstanding_payment}
                        </div>
                      </React.Fragment>
                    ) : (
                      <div />
                    )} */}
                        <div>{customer.phone}</div>
                      </div>
                      <div
                        style={{
                          ...styles.center,
                          flexDirection: "column",
                          position: "relative",
                          paddingLeft: "10em"
                        }}
                      >
                        {/* {customer.loyalty_point || "0"} */}
                        {customer.total_outstanding_payment ? (
                          <React.Fragment>
                            <div style={{ color: "#353b48" }}>Udhaar Given</div>
                            <div style={{ fontSize: "19pt", color: "#e84118" }}>
                              {customer.total_outstanding_payment}
                            </div>
                          </React.Fragment>
                        ) : (
                          <div />
                        )}
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
                            onClick={() => this.setCustomerForOrder(customer)}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "5px 0px",
                              width: "25%",
                              fontSize: "10px",
                              background: "#d7df23",
                              color: "#fff",
                              alignItems: "center"
                            }}
                          >
                            Add To Sale
                          </div>
                          <div
                            onClick={() => this.showDetails(customer)}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "5px 0px",
                              width: "25%",
                              fontSize: "10px",
                              background: "#662d94",
                              color: "#fff",
                              alignItems: "center"
                            }}
                          >
                            View Details
                          </div>
                          <div
                            onClick={() => this.editCustomer(customer)}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "5px 0px",
                              width: "25%",
                              fontSize: "10px",
                              background: "#00aeef",
                              color: "#fff",
                              alignItems: "center"
                            }}
                          >
                            Edit
                          </div>
                          <div
                            onClick={() => this.deleteCustomer(customer)}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "5px 0px",
                              width: "25%",
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
        <CreateCustomerModal
          show={this.state.show}
          onHide={() =>
            this.setState({
              show: !this.state.show,
              editMode: false
            })
          }
          resetShow={this.resetShow}
          customer={this.state.customerObj}
          editMode={this.state.editMode}
        />
        <CustomerDetailsModal
          onHide={this.toggleShowDetails}
          customer={this.state.customerObj}
          show={this.state.showDetails}
          openUpdateCustomerModal={customer => this.editCustomer(customer)}
        />
        <ToastContainer autoClose={2000} />
      </main>
    );
  }
}
let mapStateToProps = state => {
  return {
    searchedCustomers: state.searchedCustomers,
    user: state.userReducer,
    customers: state.customers,
    setCustomerForOrder: state.setCustomerForOrder,
    setCustomerForDetails: state.setCustomerForDetails
  };
};

export default connect(mapStateToProps)(Customers);
