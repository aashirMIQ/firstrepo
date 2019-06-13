import React, { Component } from "react";
import {
  Button,
  Modal,
  DropdownButton,
  Badge,
  Dropdown
} from "react-bootstrap";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { Header, Grid, Table } from "semantic-ui-react";
import Box from "../../Components/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "../../Components/Drawer/Drawer";
import Divider from "@material-ui/core/Divider";
import {
  getTotalRevenue,
  getTotalCogs,
  getGrossMarginValue,
  getGrossMarginPercentage,
  getCustomersServed,
  getSalesByDay,
  getAvgItemsPurchased,
  getAvgOrderValue,
  getPaymentMethods,
  getTopItemsBySales,
  getLowestItemsBySales,
  logout,
  emptyCart
} from "../../oscar-pos-core/actions";

import {
  getDateForAnalytics,
  dates,
  barChartTemplate,
  colorsForPaymentMethodChart,
  colorsForSalesByDayChart,
  colorsForSalesByHourChart
} from "../../oscar-pos-core/constants";
import Chart from "../../Components/BarChart/BarChart";
import { CUSTOMER, SESSION } from "../../oscar-pos-core/actions/types";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      selectedDate: "Today",
      selectedIndex: 1,
      paymentMethod: {},
      startDate: "",
      open: false
    };
  }

  componentWillMount() {
    this.setState({ startDate: new Date() }, () => {
      this.loadAnalyticsData();
    });
  }

  getCategories = type => {
    let { payment_methods, sales_by_day, sales_by_hour } = this.props.analytics;

    let categories = [];
    switch (type) {
      case "paymentMethod":
        if (Object.keys(payment_methods).length) {
          for (let key in payment_methods) {
            categories.push(key);
          }
        }
        break;
      case "salesByDay":
        if (Object.keys(sales_by_day).length) {
          for (let key in sales_by_day) {
            categories.push(key.toUpperCase());
          }
        }
        break;
      case "salesByHour":
        if (Object.keys(payment_methods).length) {
          for (let key in payment_methods) {
            categories.push(key);
          }
        }
        break;
    }
    // console.log("categories : ", categories)
    return categories;
  };

  getSeries = type => {
    let { payment_methods, sales_by_day, sales_by_hour } = this.props.analytics;
    let series = [];
    let tempArr = [];
    let obj = {
      data: tempArr,
      color: colorsForPaymentMethodChart,
      name: "Payment Methods",
      showInLegend: true,
      type: "column",
      yAxis: 0
    };
    switch (type) {
      case "paymentMethod":
        // if (Object.keys(payment_methods).length) {
        for (let key in payment_methods) {
          tempArr.push(payment_methods[key]);
        }

        series.push({
          data: tempArr,
          color: colorsForPaymentMethodChart,
          name: "Payment Methods",
          showInLegend: true,
          type: "column",
          yAxis: 0
        });
        break;
      case "salesByDay":
        // if (Object.keys(payment_methods).length) {
        for (let key in sales_by_day) {
          tempArr.push(sales_by_day[key]);
        }

        series.push({
          data: tempArr,
          color: colorsForSalesByDayChart,
          name: "Sales By Day",
          showInLegend: true,
          type: "column",
          yAxis: 0
        });
        break;
      case "salesByHour":
        // if (Object.keys(payment_methods).length) {
        for (let key in payment_methods) {
          tempArr.push(payment_methods[key]);
        }

        series.push({
          data: tempArr,
          color: colorsForSalesByHourChart,
          name: "Payment Methods",
          showInLegend: true,
          type: "column",
          yAxis: 0
        });
        break;
      // }
    }

    // console.log("series : ", series)
    return series;
  };
  loadAnalyticsData = () => {
    var t0 = Date.now();
    this.setState({ loader: true });
    let session_id = this.props.user.id,
      { startDate } = this.state;
    let dateObj = getDateForAnalytics(this.state.startDate);
    console.log("dateObj : ", dateObj);
    Promise.all([
      this.props.dispatch(
        getTotalRevenue(null, session_id, dateObj.startDate, dateObj.endDate)
      ),
      this.props.dispatch(
        getTotalCogs(null, session_id, dateObj.startDate, dateObj.endDate)
      ),
      this.props.dispatch(
        getGrossMarginValue(
          null,
          session_id,
          dateObj.startDate,
          dateObj.endDate
        )
      ),
      this.props.dispatch(
        getGrossMarginPercentage(
          null,
          session_id,
          dateObj.startDate,
          dateObj.endDate
        )
      ),
      this.props.dispatch(
        getCustomersServed(null, session_id, dateObj.startDate, dateObj.endDate)
      ),
      this.props.dispatch(
        getSalesByDay(null, session_id, dateObj.startDate, dateObj.endDate)
      ),
      // this.props.dispatch(getSalesByHour(null, session_id,startDate)),
      this.props.dispatch(
        getAvgItemsPurchased(
          null,
          session_id,
          dateObj.startDate,
          dateObj.endDate
        )
      ),
      this.props.dispatch(
        getAvgOrderValue(null, session_id, dateObj.startDate, dateObj.endDate)
      ),
      this.props.dispatch(
        getPaymentMethods(null, session_id, dateObj.startDate, dateObj.endDate)
      ),
      this.props.dispatch(
        getTopItemsBySales(null, session_id, dateObj.startDate, dateObj.endDate)
      ),
      this.props.dispatch(
        getLowestItemsBySales(
          null,
          session_id,
          dateObj.startDate,
          dateObj.endDate
        )
      )
    ])
      .then(res => {
        // const paymentMethod = JSON.parse(JSON.stringify(barChartTemplate));
        // paymentMethod["xAxis"]["categories"] = this.getCategories('paymentMethod');
        // paymentMethod["series"] = this.getSeries('paymentMethod');

        // this.setState({ paymentMethod }, () => {
        //     this.setState({ loader: false, })
        // })
        console.log("response comming from get analytics data: ", res);
        var t1 = Date.now();
        console.log("Time Consume (Get Analytics)= ", (t1 - t0) / 1000, " sec");
        this.setState({ loader: false });
      })
      .catch(err => {
        console.log("err : ", err);
        this.setState({ loader: false });
      });
  };
  backArrowClick = () => {
    this.props.history.goBack();
  };

  setStartDate = date => {
    console.log("data: ", date);
    this.setState({ startDate: date, selectedDate: date }, () => {
      this.loadAnalyticsData();
    });
  };
  toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  };
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
  render() {
    console.log("this.props.analytics : ", this.props.analytics);
    let {
      total_revenue,
      total_cogs,
      gross_margin_value,
      gross_margin_percentage,
      customers_served,
      sales_by_day,
      sales_by_hour,
      avg_items_purchased,
      avg_order_value,
      payment_methods,
      top_items_by_sales,
      lowest_items_by_sales
    } = this.props.analytics;
    const paymentMethod = JSON.parse(JSON.stringify(barChartTemplate));
    paymentMethod["xAxis"]["categories"] = this.getCategories("paymentMethod");
    paymentMethod["series"] = this.getSeries("paymentMethod");

    const salesByDay = JSON.parse(JSON.stringify(barChartTemplate));
    salesByDay["xAxis"]["categories"] = this.getCategories("salesByDay");
    salesByDay["series"] = this.getSeries("salesByDay");

    const salesByHour = JSON.parse(JSON.stringify(barChartTemplate));
    salesByHour["xAxis"]["categories"] = this.getCategories("salesByHour");
    salesByHour["series"] = this.getSeries("salesByHour");
    if (this.state.loader) {
      return (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Loader type="Grid" color="#662d94" height={50} width={50} />
        </div>
      );
    }
    return (
      <div className="innersection">
        <header
          style={{
            background: "#662d94",
            height: "10vh",
            display: "grid",
            gridTemplateColumns: "0.1fr 0.9fr"
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
              onClick={this.toggleDrawer}
              className="menu-img"
              src={require("../../assets/images/menuicon.svg")}
            />
          </div>
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // background: "#8880b2",
              color: "#fff",
              paddingRight: "10%"
            }}
          >
            Analytics
          </div>
        </header>
        <section>
          <Dropdown
            style={{
              width: "100%",
              padding: "2em 1em"
            }}
          >
            <Dropdown.Toggle
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgb(193, 96, 243)",
                border: "none",
                width: "250px"
              }}
              id="dropdown-custom-components"
            >
              {this.state.selectedDate || "Select Day"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                eventKey={`1`}
                onClick={() => this.setStartDate("Today")}
              >
                Today
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={`2`}
                onClick={() => this.setStartDate("Yesterday")}
              >
                Yesterday
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={`3`}
                onClick={() => this.setStartDate("Last 7 Days")}
              >
                Last 7 Days
              </Dropdown.Item>
              <Dropdown.Item
                eventKey={`4`}
                onClick={() => this.setStartDate("Last 30 Days")}
              >
                Last 30 Days
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gridColumnGap: "2em",
            padding: "0 1em"
          }}
        >
          <Box
            title={"Total Revenue"}
            data={total_revenue}
            currency={"Rs"}
            roundOff={true}
          />
          <Box
            title={"Total COGS"}
            data={total_cogs}
            currency={"Rs"}
            roundOff={true}
          />
          <Box
            title={"Margin Rs"}
            currency="Rs."
            data={gross_margin_value}
            roundOff={true}
          />
          <Box
            title={"Margin (%)"}
            data={gross_margin_percentage}
            roundOff={true}
            percent={true}
          />
          <Box
            title={"Customers served"}
            data={customers_served}
            customer={true}
          />
        </div>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)"
          }}
        >
          <div
            style={{
              width: "30vw",
              padding: "1.5vw"
            }}
          >
            <Chart title="SALES BY DAY" data={salesByDay} />
          </div>
          <div
            style={{
              width: "30vw",
              padding: "1.5vw"
            }}
          >
            <Chart title="PAYMENT METHOD" data={paymentMethod} />
          </div>
          <div
            style={{
              width: "33vw",
              padding: "1.5vw"
            }}
          >
            <Grid.Row style={styles.heading}>
              <Header
                as="h5"
                style={{
                  ...styles.headingText,
                  borderBottom: "1px solid rgb(193, 193, 197)"
                }}
              >
                Basket Size
              </Header>
            </Grid.Row>
            <ListItem
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div style={styles.productText}>Average Items Purchased</div>
              <div style={styles.listText}>
                {Number(avg_items_purchased).toFixed(2)}
              </div>
            </ListItem>
            <Divider />
            <ListItem
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div style={styles.productText}>Average Order Value</div>
              <div style={styles.listText}>
                {Number(avg_order_value).toFixed(2)}
              </div>
            </ListItem>
            <Divider />
          </div>
        </section>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridColumnGap: "3em",
            padding: "1.5em"
          }}
        >
          <div>
            <Header as="h5" style={styles.headingText}>
              TOP ITEMS BY SALES
            </Header>
            <div>
              <ListItem
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  background: "#ecf3fa",
                  fontSize: "14px",
                  fontWeight: "300",
                  color: "#999999"
                }}
              >
                <div
                  style={{
                    textAlign: "center"
                  }}
                >
                  Products
                </div>
                <div style={{ textAlign: "center" }}>Quantity</div>
                <div style={{ textAlign: "center" }}>Amount</div>
              </ListItem>
              {top_items_by_sales.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    <ListItem
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)"
                      }}
                    >
                      <div
                        style={{ textAlign: "center", ...styles.productText }}
                      >
                        {data.name}
                      </div>
                      <div style={{ textAlign: "center", ...styles.listText }}>
                        {data.qty}
                      </div>
                      <div style={{ textAlign: "center", ...styles.listText }}>
                        {data.amount}
                      </div>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          <div>
            <Header as="h5" style={styles.headingText}>
              LOWEST ITEMS BY SALES
            </Header>
            <div>
              <ListItem
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  background: "#ecf3fa",
                  fontSize: "14px",
                  fontWeight: "300",
                  color: "#999999"
                }}
              >
                <div
                  style={{
                    textAlign: "center"
                  }}
                >
                  Products
                </div>
                <div style={{ textAlign: "center" }}>Quantity</div>
                <div style={{ textAlign: "center" }}>Amount</div>
              </ListItem>
              {lowest_items_by_sales.map((data, i) => {
                return (
                  <React.Fragment key={i}>
                    <ListItem
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)"
                      }}
                    >
                      <div
                        style={{ textAlign: "center", ...styles.productText }}
                      >
                        {data.name}
                      </div>
                      <div style={{ textAlign: "center", ...styles.listText }}>
                        {data.qty}
                      </div>
                      <div style={{ textAlign: "center", ...styles.listText }}>
                        {data.amount}
                      </div>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>
        <Drawer
          history={this.props.history}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          logout={this.logout}
        />
      </div>
    );
  }
}

const styles = {
  listText: {
    fontSize: "16px",
    fontWeight: "400",
    color: "rgb(87, 87, 87)"
    // fontFamily: "Roboto"
  },
  productText: {
    fontSize: "14px",
    fontWeight: "300",
    color: "rgb(153, 153, 153)",
    // fontFamily: "Roboto",
    textTransform: "capitalize"
  },
  heading: {
    color: "#af2d2d",
    borderBottom: "1px solid #c1c1c5",
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    borderBottom: "1px solid rgb(193, 193, 197)",
    marginBottom: "20px",
    marginLeft: "0px",
    marginRight: "0px"
  },
  headingText: {
    fontSize: 16,
    fontWeight: 400,
    color: "#666874",
    paddingBottom: 20,
    paddingLeft: 5,
    textTransform: "uppercase"
  },
  headingText: {
    fontSize: 16,
    fontWeight: 400,
    color: "#666874",
    paddingBottom: 20,
    paddingLeft: 5,
    textTransform: "uppercase"
    // fontFamily: "Roboto"
  },
  comingSoon: {
    backgroundColor: "#59d345",
    color: "#fff",
    // fontFamily: "Roboto",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15
  },
  dropDown: {
    // fontFamily: "Roboto",
    borderRadius: 20,
    color: "rgb(102, 104, 116)",
    marginRight: 50,
    position: "relative",
    top: 52,
    backgroundColor: "transparent",
    fontSize: 14,
    fontWeight: 300
  },
  customClass: {
    backgroundColor: "transparent",
    color: "rgb(102, 104, 116)",
    fontSize: 14,
    fontWeight: 300
  },
  topHeader: {
    backgroundColor: "#652d92",
    color: "white"
  },
  mainHeadig: {
    marginTop: 30,
    fontWeight: 400,
    // fontFamily: "Roboto",
    color: "#666874"
  },
  title: {
    padding: 10,
    fontSize: 22
  },
  sideBar: {
    top: 45,
    backgroundColor: "#2c2435"
  },
  datePicker: {
    paddingTop: 20,
    paddingRight: 20,
    // fontFamily: "Roboto",
    color: "#666874",
    fontWeight: 400
  },

  mainTable: {
    borderWidth: 0,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "transparent"
  },
  tablerow: {
    textAlign: "center",
    // fontFamily: "Roboto",
    backgroundColor: "none"
  },
  hederCell: {
    backgroundColor: "#ECF3FA",
    color: "#999",
    fontSize: 14,
    fontWeight: 300,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: "#c1c1c5",
    borderWidth: 0.7,
    borderRadius: 0
  },
  tableCellfirst: {
    backgroundColor: "#F9F9FE",
    color: "#999",
    fontSize: 14,
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#C9C9C9"
  },
  tableCell: {
    backgroundColor: "#F9F9FE",
    color: "#313131",
    fontSize: 14,
    paddingTop: 25,
    paddingBottom: 25,
    borderTopWidth: 0.5,
    borderTopColor: "#C9C9C9"
  },
  headerRow: {
    textAlign: "center"
    // fontFamily: "Roboto"
  },
  heading: {
    fontSize: 16,
    color: "rgb(102, 104, 116)",
    paddingBottom: 10,
    paddingLeft: 15,
    paddingTop: 5,
    fontWeight: 400,
    textTransform: "uppercase"
    // fontFamily: "Roboto"
  }
};

export default connect(state => {
  return {
    analytics: state.analytics,
    user: state.userReducer
  };
})(Analytics);
