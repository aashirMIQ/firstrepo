import PouchDB from "pouchdb";
import { MoneyOutSchema } from "./Schema";
import SessionDB from "./session";
let moneyoutDB = new PouchDB("moneyOut");

class MoneyoutDB {
  static submitMoneyOut(db, moneyOutObj) {
    let moneyOutObjKeys = Object.keys(moneyOutObj),
      isObjValid = true;
    return new Promise((resolve, reject) => {
      for (let i in MoneyOutSchema.properties) {
        if (moneyOutObjKeys.indexOf(i) !== -1) {
          console.log("property found: ", i, moneyOutObjKeys.indexOf(i));
        } else {
          isObjValid = false;
          console.log("property not found: ", i);
        }
      }
      if (isObjValid) {
        console.log("object is valid");
        moneyoutDB
          .put({
            _id: moneyOutObj.id,
            ...moneyOutObj
          })
          .then(data => {
            console.log("moneyout data inserted into database: ", data);
            SessionDB.getSessionById(null, moneyOutObj.pos_session_id).then(
              doc => {
                let sessionObj = doc.docs[0];
                console.log("session obj: ", sessionObj);
                sessionObj.money_out.push(moneyOutObj);
                sessionObj.total_money_out_amount += moneyOutObj.amount;
                SessionDB.updateSession(null, sessionObj).then(data => {
                  resolve(data);
                });
              }
            );
          })
          .catch(error => {
            console.error(
              "error moneyout data inserted into database: ",
              error
            );
            reject(error);
          });
      } else {
        reject({ message: "object not valid" });
      }
    });
  }
}

export default MoneyoutDB;
