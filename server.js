var express = require("express");
var app = express();
var path = require("path");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sqlite = require("sqlite3").verbose();
var db = new sqlite.Database("flowers.db");  //initializing database 

app.use("/", express.static(__dirname));
app.get("/flowers", function(req, res) {   // return all values as strings from table flowers on callback
    var sql = "SELECT * FROM FLOWERS";    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: rows }));
    });
});
 // return all values as string from sightings where Name = "  ", order by sighted in descending order, and limit by 10
app.get("/sightings/:comname", function(req, res) { 

    var sql =
        "SELECT * FROM SIGHTINGS WHERE NAME = '" +
        req.params.comname +
        "' ORDER BY SIGHTED DESC LIMIT 10";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: rows }));
    });
});
// edit a flower with a possible new genus, species, but not a new comname
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
    //Return the values now edited
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
//create a new tupple into sightings
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
        //return the newley created values
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
var port = process.env.PORT || 3000;        //local host initialization and listen for http requests  
app.listen(port);
console.log("Listening on " + port);
