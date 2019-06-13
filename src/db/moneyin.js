import PouchDB from "pouchdb";
import { MoneyInSchema } from "./Schema";
import SessionDB from "./session";
let moneyinDB = new PouchDB("moneyIn");

class MoneyinDB {
  static submitMoneyIn(db, moneyInObj) {
    let moneyInObjKeys = Object.keys(moneyInObj),
      isObjValid = true;
    return new Promise((resolve, reject) => {
      for (let i in MoneyInSchema.properties) {
        if (moneyInObjKeys.indexOf(i) !== -1) {
          console.log("property found: ", i, moneyInObjKeys.indexOf(i));
        } else {
          isObjValid = false;
          console.log("property not found: ", i);
        }
      }
      if (isObjValid) {
        console.log("object is valid");
        moneyinDB
          .put({
            _id: moneyInObj.id,
            ...moneyInObj
          })
          .then(data => {
            console.log("moneyin data inserted into database: ", data);
            SessionDB.getSessionById(null, moneyInObj.pos_session_id)
            .then(doc=>{
              let sessionObj = doc.docs[0];
              console.log('session obj: ', sessionObj)
              sessionObj.money_in.push(moneyInObj);
              sessionObj.total_money_in_amount += moneyInObj.amount;
               SessionDB.updateSession(null, sessionObj).then(data=>{
                 resolve(data);
               })
            })
          })  
          .catch(error => {
            console.error("error moneyin data inserted into database: ", error);
            reject(error);
          });
      } else {
        reject({ message: "object not valid" });
      }
    });
  }

  static;
}

export default MoneyinDB;
