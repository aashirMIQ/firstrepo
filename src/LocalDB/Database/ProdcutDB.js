import PouchDB from "pouchdb";
import Products from "../products.json";
import { resolve, reject } from "bluebird-lst";
var productsDB = new PouchDB("products");
var remoteCouch = false;

// productsDB
//   .destroy()
//   .then(function(response) {
//     console.log("database destroy: ", response);
//     // success
//   })
//   .catch(function(err) {
//     console.log(err);
//   });
// for (let i = 0; i < Products.length; i++) {
//   Products[i]._id = Products[i].id;
//   Products[i]._id = String(Products[i]._id);
//   delete Products[i].id;
// }

// inserting bulk data into productDB;********************
// console.log("all products from poucdb: ", Products);
// insertBulk(Products);
// inserting bulk data into productDB;********************

// function addproduct(productObj) {
//   let id = Date.now().toString()
//   let product = {
//     _id: id,
//     ...productObj
//   };
//   productsDB.put(product, function callback(err, result) {
//     if (!err) {
//       console.log("Successfully posted a product!: ", result);
//       return;
//     }
//     console.error("error from addProduct: ", err);
//   });
// }
class ProdcutDB{
  static insertBulk(arrayOfDocs) {
    return new Promise((resolve, reject) => {
      productsDB
        .bulkDocs(arrayOfDocs)
        .then(function(result) {
          // handle result
          console.log("bulk docs inserted: ", result);
          resolve(result);
        })
        .catch(function(err) {
          console.error("from insertBulk: ", err);
          reject(err);
        });
    });
  }

  static getAllProducts() {
    return new Promise((resolve, reject) => {
      productsDB
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
export function insertBulk(arrayOfDocs) {
  return new Promise((resolve, reject) => {
    productsDB
      .bulkDocs(arrayOfDocs)
      .then(function(result) {
        // handle result
        console.log("bulk docs inserted: ", result);
        resolve(result);
      })
      .catch(function(err) {
        console.error("from insertBulk: ", err);
        reject(err);
      });
  });
}

// function updateProduct(id, updateObj) {
//   return new Promise((resolve, reject)=>{
//     productsDB
//       .get(id)
//       .then(doc => {
//         return productsDB.put({
//           _id: id,
//           _rev: doc._rev,
//           ...updateObj
//         });
//       })
//       .then(result => {
//         console.log("updatedTodo: ", result);
//         resolve(result);
//       })
//       .catch(error => {
//         console.error("from updateTodo error: ", error);
//         reject()
//       });
//   })
// }

export function getAllProducts() {
  return new Promise((resolve, reject) => {
    productsDB
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

productsDB
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


export default ProdcutDB;