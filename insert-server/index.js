var operations = require('./operations');

if (process.argv.length && process.argv[2] == "del") {
    setTimeout(() => {
        operations.deleteAllRows(() => process.exit());
    }, 1000);
} else {
    setTimeout(() => {
        operations.insert2Rows(() => process.exit());
    }, 9000);
}
