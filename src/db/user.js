import PouchDB from "pouchdb";
import { UserSchema } from "./Schema";
const userDB = new PouchDB("userDB");

class UserDb {
  static createIndexing() {
    console.log("createIndexing: ", this.createIndexing);
    userDB
      .createIndex({
        index: {
          fields: ["_id", "phone_number", "password"]
        }
      })
      .then(result => {
        console.log(
          "index created in userDB::::::::::::::::::::::::::::: ",
          result
        );
      })
      .catch(error => {
        console.error(
          "error index created in userDB::::::::::::::::::::::: ",
          error
        );
      });
  }
  static signinUserInDb(db, userObj) {
    return new Promise((resolve, reject) => {
      if (userObj.phone_number && userObj.password) {
        userDB
          .find({
            selector: {
              $and: [
                { phone_number: userObj.phone_number },
                { password: userObj.password }
              ]
            }
          })
          .then(result => {
            console.log("res of login from db function: ", result.docs[0]);
            if (result.docs[0]) {
              resolve(result);
            }
            else {
              reject()
            }
          })
          .catch(error => {
            console.log("error res of login from db function: ", error);
            reject(error);
          });
      }
    });
  }
  static createUserInDb(db, userObj) {
    return new Promise((resolve, reject) => {
      let userObjKeys = Object.keys(userObj),
        isUserValid = true;
      console.log("userObjKeys: ", userObjKeys);
      for (let i in UserSchema.properties) {
        if (userObjKeys.indexOf(i) !== -1) {
          console.log("property found: ", i, userObjKeys.indexOf(i));
        } else {
          isUserValid = false;
          console.log("property not found: ", i);
        }
      }
      console.log(
        "after for loop:::::::::::::::::::::::::::::::::::: value of isUserValid: ",
        isUserValid
      );
      if (isUserValid) {
        userDB
          .put({
            _id: userObj.id,
            ...userObj
          })
          .then(response => {
            userObj._id = userObj.id;
            userObj.rev = response.rev;
            console.log("user inserted into userDB: ", response);
            resolve(userObj);
          })
          .catch(error => {
            console.error("error from user inserted into userDB: ", error);
            reject(error);
          });
      } else {
        reject({ message: "data badly formated" });
      }
    });
  }
}
// UserDb.createIndexing();

export default UserDb;
