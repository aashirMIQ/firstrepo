import PouchDB from "pouchdb";
import moment from "moment";
import validate from "validator";
import { OrderSchema } from "../oscar-pos-core/Schema";
PouchDB.plugin(require("pouchdb-find").default);
let ordersDB = new PouchDB("orders");
let ORDER_LINES_SCHEMA = "ORDER_LINES_SCHEMA";
let remoteCouch = false;

Number.prototype.isFloat = function(value) {
  value = value.toString();
  if (
    value.indexof(".") !== 0 &&
    value.indexof(".") !== value.length - 1 &&
    value.indexof(".") !== -1
  ) {
    return true;
  }
  return false;
};
let createOrder = {
  id: "string",
  user_id: "int",
  pos_session_id: "int",
  to_invoice: { type: "bool", default: false },
  name: "string",
  partner_id: "int",
  amount_paid: "float",
  creation_date: "date",
  amount_tax: "float",
  amount_return: "int",
  // sequence_number: "int",
  amount_total: "float",
  lines: { type: "list", objectType: ORDER_LINES_SCHEMA },
  // statement_ids: { type: 'list', objectType: JOURNAL_SCHEMA },
  account_id: { type: "int", optional: true },
  statement_id: { type: "int", optional: true },
  journal_id: { type: "int", optional: true },
  amount: { type: "int", optional: true }
};
let createOrderLinesProperty = {
  id: "string",
  order_id: "string",
  note: { type: "string", optional: true },
  discount_note: { type: "string", optional: true },
  product_id: "int",
  price_unit: "int",
  qty: "int",
  isVoid: { type: "bool", default: false },
  discount: "int",
  pack_lot_ids: { type: "list", objectType: "string", optional: true },
  tax_ids: { type: "list", objectType: "string", optional: true }
};

class OrdersDB {
  static createOrder(db, orderObj) {
    console.log("orderObj: ", orderObj);
    let lines = orderObj.lines[0];
    console.log(
      "check type: ",
      typeof orderObj.id,
      typeof orderObj.name,
      typeof lines.order_id,
      typeof lines.note,
      typeof lines.discount_note
    );

    return new Promise((resolve, reject) => {
      let orderObjKeys = Object.keys(orderObj),
        isOrderValid = true;
      console.log("orderObjKeys: ", orderObjKeys);
      for (let i in OrderSchema.properties) {
        if (orderObjKeys.indexOf(i) !== -1) {
          console.log("property found: ", i, orderObjKeys.indexOf(i));
        } else {
          isOrderValid = false;
          console.log("property not found: ", i);
        }
      }
      if (isOrderValid) {
        ordersDB
          .put({
            _id: orderObj.id,
            creation_date: new Date(),
            ...orderObj
          })
          .then(response => {
            orderObj._id = orderObj.id;
            orderObj.rev = response.rev;
            console.log("order inserted into orderDB: ", response);
            resolve(orderObj);
          })
          .catch(error => {
            console.error("error from order inserted into orderDB: ", error);
            reject(error);
          });
      } else {
        reject({ message: "data badly formated" });
      }
    });
  }

  static getAllOrdersFromDb(db, user_id, startDate, endDate) {
    return new Promise((resolve, reject) => {
      if (user_id && startDate) {
        console.log("startDate:::: ", new Date(Number(startDate)));
        ordersDB
          .find({
            selector: {
              $and: [
                { creation_date: { $gte: new Date(Number(startDate)) } },
                { creation_date: { $lte: new Date(Number(endDate)) } },
                { user_id: user_id }
              ]
            }
          })
          .then(docs => {
            console.log("all fetched product documents: ", docs);
            resolve(docs.docs);
          })
          .catch(error => {
            console.error("from getAllTodo: ", error);
            reject(error);
          });
      }
    });
  }

  static orderQuery(db, orderId) {
    return new Promise((resolve, reject) => {
      ordersDB
        .find({
          selector: {
            id: {
              $regex: new RegExp("^" + orderId.toLowerCase(), "i")
            }
          }
        })
        .then(response => {
          // console.log("order response comming from pouchdb: ", response);
          resolve(response.docs);
        })
        .catch(error => {
          console.log("error from ordersearching pouchdb: ", error);
          reject(error);
        });
    });
  }

  static createIndexing() {
    console.log("orderDB.createIndex: ", ordersDB.createIndex);
    ordersDB
      .createIndex({
        index: {
          fields: ["_id", "pos_session_id", "name"]
        }
      })
      .then(function(result) {
        console.log("indexing done::::::::::::::::::::::::::::: ", result);
        // handle result
      })
      .catch(function(err) {
        console.log(
          "error from indexing::::::::::::::::::::::::::::::::::: ",
          err
        );
      });
  }
  static getOrderByPosSessionId(db, pos_session_id) {
    return new Promise((resolve, reject) => {
      ordersDB
        .find({
          selector: {
            pos_session_id: pos_session_id
          }
        })
        .then(data => {
          console.log("get_order_by_pos_session_id: ", data);
          resolve(data);
        })
        .catch(error => {
          console.error("error get_order_by_pos_session_id: ", error);
          reject(error);
        });
    });
  }
}

ordersDB
  .changes({
    since: "now",
    live: true,
    include_docs: true
  })
  .on("change", function(change) {
    // handle change
    console.log("from productdb change: ", change);
  })
  .on("complete", function(info) {
    // changes() was canceled
    console.log("from productdb completed: ", info);
  })
  .on("error", function(err) {
    console.log(err);
  });

export default OrdersDB;
