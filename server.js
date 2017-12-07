var express = require("express");
var app = express();
var path = require("path");

var sqlite = require("sqlite3").verbose();
var db = new sqlite.Database("flowers.db");

app.use("/", express.static(__dirname));
app.get("/flowers", function(req, res) {
    var sql = "SELECT * FROM FLOWERS";
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
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
            throw err;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: rows }));
    });
});
app.listen(3000);
console.log("Listening on 3000");
