function sendRequest(callback, passSessionId) {
    var method = 'Beer/getAllBeers';
    if (isNaN(document.getElementById('beerId').value)) {
        window.alert("The field beer id must be an integer");
    }
    else {
        if (document.getElementById('beerId').value != "") {
            method = 'Beer/searchById';
            var params = {
                beverage_id: document.getElementById('beerId').value
            };
        }
        if (typeof(params) === "undefined") {
            params = {};
        }

        if (passSessionId) params.sessionId = jobifyApi.sessionId;

        $.ajax({
            url: "http://54.200.14.217/?/" + method,
            type: "post",
            data: params,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.details) {
                    $("#results").append("</br> Beer: " + data.details);
                }
                else {
                    for (var i = 0; i < data.results.length; i++) {
                        $("#results").append("</br> Beer id: " + data.results[i].Beer_id +
                            "</br> Name: " + data.results[i].Name +
                            "</br> Brewery: " + data.results[i].Brewery +
                            "</br> Type: " + data.results[i].Type +
                            "</br>Alcohol by Volume: $" + data.results[i].Alcohol_By_Volume + "</br>");
                    }
                }
                if (callback) callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
}

function sendBeerSearchRequest(callback, passSessionId) {
    var method = 'Beer/search';

    if (document.getElementById('token').value != "") {
        method = 'Beer/search';
        var params = {
            searchToken: document.getElementById('token').value
        };
    }
    if (typeof(params) === "undefined") {
        params = {};
    }

    if (passSessionId) params.sessionId = jobifyApi.sessionId;

    $.ajax({
        url: "http://54.200.14.217/?/" + method,
        type: "post",
        data: params,
        dataType: "json",
        success: function (data) {
            console.log(data);
            $("#results").empty();

            if (data.details) {
                $("#results").append("</br> Beer: " + data.details);
            } else {
                if (data.nameMatches) {
                    $("#results").append("<h2>Name Matches:</h2>");
                    for (i in data.nameMatches) {
                        $("#results").append("</br> Beer id: " + data.nameMatches[i].Beer_id +
                            "</br> Name: " + data.nameMatches[i].Name +
                            "</br> Brewery: " + data.nameMatches[i].Brewery +
                            "</br> Type: " + data.nameMatches[i].Type +
                            "</br>Alcohol by Volume: $" + data.nameMatches[i].Alcohol_By_Volume + "</br>");
                    }
                }
                if (data.breweryMatches) {
                    $("#results").append("<h2>Brewery Matches:</h2>");
                    for (i in data.breweryMatches) {
                        $("#results").append("</br> Beer id: " + data.breweryMatches[i].Beer_id +
                            "</br> Name: " + data.breweryMatches[i].Name +
                            "</br> Brewery: " + data.breweryMatches[i].Brewery +
                            "</br> Type: " + data.breweryMatches[i].Type +
                            "</br>Alcohol by Volume: $" + data.breweryMatches[i].Alcohol_By_Volume + "</br>");
                    }
                }
                if (data.typeMatches) {
                    $("#results").append("<h2>Type Matches:</h2>");
                    for (i in data.typeMatches) {
                        $("#results").append("</br> Beer id: " + data.typeMatches[i].Beer_id +
                            "</br> Name: " + data.typeMatches[i].Name +
                            "</br> Brewery: " + data.typeMatches[i].Brewery +
                            "</br> Type: " + data.typeMatches[i].Type +
                            "</br>Alcohol by Volume: $" + data.typeMatches[i].Alcohol_By_Volume + "</br>");
                    }
                }
                //$("#results").append("</br>-> " + JSON.stringify(data, null, 2));

            }

            /*for (var i = 0; i < data.results.length; i++) {

             $("#results").append("</br> Beer id: " + data.results[i].Beer_id +
             "</br> Name: " + data.results[i].Name +
             "</br> Brewery: " + data.results[i].Brewery +
             "</br> Type: " + data.results[i].Type +
             "</br>Alcohol by Volume: $" + data.results[i].Alcohol_By_Volume + "</br>");
             }*/
            if (callback) callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}