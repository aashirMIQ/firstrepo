import React from "react";
import Drawer from "@material-ui/core/Drawer";
import {connect} from 'react-redux';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

class Draw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <Drawer
        anchor="left"
        open={this.props.open}
        onClose={() => this.props.toggleDrawer()}
      >
        <div
          tabIndex={0}
          style={{ width: "30vw" }}
          role="button"
          onClick={() => this.props.toggleDrawer()}
        >
          <List>
            <ListItem
              button
              onClick={this.toggleDrawer}
              style={{ paddingTop: "0", paddingBottom: "0" }}
            >
              <ListItemIcon style={{ margin: "0" }}>
                <img
                  src={require("../../assets/images/icons/oscar_1.svg")}
                  style={{ color: "black" }}
                />
              </ListItemIcon>
              <ListItemText>
                <div className="loginAsCont">
                  <div style={{ fontSize: "12px", color: "#747d8c" }}>
                    Login As
                  </div>
                  <div>
                    {this.props.user && this.props.user.name
                      ? this.props.user.name
                      : ""}
                  </div>
                </div>
              </ListItemText>
            </ListItem>

            <ListItem
              style={{borderBottom: "1px solid rgba(102, 45, 148, 0.4)",}}
              button
              onClick={() => this.props.history.push("/mainScreen")}
            >
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/newicons/Home_1.svg")}
                  style={{ width: "28px" }}
                />
              </ListItemIcon>
              <ListItemText style={{ fontSize: "18px" }}>Home</ListItemText>
            </ListItem>

            <ListItem
             style={{borderBottom: "1px solid rgba(102, 45, 148, 0.4)",}}
             button onClick={() => this.props.history.push("/home")}>
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/Sales_1.svg")}
                  style={{ width: "30px" }}
                />
              </ListItemIcon>
              <ListItemText style={{ fontSize: "18px" }}>Sales</ListItemText>
            </ListItem>

            <ListItem
              style={{borderBottom: "1px solid rgba(102, 45, 148, 0.4)",}}
              button
              onClick={() => this.props.history.push("/giveUdhaar")}
            >
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/Udhaar_1.svg")}
                  style={{ width: "30px" }}
                />
              </ListItemIcon>
              <ListItemText style={{ fontSize: "18px" }}>Udhaar</ListItemText>
            </ListItem>

            <ListItem
              style={{borderBottom: "1px solid rgba(102, 45, 148, 0.4)",}}
              button
              onClick={() => this.props.history.push("/itemScreen")}
            >
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/Item_1.svg")}
                  style={{ width: "30px" }}
                  onClick={() => this.props.history.push("/itemScreen")}
                />
              </ListItemIcon>
              <ListItemText style={{ fontSize: "18px" }}>Items</ListItemText>
            </ListItem>

            <ListItem
              style={{borderBottom: "1px solid rgba(102, 45, 148, 0.4)",}}
              button
              onClick={() => this.props.history.push("/inventoryScreen")}
            >
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/newicons/Inventory_1.svg")}
                  style={{ width: "28px" }}
                />
              </ListItemIcon>
              <ListItemText style={{ fontSize: "18px" }}>
                Inventory
              </ListItemText>
            </ListItem>

            <ListItem
              style={{borderBottom: "1px solid rgba(102, 45, 148, 0.4)",}}
              button
              onClick={() => this.props.history.push("customers")}
            >
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/newicons/Customers_1.svg")}
                  style={{ width: "25px" }}
                />
              </ListItemIcon>
              <ListItemText style={{ fontSize: "18px" }}>
                Customers
              </ListItemText>
            </ListItem>

            <ListItem
              style={{borderBottom: "1px solid rgba(102, 45, 148, 0.4)",}}
              button
              onClick={() => this.props.history.push("/analytics")}
            >
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/newicons/Reports_1.svg")}
                  style={{ width: "28px" }}
                />
              </ListItemIcon>
              <ListItemText>Reports</ListItemText>
            </ListItem>

            <ListItem
             button onClick={this.props.logout}>
              <ListItemIcon style={{ paddingLeft: "15px", marginRight: "0px" }}>
                <img
                  src={require("../../assets/images/newicons/Logout_1.svg")}
                  style={{ width: "25px" }}
                />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}

let mapStateToProps = state => {
  console.log("reducer state from home.js: ", state);
  return {
    pos_session_id: state.pos_session_id,
    user: state.userReducer
  };
};

export default connect(mapStateToProps)(Draw);
