var app = require('http').Server();
var io = require('socket.io')(app);
var debug = require('debug')('realdash');
var connect = require('connect');
var serveStatic = require('serve-static');
var Client = require('node-rest-client').Client;
 
var client = new Client();
 
// merge new data to cache, return the diff
function mergediff(orig_data, new_data) {
    var diff = { needUpdate: false, data: {} };
    var diff_data = diff.data;
    for (var key in new_data) {
        if (!orig_data.hasOwnProperty(key)
            || JSON.stringify(orig_data[key]) !== JSON.stringify(new_data[key])) {
            diff.needUpdate = true;
            orig_data[key] = new_data[key];
            diff_data[key] = new_data[key];
        }
    }
    if (Object.keys(orig_data).length > 50) {
        var ordered = Object.keys(orig_data).sort();
        var delNum = ordered.length - 50;
        for (var i = 0; i < delNum; i++) {
            delete orig_data[ordered[i]];
        }
    }
    return diff;
}

// this is the query loop.
function dataSync(conn, orig_data, lastUpdate) {
    var queryString = mysql.format("select `time`,value,updateTime from `KPI` where network='vzwca' and " +
        "`kpi`='xxx' and updateTime > ? order by `time` desc limit 50", lastUpdate);
        // direct way 

        client.get("http://remote.site/rest/xml/method", function (data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
    console.log(response);
});

    conn.query(queryString, function (err, rows, fields) {
        if (err) {
            console.log('Query [' + queryString + '] failed: ', err);
        } else {
            debug('query success. rows: ', rows.length);
            if (rows && rows.length >= 0) {
                var new_data = {};
                for (var i = 0; i < rows.length; i++) {
                    var row = {};
                    var row_key = 'time';
                    for (var field in rows[i]) {
                        var value = rows[i][field];
                        if (value instanceof Date) {
                            value = value.getTime();
                        }
                        if (field === 'updateTime') {
                            if (rows[i][field] > lastUpdate) {
                                lastUpdate = rows[i][field];
                            }
                        } else if (field === row_key) {
                            row_key = value;
                        } else {
                            row[field] = value;
                        }
                    }
                    new_data[row_key] = row;
                }
                var diff = mergediff(orig_data, new_data);
                if (diff.needUpdate) {
                    pushUpdate(diff.data);
                }
            }
        }
        setTimeout(function () { dataSync(conn, orig_data, lastUpdate); }, 1000);
    });
}

function putItBaby() {
    var now = new Date();
    var timestamp = parseInt(now.getTime() / 1000);
    var queryString = mysql.format("Insert into `KPI` values (?,?,?,?,?,?)", [4, 10, "22", timestamp, "vzwca", "xxx"]);
    conn.query(queryString);

    now = new Date();
    timestamp = parseInt(now.getTime() / 1000);
    var queryString = mysql.format("Insert into `KPI` values (?,?,?,?,?,?)", [5, 11, "24", timestamp, "vzwca", "xxx"]);
    conn.query(queryString);

    console.log("Done.");
}

connect().use(serveStatic(__dirname)).listen(5000, function () {
    console.log('Server running on 5000...');
});
app.listen(80);

// cache 
var data = {};

// start data sychonization
dataSync(conn, data, 0);
setTimeout(putItBaby, 7000);

// send complete data at the first connect
io.on('connection', function (socket) {
    console.log("connection is made");
    socket.emit('completeData', data);
    console.log("socket emit is called");
});

// define the function used to push new data
function pushUpdate(new_data) {
    io.sockets.emit('dataUpdate', new_data);
}