import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { formatNum } from "../../oscar-pos-core/constants";
import { getCategories, getThisSubCategory } from "../../oscar-pos-core/actions";
import Loader from "react-loader-spinner";
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

class SubCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      isLoading: true
    };
  }
  componentDidMount() {
    
  }


  
  render() {
    // if (this.state.isLoading) {
    //   return (
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center"
    //       }}
    //     >
    //       <Loader type="Grid" color="#662d94" height={50} width={50} />
    //     </div>
    //   );
    // }
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gridGap: "1em",
          padding: "1em"
        }}
      >
        {this.props.subCategories.length &&
          this.props.subCategoires.map((category, i) => {
            return (
              <div
                // onClick={()=>this.getThisSubCategory(category)}
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid",
                  cursor: "pointer"
                }}
              >
                <div>{category}</div>
              </div>
            );
          })}
      </div>
    );
  }
}

export default connect(state => {
  console.log("reducer state from home.js: ", state);
  return {
    products: state.products,
    cart: state.cart,
    subCategories: state.mainCategories.subCategories
  };
})(SubCategories);
