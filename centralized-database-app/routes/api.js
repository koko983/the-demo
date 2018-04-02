var express = require('express');
var router = express.Router();
var kpiActions = require('../models/kpiActions');

router.get('/id/:id?', function (req, res, next) {
    if (req.params.id) {
        kpiActions.getById(req.params.id, function (err, rows) {
            if (err) {
                console.log(err);
                res.statusCode = 404;
                res.end();
            }
            else {
                res.json(rows[0]);
            }
        });
    }
});

router.get('/lastupdate/:lastUpdate?', function (req, res, next) {
    kpiActions.getAll(req.params.lastUpdate, function (err, rows) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(rows);
            }
        });
    }
);

router.post('/', function (req, res, next) {
    kpiActions.addNew(req.body, function (err, count) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(req.body);//or return count for 1 && 0
        }
    });
});

module.exports = router;