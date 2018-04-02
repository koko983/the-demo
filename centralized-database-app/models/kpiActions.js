var db = require('../dbconnection'); //reference of dbconnection.js

var kpiActions = {
    getAll: function (startTime, callback) {
        return db.query("Select * from kpi where updateTime > ? order by `time` desc limit 50", [startTime], callback);
    },
    getById: function (id, callback) {
        return db.query("select * from kpi where Id=?", [id], callback);
    },
    addNew: function (values, callback) {
        return db.query("Insert into `KPI` values (?,?,?,?,?,?)", [values.id, values.time, values.value, values.updateTime, values.network, values.kpi], callback);
    }
};

module.exports = kpiActions;