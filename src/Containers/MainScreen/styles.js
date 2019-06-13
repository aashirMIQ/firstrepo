const styles = {
  mainContainer: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#662d94",
    alignItems: "center",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "1fr 1fr 1fr"
  },
  oscarImg: {
    width: "10vw",
    height: "20vh"
    // border: "1px solid #fff",
  },
  rowMain: {
    width: "100vw",
    height: "30vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // border: "1px solid #fff",
    padding: "0 20em"
  },
  boxMain: {
    width: "10vw",
    height: "20vh",
    // border: "1px solid #fff",
    display: "flex",
    flexDirection: "column",
    // borderRadius: 13,
    justifyContent: "space-around",
    alignItems: "center",
    cursor: "pointer"
  },
  boxInner: {
    width: "8vw",
    height: "13vh",
    // border: "3px solid #ffbf00",
    border: "0px",
    backgroundImage:
      "linear-gradient(135deg, rgba(209,79,251,1) 0%, rgba(149,140,220,1) 100%)",
    display: "flex",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center"
  },
  boxIcon: {
    width: "44px"
    // height: "8vh"
    // border: "1px solid #fff",
  },
  text: {
    color: "white",
    fontSize: "20px"
  }
};

export default styles;
