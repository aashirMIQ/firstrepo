import PouchDB from "pouchdb";
import { CustomerSchema } from "../oscar-pos-core/Schema";
let customerDB = new PouchDB("customer");

class CustomerDB {
  static getCustomersFromDb(db, user_id) {
    return new Promise((resolve, reject) => {
      customerDB
        .find({
          selector: {
            user_id: user_id
          }
        })
        .then(docs => {
          console.log("all fetched customers documents: ", docs.docs);
          resolve(docs.docs);
        })
        .catch(error => {
          console.error("error all fetched customers documents: ", error);
          reject(error);
        });
    });
  }
  static createCustomerInDb(db, customerObj, session_id) {
    return new Promise((resolve, reject) => {
      if (customerObj) {
        let customerObjKeys = Object.keys(customerObj),
          isCustomerValid = true;
        console.log("customerObjKeys: ", customerObjKeys);
        for (let i in CustomerSchema.properties) {
          if (customerObjKeys.indexOf(i) !== -1) {
            console.log("property found: ", i, customerObjKeys.indexOf(i));
          } else {
            isCustomerValid = false;
            console.log("property not found: ", i);
          }
        }
        if (isCustomerValid) {
          customerDB
            .put({
              ...customerObj
            })
            .then(response => {
              customerObj.rev = response.rev;
              console.log("response from customer database: ", response);
              console.log("customer added into database: ", customerObj);
              resolve(customerObj);
            })
            .catch(error => {
              console.log("error from adding customer:: ", error);
              reject(error);
            });
        }
      }
    });
  }

  static getCustomerById(db, customerID) {
    return new Promise((resolve, reject) => {
      customerDB
        .find({
          selector: {
            _id: customerID
          }
        })
        .then(res => {
          console.log("res from getCustomerById: ", res);
          resolve(res.docs[0]);
        })
        .catch(error => {
          console.error("error res from getCustomerById: ", error);
        });
    });
  }

  static customerQuery(db, customerId, userId) {
    return new Promise((resolve, reject) => {
      customerDB
        .find({
          selector: {
            $and: [
              {
                $or: [
                  {
                    name: {
                      $regex: new RegExp("^" + customerId.toLowerCase(), "i")
                    }
                  },
                  {
                    user_id: {
                      $regex: new RegExp("^" + customerId.toLowerCase(), "i")
                    }
                  },
                  {
                    phone: {
                      $regex: new RegExp("^" + customerId.toLowerCase(), "i")
                    }
                  }
                ]
              },
              {
                user_id: userId
              }
            ]
          }
        })
        .then(response => {
          console.log(
            customerId,
            " customer response comming from pouchdb: ",
            response
          );
          resolve(response.docs);
        })
        .catch(error => {
          console.log("error from customersearching pouchdb: ", error);
          reject(error);
        });
    });
  }

  static getCustomerByPhoneOrName(db, customerId) {
    return new Promise((resolve, reject) => {
      customerDB
        .find({
          selector: {
            $or: [
              {
                name: {
                  $regex: new RegExp("^" + customerId.toLowerCase(), "i")
                }
              },
              {
                phone: {
                  $regex: new RegExp("^" + customerId.toLowerCase(), "i")
                }
              }
            ]
          },
          limit: 10
        })
        .then(response => {
          console.log(
            customerId,
            " customer response comming from pouchdb: ",
            response
          );
          resolve(response.docs);
        })
        .catch(error => {
          console.log("error from customersearching pouchdb: ", error);
          reject(error);
        });
    });
  }
  static deleteCustomer(db, customerId) {
    console.log("customerId:: ", customerId);
    return new Promise((resolve, reject) => {
      customerDB
        .get(customerId)
        .then(function(doc) {
          return customerDB.remove(doc);
        })
        .then(function(result) {
          // handle result
          console.log("result from delete customer database: ", result);
          resolve(customerId);
        })
        .catch(function(error) {
          console.log("error from delete customer database", error);
          reject(error);
        });
    });
  }

  static updateCustomer(db, customer) {
    console.log("customerObj: ", customer);
    return new Promise((resolve, reject) => {
      customerDB
        .get(customer._id)
        .then(doc => {
          return customerDB.put({
            _id: customer._id,
            _rev: doc._rev,
            ...customer
          });
        })
        .then(result => {
          console.log("result from update customer db function: ", result);
          resolve(result);
        })
        .catch(error => {
          console.log("error from update customer db function: ", error);
          reject(error);
        });
    });
  }

  static updateCustomerInDb(db, customer) {
    console.log("customerObj: ", customer);
    return new Promise((resolve, reject) => {
      customerDB
        .get(customer.customer_id)
        .then(doc => {
          return customerDB.put({
            _id: customer.customer_id,
            _rev: doc._rev,
            ...customer.customer_data
          });
        })
        .then(result => {
          console.log("result from update customer db function: ", result);
          resolve(result);
        })
        .catch(error => {
          console.log("error from update customer db function: ", error);
          reject(error);
        });
    });
  }
}
// customerDB
//   .changes({
//     since: "now",
//     live: true,
//     include_docs: true
//   })
//   .on("change", function(change) {
//     // handle change
//     console.log("from customerdb change: ", change);
//   })
//   .on("complete", function(info) {
//     // changes() was canceled
//     console.log("from customerdb completed: ", info);
//   })
//   .on("error", function(err) {
//     console.log(err);
//   });
export default CustomerDB;
