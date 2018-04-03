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
function dataSync(orig_data, lastUpdate) {
   client.get("http://localhost:3000/api/lastupdate/" + lastUpdate, function (data, response) {
        if (data) {
            //debug('query success. rows: ', data.length);
            var new_data = {};
            for (var i = 0; i < data.length; i++) {
                var row = {};
                var row_key = 'time';
                for (var field in data[i]) {
                    var value = data[i][field];
                    if (value instanceof Date) {
                        value = value.getTime();
                    }
                    if (field === 'updateTime') {
                        if (data[i][field] > lastUpdate) {
                            lastUpdate = data[i][field];
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
        setTimeout(function () { dataSync(orig_data, lastUpdate); }, 1000);
    });
}

connect().use(serveStatic(__dirname)).listen(5000, function () {
    console.log('Server running on 5000...');
});
app.listen(5001);

// cache 
var data = {};

// start data sychonization
dataSync(data, 0);

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