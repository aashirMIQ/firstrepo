import React, { Component } from "react";
// import logo from "./logo.svg";

import {
  Button,
  Modal,
  DropdownButton,
  Dropdown,
  Badge
} from "react-bootstrap";
import { connect } from "react-redux";


import "./CurrentSale.css";

class CurrentSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badgeNum: 0
    };
  }

  componentDidMount() {
    console.log("Cart>Badge: ");
  }

  badgeNum = () =>{
      let {cart} = this.props, badgeNum = 0;
        badgeNum = Object.keys(cart).length;
        this.setState({badgeNum});
  }

  componentWillReceiveProps(){
      this.badgeNum()
  }
  render() {
    return (
      <div>
         <div className="currentSale-wrapper">
              <div>
                <DropdownButton
                  id="dropdown-basic-button"
                  title="Dropdown button"
                >
                  <Dropdown.Item>Clear Item</Dropdown.Item>
                </DropdownButton>;
              </div>
              <div>
                <img width="10px" src={require("../../assets/images/carticon.svg")} />
                <Badge variant="light">{this.state.badgeNum}</Badge>
              </div>
          </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  console.log(state);
  return {
    
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};
export default connect()(CurrentSale);
