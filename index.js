$(document).ready(function() {
    /*In charge of all the front end of the app*/

    var $table = $("#table");
    var $sightings = $("#sightings");
    var $info = $("#info");

    // ajax request to get all the rows with flowers from the db
    $.ajax({
        type: "GET",
        url: "/flowers",
        dataType: "json"
    }).done(render); // render once it the data is returned

    // render function for rendering out UI based on given data
    function render(flowers, curr) {
        console.log("render");
        //empty out data if we have it and render out the table that will hold the flowers
        $table.empty();
        $table.append(
            "<div class='row header'> <div class='cell'> Genus </div> <div class='cell'> Species </div> <div class='cell'> Common Name </div>"
        );
        // for each row populate the table with a flower row
        flowers.data.forEach(function(flower) {
            var markup =
                "<div class='row'> <div class='cell' data-title='Genus'> " +
                flower.GENUS +
                " </div> <div class='cell' data-title='Species'> " +
                flower.SPECIES +
                " </div> <div class='cell' data-title='Comname'> " +
                flower.COMNAME +
                " </div> </div>";

            var $flower = $(markup);

            // will highlight a flower if rerender is triggered while row is already highlighted
            var currClick;
            if (curr === flower.COMNAME) {
                currClick = $flower;
            }
            // will handle the click event on the row
            $flower.on("click", function() {
                var $this = $(this);
                $("#current").attr("id", "");
                $this.attr("id", "current");
                var genus = $($this.find(".cell").get(0))
                    .text()
                    .trim();
                var species = $($this.find(".cell").get(1))
                    .text()
                    .trim();
                var comname = $($this.find(".cell").get(2))
                    .text()
                    .trim();

                // render out the sightings table
                var markupSightingsTable =
                    " <h2>Sightings (last 10)</h2> <h3 id='comname'>" +
                    comname +
                    "</h3> <div id='tableSightings' class='table'> <div class='row header'><div class='cell'> Person </div> <div class='cell'> Location </div> <div class='cell'> Sighted </div> </div> </div>";
                // render the table to edit flower info
                var markupInfo =
                    "<h2>Edit Info</h2> <h3>" +
                    comname +
                    "</h3> <form id='info-form' class='cf'> <div class='input'> <label for='input-genus'>Genus</label> <input type='text' id='input-genus' value='" +
                    genus +
                    "'> </div> <div class='input'> <label for='input-species'>Species</label> <input type='text' id='input-species' value='" +
                    species +
                    "'> </div> <div class='input'> <label for='input-comname'>Common Name</label> <input type='text' id='input-comname' value='" +
                    comname +
                    "'> </div> </form>";
                // render table to insert new sighting
                var markupInsert =
                    "<h2>Insert New Sighting</h2> <h3>" +
                    comname +
                    "</h3> <form id='insert-form' class='cf'> <div class='input'> <label for='input-person'>Person</label> <input type='text' id='input-person' placeholder='Person'> </div> <div class='input'> <label for='input-location'>Location</label> <input type='text' id='input-location' placeholder='Location'> </div> <div class='input'> <label for='input-sighted'>Sighted</label> <input type='text' id='input-sighted' placeholder='Sighted'> </div> </form>";
                var $markupInsert = $(markupInsert);
                var $markupInfo = $(markupInfo);

                // render update and submit buttons
                var $update = $(
                    "<input type='submit' value='Update' id='input-submit'>"
                );
                var $submit = $(
                    "<input type='submit' value='Submit' id='input-submit'>"
                );
                // click handler for submit event
                $submit.on("click", function(e) {
                    e.preventDefault();
                    var person = $("#input-person").val();
                    var location = $("#input-location").val();
                    var sighted = $("#input-sighted").val();
                    // make sure inputs are not empty
                    if (person === "" || location === "" || sighted === "") {
                        // error message
                        toastr.error("Please fill in all the fields");
                    } else {
                        // make sure date is in correct YYYY-MM-DD format
                        if (
                            sighted.charAt(4) !== "-" ||
                            sighted.charAt(7) !== "-" ||
                            sighted.length !== 10 ||
                            isNaN(Number(sighted.substr(0, 4))) ||
                            isNaN(Number(sighted.substr(5, 2))) ||
                            isNaN(Number(sighted.substr(8, 2))) ||
                            Number(sighted.substr(5, 2)) > 12 ||
                            Number(sighted.substr(8, 2)) > 31
                        ) {
                            // error message if it is
                            toastr.error(
                                "Please fill in sighted in the correct format YYYY-MM-DD"
                            );
                        } else {
                            // else store data in json
                            var data = {
                                person: person,
                                location: location,
                                sighted: sighted,
                                name: comname
                            };
                            // post data to the server to handle insert
                            $.ajax({
                                type: "POST",
                                url: "/insert",
                                data: data,
                                success: function(result) {
                                    // success message
                                    toastr.success(
                                        "Sighting inserted correctly"
                                    );
                                    console.log(result);
                                    render(result, comname);
                                },
                                // handle error
                                error: function(err) {
                                    console.log("error", err);
                                    // if not unique insert
                                    if (err.responseText === "19") {
                                        toastr.error(
                                            // error message
                                            "The sighting you are trying to submit is not unique"
                                        );
                                    }
                                },
                                dataType: "json"
                            });
                        }
                    }
                });
                // handle click event for update table
                $update.on("click", function(e) {
                    e.preventDefault();
                    var inputGenus = $("#input-genus").val();
                    var inputSpecies = $("#input-species").val();
                    var inputComname = $("#input-comname").val();
                    // make sure input isn't empty
                    if (
                        inputGenus === "" ||
                        inputSpecies === "" ||
                        inputComname === ""
                    ) {
                        //error message
                        toastr.error("Please fill in all the fields");
                    } else {
                        // store info in json (with original and new comname)
                        var data = {
                            inputGenus: inputGenus,
                            inputSpecies: inputSpecies,
                            inputComname: inputComname,
                            original: comname
                        };
                        // post the json to server for updating
                        $.ajax({
                            type: "POST",
                            url: "/update",
                            data: data,
                            success: function(result) {
                                toastr.success("Database updated succesfully");
                                render(result, inputComname);
                            },
                            dataType: "json"
                        });
                    }
                });
                // remove sighting table before re-render
                $sightings.empty();
                // render sightings table
                $sightings.append(markupSightingsTable);
                // remove info table before re-render
                $info.empty();
                // render info table (with update button)
                $info.append(markupInsert);
                $info.append(markupInfo);
                $("#info-form").append($update);
                $("#insert-form").append($submit);
                // get sightings data through ajax from the server
                $.ajax({
                    type: "GET",
                    url: "/sightings/" + comname.trim(),
                    dataType: "json"
                }).done(function(sightings) {
                    // when done render the following
                    $tableSightings = $("#tableSightings");
                    // for each sightings render out these rows
                    sightings.data.forEach(function(sighting) {
                        var markupSightings =
                            "<div class='row'> <div class='cell' data-title='Person'> " +
                            sighting.PERSON +
                            " </div> <div class='cell' data-title='Location'> " +
                            sighting.LOCATION +
                            " </div> <div class='cell' data-title='Sighted'> " +
                            sighting.SIGHTED +
                            " </div> </div>";
                        $tableSightings.append(markupSightings);
                    });
                });
            });
            // append the flower table
            $table.append($flower);
            // if this is a re-render with an already highlited row, highlight that row now by triggering a click
            if (currClick) {
                currClick.trigger("click");
            }
        });
    }
});
