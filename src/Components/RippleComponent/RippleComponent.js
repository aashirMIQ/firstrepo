import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "./RippleComponent.css";
// import { getItem, getTotal } from "../../constants";

let Ripple = props => {
  return (
    <div className="ripple-container" {...props}>
      <div className="ripple">{props.children}</div>
    </div>
  );
};

export default Ripple;
