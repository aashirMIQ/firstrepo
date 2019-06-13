import PouchDB from "pouchdb";
import productCategories from "../LocalDB/ProductsWithCategory";
import newproducts from "../LocalDB/newproducts";
var productsDB = new PouchDB("products");
PouchDB.plugin(require("pouchdb-find").default);
PouchDB.plugin(require("pouchdb-upsert"));

console.log("prod: ", productsDB);

var remoteCouch = false;
let barcodes = [
  "8964000681114",
  "4800361381222",
  "4005808811052",
  "3574660519464",
  "038000845529",
  "9555589209654",
  "4033100026874",
  "8961008211626"
];

/* db query inside for loop */
// for (let i = 0; i < barcodes.length; i++) {
//   console.log(i);
//   (function(barcodes, i) {
//     ProdcutDB.productQuery("null", barcodes[i])
//       .then(data => {
//         console.log("inside for loop database query by barcode: ", data);
//       })
//       .catch(error => {
//         console.log("error inside for loop database query by barcode: ", error);
//       });
//   })(barcodes, i);
// }
/* db query inside for loop */

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
// let array = [];
// for (let i in productCategories) {
//   for (let j = 0; j < newproducts.length; j++) {
//     if (i == newproducts[j].barcode) {
//       let obj = {
//         ...newproducts[j],
//             _id:newproducts[j].id.toString(),
//         category: productCategories[i][0],
//         subcategory: productCategories[i][1]
//       };
//       array.push(obj);
//     }
//   }
// }
// ProdcutDB.insertBulk(array);
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

//for inserting new product into db
// let obj = {
//   product_tmpl_id: [91303, "Discount"],
//   tracking: "none",
//   list_price: 1,
//   description: false,
//   pos_categ_id: false,
//   price: 1,
//   barcode: "191303",
//   item_code: "191303",
//   kitchen_code: false,
//   uom_id: [1, "Unit(s)"],
//   allow_custom_price: false,
//   default_code: false,
//   product_modifiers: [],
//   to_weight: false,
//   display_name: "Discount",
//   description_sale: false,
//   id: 89834,
//   taxes_id: []
// };
// ProdcutDB.insertProduct(obj)
//for inserting new product into db

class ProdcutDB {
  static updateProdInventory(db, id, qty, type) {
    return new Promise((resolve, reject) => {
      productsDB
        .upsert(id.toString(), doc => {
          console.log("founded product::::: ", doc);
          doc.qty_in_stock = isNaN(Number(doc.qty_in_stock))
            ? -Number(qty)
            : Number(doc.qty_in_stock) - Number(qty);
          return doc;
        })
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static removeProductFromDb(db, product_id) {
    console.log("product_id:: ", product_id);
    return new Promise((resolve, reject) => {
      productsDB
        .get(product_id.toString())
        .then(function(doc) {
          return productsDB.remove(doc);
        })
        .then(function(result) {
          // handle result
          console.log("result from delete product database: ", result);
          resolve(product_id);
        })
        .catch(function(error) {
          console.log("error from delete product database", error);
          reject(error);
        });
    });
  }
  static updateProductInDb(db, product) {
    console.log("productObj: ", product);
    let doc = {};
    let productObj = product;
    return new Promise((resolve, reject) => {
      productsDB
        // .get(product.product_id.toString())
        // .then(doc => {
        //   return productsDB.put({
        //     _id: product.product_data._id.toString(),
        //     // _rev: doc._rev,
        //     ...product.product_data
        //   });
        // })
        .upsert(product.product_id.toString(), doc => {
          console.log("founded product::::: ", doc);
          for (let i in doc) {
            if (i != "_rev") {
              doc[i] = product.product_data[i];
            }
          }
          return doc;
        })
        .then(result => {
          console.log("productObj: ", productObj);
          console.log("result from update product db function: ", result);
          resolve(result);
        })
        .catch(error => {
          console.log("error from update product db function: ", error);
          reject(error);
        });
    });
  }
  static loadProductsInDB() {
    return new Promise((resolve, reject) => {
      let array = [];
      for (let i in productCategories) {
        for (let j = 0; j < newproducts.length; j++) {
          if (i == newproducts[j].barcode) {
            let obj = {
              ...newproducts[j],
              _id: newproducts[j].id.toString(),
              standard_price: newproducts[j].list_price * 0.85,
              qty_in_stock: 0,
              category: productCategories[i][0],
              subcategory: productCategories[i][1]
            };
            array.push(obj);
          }
        }
      }
      ProdcutDB.insertBulk(array)
        .then(data => {
          /* for adding discount product in database */
          let obj = {
            product_tmpl_id: [91303, "Discount"],
            tracking: "none",
            list_price: 1,
            description: false,
            pos_categ_id: false,
            price: 1,
            barcode: "191303",
            item_code: "191303",
            kitchen_code: false,
            uom_id: [1, "Unit(s)"],
            allow_custom_price: false,
            default_code: false,
            product_modifiers: [],
            to_weight: false,
            display_name: "Discount",
            description_sale: false,
            id: 89834,
            taxes_id: []
          };
          ProdcutDB.insertProduct(obj);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static insertProduct(productObj) {
    let product = {
      _id: productObj.id.toString(),
      ...productObj
    };
    productsDB.put(product, function callback(err, result) {
      if (!err) {
        console.log("Successfully posted a product!: ", result);
        return;
      }
      console.error("error from addProduct: ", err);
    });
  }
  static searchProductByCategories(db, category, subcategory) {
    console.log("category: ", category, " subcategory: ", subcategory);
    return new Promise((resolve, reject) => {
      console.time();
      productsDB
        .find({
          selector: {
            $and: [
              { category: category },
              {
                subcategory: {
                  $regex: new RegExp("^" + subcategory.toLowerCase(), "i")
                }
              }
            ]
          }
        })
        .then(data => {
          console.timeEnd();
          console.log("docs of categorized Products: ", data);
          resolve(data);
        })
        .catch(error => {
          console.log("error from categorized products: ", error);
          reject(error);
        });
    });
  }
  static createProductInDb(db, obj) {
    return new Promise((resolve, reject) => {
      obj._id = obj.id.toString();
      productsDB
        .put({
          ...obj
        })
        .then(function(response) {
          // handle response
          console.log("add product response from database: ", response);
          resolve(obj);
        })
        .catch(function(err) {
          console.log("error add product response from database: ", err);
          reject(err);
        });
    });
  }
  static productQuery(db, stringForMatching) {
    return new Promise((resolve, reject) => {
      productsDB
        .find({
          selector: {
            $or: [
              {
                display_name: {
                  $regex: new RegExp("^" + stringForMatching.toLowerCase(), "i")
                }
              },
              {
                barcode: stringForMatching
              }
            ]
          },
          limit: 20
        })
        .then(function(result) {
          // console.log("result from db: ", result.docs);
          resolve(result.docs);
          // handle result
        })
        .catch(function(err) {
          console.log("error from db: ", err);
          reject(err);
        });
    });
  }

  static createIndexing() {
    console.log("productDB.createIndex: ", productsDB.createIndex);
    productsDB
      .createIndex({
        index: {
          fields: ["_id", "barcode", "display_name", "category", "subcategory"]
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

  static deleteAllProducts() {
    productsDB.allDocs({ include_docs: true }, function(err, docs) {
      if (!err) {
        console.log("products are going to delete: :::::::::::::: ");
        console.log(docs.rows);
        productsDB.bulkDocs(docs.rows, function(err, response) {
          if (err) {
            return console.log(err);
          } else {
            console.log("now products deleted: :::::::::::::: ");
            console.log(response + "Documents deleted Successfully");
          }
        });
      } else {
        return console.log(err);
      }
    });
  }

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

  static getProductsFromDb() {
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
          console.log("after normalizing data: ", data);
          resolve(data);
        })
        .catch(error => {
          console.error("from getAllTodo: ", error);
          reject(error);
        });
    });
  }

  static getTopProductsFromDb() {
    return new Promise((resolve, reject) => {
      productsDB
        .allDocs({
          include_docs: true,
          attachments: true,
          limit: 20
        })
        .then(docs => {
          console.log("all fetched product documents: ", docs);
          let rows = docs.rows,
            data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].doc);
          }
          console.log("after normalizing data: ", data);
          resolve(data);
        })
        .catch(error => {
          console.error("from getAllTodo: ", error);
          reject(error);
        });
    });
  }
}

// let obj = {
//   product_tmpl_id: [91303, "Discount"],
//   tracking: "none",
//   list_price: 1,
//   description: false,
//   pos_categ_id: false,
//   price: 1,
//   barcode: "191303",
//   item_code: "191303",
//   kitchen_code: false,
//   uom_id: [1, "Unit(s)"],
//   allow_custom_price: false,
//   default_code: false,
//   product_modifiers: [],
//   to_weight: false,
//   display_name: "Discount",
//   description_sale: false,
//   id: 89834,
//   taxes_id: []
// };
// ProdcutDB.insertProduct(obj)
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
