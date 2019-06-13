import Pouchdb from "pouchdb";

let journalDB = new Pouchdb("journals");

//for insert journal data
let creditCard = {
  id: 130,
  account_id: 32,
  name: "Credit Card",
  journal_id: 10
};
let cash = { id: 129, account_id: 27, name: "Cash", journal_id: 9 };

class JournalDB {
  static createJournalInDb(journalObj) {
    new Promise((resolve, reject) => {
      journalDB.put({
        _id: String(journalObj.id),
        ...journalObj
      });
    });
  }

  static getJournalsFromDb() {
    return new Promise((resolve, reject) => {
      journalDB
        .allDocs({
          include_docs: true,
          attachments: true
        })
        .then(docs => {
          console.log("all fetched journal documents: ", docs);
          let rows = docs.rows,
            data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows[i].doc);
          }
          return resolve(data);
        })
        .catch(error => {
          console.error("error from getAllJournals: ", error);
          return reject(error);
        });
    });
  }
}

export default JournalDB;
