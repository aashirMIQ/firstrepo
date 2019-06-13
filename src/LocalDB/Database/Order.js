import PouchDB from "pouchdb";
import moment from "moment";
import validate from "validator";
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
  static createOrder(orderObj) {
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
      if (
        (typeof orderObj.id === "string" &&
          Number.isInteger(orderObj.user_id) &&
          Number.isInteger(orderObj.pos_session_id) &&
          typeof orderObj.to_invoice === "boolean" &&
          typeof orderObj.name === "string" &&
          Number.isInteger(orderObj.partner_id) &&
          // validate.isFloat(orderObj.amount_paid) &&
          moment(orderObj.creation_date).isValid() &&
          // validate.isFloat(orderObj.amount_tax) &&
          Number.isInteger(orderObj.amount_return) &&
          (typeof lines.order_id === "string" ||
            (lines.note && typeof lines.note === "string") ||
            (lines.discount_note &&
              typeof lines.discount_note === "string" &&
              Number.isInteger(lines.product_id) &&
              Number.isInteger(lines.price_unit) &&
              Number.isInteger(lines.qty) &&
              validate.isBoolean(lines.isVoid) &&
              Number.isInteger(lines.discount)) ||
            (lines.pack_lot_ids && lines.pack_lot_ids.length) ||
            (lines.tax_ids && lines.tax_ids)) 
          //   &&
          // validate.isFloat(orderObj.amount_total)
          ) ||
        (orderObj.account_id && Number.isInteger(orderObj.account_id)) ||
        (orderObj.statement_id && Number.isInteger(orderObj.statement_id)) ||
        (orderObj.journal_id && Number.isInteger(orderObj.journal_id)) ||
        (orderObj.amount && Number.isInteger(orderObj.amount))
      ) {
        ordersDB
          .put({
            _id: orderObj.id,
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

  static getAllorders() {
    return new Promise((resolve, reject) => {
      ordersDB
        .allDocs({
          include_docs: true,
          attachments: true
        })
        .then(docs => {
          console.log("all fetched product documents: ", docs);
          let rows = docs.rows,
            data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].doc);
          }
          resolve(data);
        })
        .catch(error => {
          console.error("from getAllTodo: ", error);
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