import PouchDB from "pouchdb";
import productCategories from "../LocalDB/ProductsWithCategory";
import newproducts from "../LocalDB/newproducts";
import { uuid } from "../oscar-pos-core/constants";
import products from "../LocalDB/newproducts";
import productDB from "./product";
import categories from '../LocalDB/ProductsWithCategory'
let categoryDB = new PouchDB("categoryDB");
let allBarCodes = Object.keys(categories);



/* to create object of category */
// let array = [];
// for(let i=0;i<products.length;i++){
//   if(allBarCodes.indexOf(products[i].barcode) !== -1){
//     let obj = {
//       barcode : products[i].barcode,
//       category : categories[products[i].barcode][0],
//       subcategory: categories[products[i].barcode][1]
//     }
//     array.push(obj);
//   }
// }
// console.log("normalized categories objects: ", array);
/* to create object of category */






//get product from database;
/* for (let i = 0; i < docs.length; i++) {
            (function(data) {
              productDB.productQuery(db, data[i].barcode).then(res => {
                array.push(res);
                console.log("res: ", res);
              });
            })(docs);
}  */

/* for inserting data into database */
// for (let i in products) {
//   let keys = Object.keys(categories);
//   if (keys.indexOf(products[i][0] == -1)) {
//     categories[products[i][0]] = [];
//   }
// }
// console.log("uniqueCategories: ", categories);
// let uniqueCategories = Object.keys(categories);
// for (let i = 0; i < uniqueCategories.length; i++) {
//   for(let j in products){
//     if(uniqueCategories[i] == products[j][0]){
//       categories[uniqueCategories[i]].push({subcategory: products[j][1], barcode: j})
//     }
//   }
// }
// let array = [];
// for(let i in categories){
//   array.push({[i]:categories[i]});
// }
// console.log('unique categories with subcategory: ',  array)
/* for inserting data into database */

class CategoryDB {
  static loadCategoriesInDB() {
    return new Promise((resolve, reject) => {
      let allBarCodes = Object.keys(categories);
      let array = [];
      for (let i = 0; i < products.length; i++) {
        if (allBarCodes.indexOf(products[i].barcode) !== -1) {
          let obj = {
            barcode: products[i].barcode,
            category: categories[products[i].barcode][0],
            subcategory: categories[products[i].barcode][1]
          };
          array.push(obj);
        }
      }
      CategoryDB.insertBulk(array)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
      console.log("normalized categories objects: ", array);
    });
  }
  static getCategorizedProducts(db, category, subcategory) {
    return new Promise((resolve, reject) => {
      productDB
        .searchProductByCategories(db, category, subcategory)
        .then(({ docs }) => {
          console.log("categorized data from categoryDb: ", docs);
          resolve(docs);
        })
        .catch(error => {
          console.error("error from categorized data: ", error);
          reject(error);
        });
    });
  }

  static getThisSubCategory(db, category) {
    return new Promise((resolve, reject) => {
      console.log("category: ", category);
      categoryDB
        .find({ selector: { category: category } })
        .then(data => {
          let array = [];
          console.log("sub categories are: ", data);
          let { docs } = data,
            subCategories = [];
          for (let i = 0; i < docs.length; i++) {
            let eachDocSubCategory = [];
            eachDocSubCategory = docs[i].subcategory.split(" ");
            for (let i = 0; i < eachDocSubCategory.length; i++) {
              if (
                subCategories.indexOf(eachDocSubCategory[i]) === -1 &&
                eachDocSubCategory[i] != "&" &&
                eachDocSubCategory[i] != "/"
              ) {
                subCategories.push(eachDocSubCategory[i]);
              }
            }
          }
          console.log(subCategories);
          resolve(subCategories);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static addCategory(db, categoryObj) {
    return new Promise((resolve, reject) => {
      categoryDB
        .put({
          _id: categoryDB.id.toString(),
          ...categoryObj
        })
        .then(doc => {
          categoryObj._id = doc._id;
          categoryObj._rev = doc._rev;
          resolve(categoryObj);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static getCategoriesFromDb() {
    return new Promise((resolve, reject) => {
      categoryDB
        .allDocs({
          include_docs: true,
          attachments: true
        })
        .then(docs => {
          console.log("all fetched categories documents: ", docs);
          let rows = docs.rows,
            data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].doc);
          }
          console.log("categories after normalizing data: ", data);
          resolve(data);
        })
        .catch(error => {
          console.error("errors from categories: ", error);
          reject(error);
        });
    });
  }

  static getMainCategories() {
    return new Promise((resolve, reject) => {
      CategoryDB.getCategoriesFromDb()
        .then(data => {
          let array = [];
          console.log("Data : ", data);
          for (let i = 0; i < data.length; i++) {
            if (array.indexOf(data[i].category) == -1) {
              array.push(data[i].category);
            }
          }
          console.log("************************: ", array);
          resolve(array);
        })
        .catch(error => {
          console.log("error from getMainCategories: ", error);
          reject(error);
        });
    });
  }

  static insertCategoriesData(obj) {
    return new Promise((resolve, reject) => {
      categoryDB
        .put({
          _id: Date.now().toString(),
          categories: obj
        })
        .then(data => {
          console.log("categories are stored in database: ", data);
          resolve(data);
        })
        .catch(error => {
          console.log("error categories are stored in database: ", error);
          reject(error);
        });
    });
  }

  static insertBulk(arrayOfDocs) {
    return new Promise((resolve, reject) => {
      categoryDB
        .bulkDocs(arrayOfDocs)
        .then(function (result) {
          // handle result
          console.log("bulk docs inserted: ", result);
          resolve(result);
        })
        .catch(function (err) {
          console.error("from insertBulk: ", err);
          reject(err);
        });
    });
  }
}

export default CategoryDB;
