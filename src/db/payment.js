import Pouch from "pouchdb";
import CustomerDB from "./customer";
import { uuid } from "../oscar-pos-core/constants/index";
const paymentDb = Pouch("paymentDB");

export default class PaymentDB {
  static createPaymentInDb(db, params) {
    return new Promise((resolve, reject) => {
      CustomerDB.getCustomerById(null, params.id)
        .then(customer => {
          console.log("customer from payment DB: ", customer);
          if (params.payment_mode === "Udhaar") {
            customer.total_outstanding_payment += params.amount;
          } else {
            customer.total_outstanding_payment -= params.amount;
          }
          customer.total_outstanding_payment = Math.abs(
            customer.total_outstanding_payment
          );
          CustomerDB.updateCustomer(null, customer)
            .then(doc => {
              console.log(
                "update customer in database from paymentDB: ",
                customer
              );
              let data = {
                id: uuid(),
                customer_id: params.id,
                user_id: params.session_id,
                amount: params.amount,
                date: new Date(),
                payment_mode: params.payment_mode
              };
              paymentDb
                .put({
                  _id: data.id,
                  ...data
                })
                .then(res => {
                  console.log("payment data inserted into database: ", res);
                  resolve(customer);
                })
                .catch(error => {
                  console.log(
                    "error payment data inserted into database: ",
                    error
                  );
                });
            })
            .catch(error => {
              console.error(
                "error update customer in database from paymentDB: ",
                error
              );
            });
        })
        .catch(error => {
          console.error("error from getting customer in PaymentDB: ", error);
        });
    });
  }

  static getCreditHistoryFromDB(db, partner_id) {
    return new Promise((resolve, reject) => {
      paymentDb
        .find({
          selector: {
            customer_id: partner_id
          }
        })
        .then(res => {
          console.log("getCreditHistory response comming from database: ", res);
          let sortedData = res.docs.sort(function(a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
          });
          resolve(sortedData);
        })
        .catch(error => {
          console.error(
            "error getCreditHistory response comming from database: ",
            error
          );
          reject(error);
        });
    });
  }

  static getCreditHistoryOfSearchedCustomer(db, customer_id) {
    return new Promise((resolve, reject) => {
      CustomerDB.getCustomerByPhoneOrName(db, customer_id).then(data => {
        console.log(
          "response from getCreditHistoryOfSearchedCustomer::: ",
          data
        );
      });
    });
  }
}
