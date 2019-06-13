// import RxDB from "rxdb";
// require("babel-polyfill");
// RxDB.plugin(require("pouchdb-adapter-idb"));

// async function databaseRef() {
//   let db = await RxDB.create({
//     name: "test", // <- name
//     adapter: "idb", // <- storage-adapter
//     password: "12345678", // <- password (optional)
//     multiInstance: true, // <- multiInstance (optional, default: true)
//     queryChangeDetection: false // <- queryChangeDetection (optional, default: false)
//   });
//   console.log("rxdb: ", db);
//   return db;
// }

// export default databaseRef();






import 'babel-polyfill'; // only needed when you dont have polyfills
import RxDB from 'rxdb';
RxDB.plugin(require("pouchdb-adapter-idb"));
const mySchema = {
  keyCompression: true, // set this to true, to enable the keyCompression
  version: 0,
  title: "heroes",
  type: "object",
  properties: {
    name: {
      type: "string"
    }
  },
  required: ["name"]
};
RxDB.create({
    name: 'heroesdb',
    adapter: 'idb',
    password: 'myLongAndStupidPassword', // optional
    multiInstance: true                  // default: true
  }).then(db=>{
    db.collection({name: 'heroes', schema: mySchema});    // create collection
    
    // db.heroes.insert({ name: 'Bob' }); 
  })                                                       // create database