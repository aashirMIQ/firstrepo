import { connect } from "react-redux";
import {
  Menu,
  Container,
  Dropdown,
  Header,
  Grid,
  Sidebar,
  Icon
} from "semantic-ui-react";

import React, { Component } from "react";
import ReactHighcharts from "react-highcharts";

class Chart extends React.Component {
  constructor(props) {
    super(props);

    ReactHighcharts.Highcharts.setOptions({
      lang: {
        thousandsSep: ","
      }
    });
  }

  render() {
    const displayTitle = title => {
      if (title) {
        return (
          <Grid.Row style={styles.heading}>
            <Header as="h5" style={styles.headingText}>
              {this.props.title}
            </Header>
          </Grid.Row>
        );
      }

      return null;
    };
    return (
      <Grid.Column verticalAlign="top">
        {displayTitle(this.props.title)}
        <div>
          <ReactHighcharts config={this.props.data} />
        </div>
      </Grid.Column>
    );
  }
}

const styles = {
  headingText: {
    fontSize: 16,
    fontWeight: 400,
    color: "#666874",
    paddingBottom: 20,
    paddingLeft: 5,
    textTransform: "uppercase",
    // fontFamily: "Roboto"
  },
  heading: {
    color: "#af2d2d",
    borderBottom: "1px solid #c1c1c5",
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0
  }
};

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  {}
)(Chart);
