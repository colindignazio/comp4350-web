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

    if (document.getElementById('keyword-search').value != "") {
        method = 'Beer/search';
        var params = {
            searchToken: document.getElementById('keyword-search').value
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
            $("#results-table-body").empty();

            if (data.details) {
                $("#results-table-body").append("</br> Problem: " + data.details);
            } else {
                if (data.nameMatches) {
                    for (i in data.nameMatches) {
                        $("#results-table-body").append("<tr>"+
                            "<td style='background-color: lightblue'>" + data.nameMatches[i].Name +"</td>" +
                            "<td>" + data.nameMatches[i].Brewery +"</td>" +
                            "<td>" + data.nameMatches[i].Type +"</td>" +
                            "<td>" + data.nameMatches[i].Alcohol_By_Volume +"</td>" +
                            "<td>5</td>" +
                            "<td>$4.50</td>"+
                            "</tr>")
                    }
                }
                if (data.breweryMatches) {
                    for (i in data.breweryMatches) {
                        $("#results-table-body").append("<tr>"+
                            "<td>" + data.breweryMatches[i].Name +"</td>" +
                            "<td style='background-color: lightblue'>" + data.breweryMatches[i].Brewery +"</td>" +
                            "<td>" + data.breweryMatches[i].Type +"</td>" +
                            "<td>" + data.breweryMatches[i].Alcohol_By_Volume +"</td>" +
                            "<td>5</td>" +
                            "<td>$4.50</td>"+
                            "</tr>")
                    }
                }
                if (data.typeMatches) {
                    for (i in data.typeMatches) {
                        $("#results-table-body").append("<tr>"+
                            "<td>" + data.typeMatches[i].Name +"</td>" +
                            "<td>" + data.typeMatches[i].Brewery +"</td>" +
                            "<td style='background-color: lightblue'>" + data.typeMatches[i].Type +"</td>" +
                            "<td>" + data.typeMatches[i].Alcohol_By_Volume +"</td>" +
                            "<td>5</td>" +
                            "<td>$4.50</td>"+
                            "</tr>")
                    }
                }

            }

            if (callback) callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}