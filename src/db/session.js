import PouchDB from "pouchdb";
import { SessionSchema } from "./Schema";
import { uuid } from "../oscar-pos-core/constants";
import OrderDB from "./order";
let sessionDB = new PouchDB("sessionDB");

class SessionDB {
  static checkPosSessionInDb(db, user_id) {
    return new Promise((resolve, reject) => {
      sessionDB
        .find({
          selector: {
            $and: [
              {
                user_id: user_id
              },
              { state: "open" }
            ]
          }
        })
        .then(sessions => {
          console.log("to check user session open or not: ", sessions);
          resolve(sessions.docs[0]);
        })
        .catch(error => {
          console.log("error to check user session open or not: ", error);
        });
    });
  }
  static getAllSessionsFromDb(db, user_id) {
    return new Promise((resolve, reject) => {
      sessionDB
        .find({
          selector: {
            user_id: user_id
          }
        })
        .then(sessions => {
          console.log("all session for session history: ", sessions);
          resolve(sessions.docs);
        })
        .catch(error => {
          console.log("error all session for session history: ", error);
        });
    });
  }
  static setClosingBalanceInDb(db, amount, pos_session_id) {
    return new Promise((resolve, reject) => {
      SessionDB.getSessionById(null, pos_session_id)
        .then(doc => {
          let sessionDoc = doc.docs[0];
          sessionDoc.cash_register_balance_end_real = amount;
          SessionDB.updateSession(null, sessionDoc).then(res => {
            resolve(sessionDoc);
          });
        })
        .catch(error => {
          console.log("error from setClosingBalanceInDb: ", error);
        });
    });
  }
  static getSessionSummaryFromDb(db, sessionId) {
    return new Promise((resolve, reject) => {
      SessionDB.getSessionById(db, sessionId)
        .then(doc => {
          let sessionDoc = doc.docs;
          resolve(sessionDoc);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static setOpeningBalanceInDb(db, amount, pos_session_id) {
    console.log("openSessionResponse3: ", pos_session_id);
    return new Promise((resolve, reject) => {
      SessionDB.getSessionById(db, pos_session_id).then(doc => {
        let sessionDoc = doc.docs[0];
        console.log("sessionDoc: ", sessionDoc);
        sessionDoc.cash_register_balance_start = amount;
        SessionDB.updateSession(db, sessionDoc)
          .then(res => {
            resolve(sessionDoc);
          })
          .catch(error => {
            console.error("error from setOpeningBalanceInDb: ", error);
            reject(error);
          });
      });
    });
  }

  static openSessionInDb(db, userId) {
    let id = uuid();
    let obj = {
      id,
      user_id: userId,
      state: "open",
      start_at: new Date(),
      stop_at: null,
      cash_register_balance_start: 0, //float
      cash_register_balance_end: 0, //float
      cash_register_balance_end_real: 0, //float
      cash_register_difference: 0, //float
      no_of_transactions: 0, //int
      no_of_customers: 0, //int
      total_money_in_amount: 0, //int
      total_money_out_amount: 0, //int
      money_in: [], //this array's object fullfill the constraint of moneyin
      money_out: [], //this array's object fullfill the constraint of moneyout
      total_transactions_amount: 0, //float
      total_amount_paid: 0, //float
      total_outstanding_amount: 0 //float}
    };
    return new Promise((resolve, reject) => {
      if (userId.toString().length) {
        localStorage.setItem("pos_session_id", JSON.stringify(obj.id));
        obj._id = obj.id;
        sessionDB
          .put({
            ...obj
          })
          .then(data => {
            resolve(obj.id);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject({ message: "userId must be define" });
      }
    });
  }

  static getSessionById(db, pos_session_id) {
    return new Promise((resolve, reject) => {
      console.log("pos_session_id for database query: ", pos_session_id);
      sessionDB
        .find({ selector: { id: pos_session_id } })
        .then(data => {
          console.log("getSessionById: ", data);
          resolve(data);
        })
        .catch(error => {
          console.log("error getSessionById: ", error);
        });
    });
  }
  static updateSession(db, updatingSessionObj) {
    return new Promise((resolve, reject) => {
      console.log("data: ", updatingSessionObj);
      sessionDB
        .put({
          _id: updatingSessionObj._id,
          ...updatingSessionObj
        })
        .then(doc => {
          console.log("updatingSessionObj: ", updatingSessionObj);
          resolve(updatingSessionObj);
        });
    });
  }

  static closePosSessionInDb(db, pos_session_id, session_id) {
    let total_transactions_amount = 0;
    let total_amount_paid = 0;
    let total_outstanding_amount = 0;
    // let session = realm.objects(SESSION_SCHEMA).filtered('id= $0', selectedSession)
    let customers = 1;
    return new Promise((resolve, reject) => {
      OrderDB.getOrderByPosSessionId(null, pos_session_id)
        .then(orderDoc => {
          let orderRes = orderDoc.docs;
          SessionDB.getSessionById(null, pos_session_id).then(sessionRes => {
            let sessionDoc = sessionRes.docs[0];
            console.log("session and order res", orderRes, sessionDoc);
            for (let i = 0; i < orderRes.length; i++) {
              total_amount_paid += orderRes[i].amount_paid;
              total_transactions_amount += orderRes[i].amount_total;
            }
            let cash_register_balance_end =
              total_amount_paid +
              sessionDoc.cash_register_balance_start +
              sessionDoc.total_money_in_amount -
              sessionDoc.total_money_out_amount;
            sessionDoc.total_amount_paid = total_amount_paid;
            sessionDoc.total_transactions_amount = total_transactions_amount;
            sessionDoc.state = "close";
            sessionDoc.stop_at = new Date();
            sessionDoc.cash_register_balance_end = cash_register_balance_end;
            sessionDoc.cash_register_difference =
              sessionDoc.cash_register_balance_end_real -
              cash_register_balance_end;
            sessionDoc.no_of_transactions = orderRes.length;
            sessionDoc.no_of_customers = 0; //will be update later;
            sessionDoc.total_outstanding_amount =
              total_transactions_amount - total_amount_paid;
            SessionDB.updateSession(null, sessionDoc).then(doc => {
              resolve(sessionDoc);
              console.log("sessionDoc: ", sessionDoc);
            });
          });
        })
        .catch(error => {
          console.log(
            "error all orders from orderdb of current session: ",
            error
          );
          reject(error);
        });
    });
  }
}

export default SessionDB;
