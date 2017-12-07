$(document).ready(function() {
    var $table = $("#table");
    var $sightings = $("#sightings");
    var $info = $("#info");

    $.ajax({
        type: "GET",
        url: "/flowers",
        dataType: "json"
    }).done(render);

    function render(flowers, curr) {
        $table.empty();
        $table.append(
            "<div class='row header'> <div class='cell'> Genus </div> <div class='cell'> Species </div> <div class='cell'> Common Name </div>"
        );
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

            var currClick;
            if (curr === flower.COMNAME) {
                currClick = $flower;
            }
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
                var markupSightingsTable =
                    " <h2>Sightings (last 10)</h2> <h3 id='comname'>" +
                    comname +
                    "</h3> <div id='tableSightings' class='table'> <div class='row header'><div class='cell'> Person </div> <div class='cell'> Location </div> <div class='cell'> Sighted </div> </div> </div>";
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
                var markupInsert =
                    "<h2>Insert New Sighting</h2> <h3>" +
                    comname +
                    "</h3> <form id='insert-form' class='cf'> <div class='input'> <label for='input-person'>Person</label> <input type='text' id='input-person' value='" +
                    genus +
                    "'> </div> <div class='input'> <label for='input-location'>Location</label> <input type='text' id='input-location' value='" +
                    species +
                    "'> </div> <div class='input'> <label for='input-sighted'>Sighted</label> <input type='text' id='input-sighted' value='" +
                    comname +
                    "'> </div> </form>";
                var $markupInsert = $(markupInsert);
                var $markupInfo = $(markupInfo);
                var $update = $(
                    "<input type='submit' value='Update' id='input-submit'>"
                );
                var $submit = $(
                    "<input type='submit' value='Submit' id='input-submit'>"
                );
                $update.on("click", function(e) {
                    e.preventDefault();
                    var inputGenus = $("#input-genus").val();
                    var inputSpecies = $("#input-species").val();
                    var inputComname = $("#input-comname").val();
                    var data = {
                        inputGenus: inputGenus,
                        inputSpecies: inputSpecies,
                        inputComname: inputComname,
                        original: comname
                    };
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
                });
                $sightings.empty();
                $sightings.append(markupSightingsTable);
                $info.empty();
                $info.append(markupInsert);
                $info.append(markupInfo);
                $("#info-form").append($update);
                $("#insert-form").append($submit);
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
            if (currClick) {
                currClick.trigger("click");
            }
        });
    }
});
