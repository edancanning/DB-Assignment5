$(document).ready(function() {
    var $table = $("#table");
    var $sightings = $("#sightings");

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
                $("#current").attr("id", "");
                $(this).attr("id", "current");
                var comname = $(
                    $(this)
                        .find(".cell")
                        .get(2)
                ).text();
                var markupSightingsTable =
                    " <h2>Sightings (last 10)</h2> <h3 id='comname'>" +
                    comname +
                    "</h3> <div id='tableSightings' class='table'> <div class='row header'><div class='cell'> Person </div> <div class='cell'> Location </div> <div class='cell'> Sighted </div> </div> </div>";
                $sightings.empty();
                $sightings.append(markupSightingsTable);
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
