$(document).ready(function() {
    var $table = $("#table");
    var $sightings = $("#sightings");
    var $info = $("#info");

    $.ajax({
        type: "GET",
        url: "/flowers",
        dataType: "json"
    }).done(function(flowers) {
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
            $flower.on("click", function() {
                var $this = $(this);
                $("#current").attr("id", "");
                $this.attr("id", "current");
                var genus = $($this.find(".cell").get(0)).text();
                var species = $($this.find(".cell").get(1)).text();
                var comname = $($this.find(".cell").get(2)).text();
                var markupSightingsTable =
                    " <h2>Sightings (last 10)</h2> <h3 id='comname'>" +
                    comname +
                    "</h3> <div id='tableSightings' class='table'> <div class='row header'><div class='cell'> Person </div> <div class='cell'> Location </div> <div class='cell'> Sighted </div> </div> </div>";
                var markupInfo =
                    "<h2>Edit info</h2> <h3>Comname</h3> <form id='info-form' class='cf'> <div class='input'> <label for='input-Genus'>Genus</label> <input type='text' id='input-Genus' value='" +
                    genus +
                    "'> </div> <div class='input'> <label for='input-species'>Species</label> <input type='text' id='input-species' value='" +
                    species +
                    "'> </div> <div class='input'> <label for='input-comname'>Common Name</label> <input type='text' id='input-name' value='" +
                    comname +
                    "'> </div> </form>";
                var $markupInfo = $(markupInfo);
                var $submit = $(
                    "<input type='submit' value='Submit' id='input-submit'>"
                );
                $submit.on("click", function(e) {
                    e.preventDefault();
                    console.log("submit");
                });
                $sightings.empty();
                $sightings.append(markupSightingsTable);
                $info.empty();
                $info.append(markupInfo);
                $("#info-form").append($submit);
                $.ajax({
                    type: "GET",
                    url: "/sightings/" + comname.trim(),
                    dataType: "json"
                }).done(function(sightings) {
                    $tableSightings = $("#tableSightings");
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
            $table.append($flower);
        });
    });
});
