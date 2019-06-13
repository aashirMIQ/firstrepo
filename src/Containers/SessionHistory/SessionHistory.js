import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllSessions } from "../../oscar-pos-core/actions";
import "./SessionHistory.css";
let sessionDetails = {};
const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};
class SessionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionData: {}
    };
  }

  componentWillMount() {
    this.props
      .dispatch(getAllSessions(null, this.props.user.id))
      .then(data => {
        console.log("all session get from UI: ", data);
      })
      .catch(error => {
        console.error("error all session get from UI: ", error);
      });
  }

  viewDetails = data => {
    //start working from there to navigate new screen
    // sessionDetails = data;

    this.props.history.push({
      pathname: "/sessionDetails",
      state: {
        sessionDetails: data
      }
    });

    console.log("data: ", data);
  };
  render() {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
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
            Session History
          </div>
        </header>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridAutoRows: "10emem",
            background: "#fff",
            overflowX: "hidden",
            overflowY: "scroll"
          }}
        >
          {this.props.sessions.map((data, i) => {
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gridTemplateRows: "minmax( 7em,auto)",
                  backgroundColor: "#f1f4f7",
                  color: "#222e37",
                  margin: "1em"
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)"
                  }}
                >
                  <div style={{ ...styles.center, flexDirection: "column" }}>
                    <div>POS Session ID</div>
                    <div>{data.id}</div>
                  </div>
                  <div style={{ ...styles.center, flexDirection: "column" }}>
                    <div>Start AT</div>
                    <div>{data.start_at}</div>
                  </div>
                  <div style={{ ...styles.center, flexDirection: "column" }}>
                    <div>Close AT</div>
                    <div>{data.stop_at}</div>
                  </div>
                  <div
                    style={
                      {
                        // display: "flex",
                        // justifyContent: "flex-end",
                        // margin: "0 2em 2em 0"
                      }
                    }
                  >
                    <button
                      onClick={() => this.viewDetails(data)}
                      style={{
                        padding: "1em 6em",
                        background: "#222e37",
                        border: "none",
                        borderRadius: "2px",
                        color: "#fff",
                        outlineColor: "#fff"
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
    user: state.userReducer
    // change: state.currentOrderInfoReducer.change,
    // tenderAmount: state.currentOrderInfoReducer.tenderAmount
  };
})(SessionHistory);
