var db = openDatabase("my.db", '1.0', "My WebSQL Database", 2 * 1024 * 1024);



var create = function() {
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    });
}

var insert = function(firstname, lastname) {
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO people (firstname, lastname) VALUES (?,?)", [firstname, lastname]);
    });
}

var select = function() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT firstname, lastname FROM people", [], function(tx, results) {
            if(results.rows.length > 0) {
                for(var i = 0; i < results.rows.length; i++) {
                    console.log("Result -> " + results.rows.item(i).firstname + " " + results.rows.item(i).lastname);
                }
            }
        });
    });
}

export default db;