var db = require('./dbconn');

var operations = {
    insert2Rows: function (finalAction) {
        var now = new Date();
        var timestamp = parseInt(now.getTime() / 1000);
        //var queryString = mysql.format();
        db.query("Insert into `KPI` (time, value, updateTime, network, kpi) values (?,?,?,?,?)",
            [10, "22", timestamp, "vzwca", "xxx"],
            function (err, result) {
                if (err) {
                    console.log("omg");
                    return;
                }
                console.log("Done insertion.");
                finalAction();
            });
    },

    deleteAllRows: function (finalAction) {
        db.query("delete from `KPI`", [], function (err, result) {
            if (err) {
                console.log("omg");
            }
            finalAction();
        });

        console.log("Done deletion.");
    }
}

module.exports = operations;