var express = require("express");
var app = express();
var path = require("path");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sqlite = require("sqlite3").verbose();
var db = new sqlite.Database("flowers.db");

app.use("/", express.static(__dirname));
app.get("/flowers", function(req, res) {
    var sql = "SELECT * FROM FLOWERS";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: rows }));
    });
});
app.get("/sightings/:comname", function(req, res) {
    var sql =
        "SELECT * FROM SIGHTINGS WHERE NAME = '" +
        req.params.comname +
        "' LIMIT 10";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: rows }));
    });
});

app.post("/update", function(req, res) {
    var genus = req.body.inputGenus;
    var species = req.body.inputSpecies;
    var comname = req.body.inputComname;
    var original = req.body.original;
    var sql =
        "UPDATE FLOWERS SET GENUS = '" +
        genus +
        "', SPECIES = '" +
        species +
        "', COMNAME = '" +
        comname +
        "' WHERE comname = '" +
        original +
        "'";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            var sql = "SELECT * FROM FLOWERS";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ data: rows }));
            });
        }
    });
});

app.post("/insert", function(req, res) {
    var person = req.body.person;
    var location = req.body.location;
    var sighted = req.body.sighted;
    var name = req.body.name;
    var sql =
        "INSERT INTO SIGHTINGS VALUES('" +
        name +
        "','" +
        person +
        "','" +
        location +
        "','" +
        sighted +
        "')";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            var sql = "SELECT * FROM FLOWERS";
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ data: rows }));
            });
        }
    });
});
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on " + port);
