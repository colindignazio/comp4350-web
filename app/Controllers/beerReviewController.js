function sendRequest(callback, passSessionId) {
    var method = 'BeerReview/all';
    if (isNaN(document.getElementById('searchToken').value)) {
        window.alert("The search string must be an integer(search is based on Id's)");
    }
    else {
        if (document.getElementById('searchToken').value != "") {
            method = 'BeerReview/search';
            var params = {
                searchToken: document.getElementById('searchToken').value
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
                if(method == 'BeerReview/all')
                {
                    $("#results").append("</br><h2>All Beer Reviews: </h2>");
                    for(var i =0; i < data.results.length; i++)
                    {
                        $("#results").append("</br> review id: " + data.results[i].id+
                            "</br> beer id: " +data.results[i].beer_id+
                            "</br> user id: " +data.results[i].user_id+
                            "</br> store id: " +data.results[i].store_id+
                            "</br> stars: " +data.results[i].stars+
                            "</br> review: " +data.results[i].review+
                            "</br>price: $" +data.results[i].price +"</br>" );
                    }                }
                else {
                    if (data.details) {
                        $("#results").append("</br> Beer Reviews: " + data.details);
                    } else {
                        if (data.idMatches) {
                            $("#results").append("<h2>Beer Review Id Matches:</h2>");
                            for (i in data.beerMatches) {
                                $("#results").append("</br> review id: " + data.idMatches[i].id +
                                    "</br> beer id: " + data.idMatches[i].beer_id +
                                    "</br> user id: " + data.idMatches[i].user_id +
                                    "</br> store id: " + data.idMatches[i].store_id +
                                    "</br> stars: " + data.idMatches[i].stars +
                                    "</br> review: " + data.idMatches[i].review +
                                    "</br>price: $" + data.idMatches[i].price + "</br>");
                            }
                        }

                        if (data.beerMatches) {
                            $("#results").append("<h2>Beer Id Matches:</h2>");
                            for (i in data.beerMatches) {
                                $("#results").append("</br> review id: " + data.beerMatches[i].id +
                                    "</br> beer id: " + data.beerMatches[i].beer_id +
                                    "</br> user id: " + data.beerMatches[i].user_id +
                                    "</br> store id: " + data.beerMatches[i].store_id +
                                    "</br> stars: " + data.beerMatches[i].stars +
                                    "</br> review: " + data.beerMatches[i].review +
                                    "</br>price: $" + data.beerMatches[i].price + "</br>");
                            }
                        }
                        if (data.userMatches) {
                            $("#results").append("<h2>User Id Matches:</h2>");
                            for (i in data.userMatches) {
                                $("#results").append("</br> review id: " + data.userMatches[i].id +
                                    "</br> beer id: " + data.userMatches[i].beer_id +
                                    "</br> user id: " + data.userMatches[i].user_id +
                                    "</br> store id: " + data.userMatches[i].store_id +
                                    "</br> stars: " + data.userMatches[i].stars +
                                    "</br> review: " + data.userMatches[i].review +
                                    "</br>price: $" + data.userMatches[i].price + "</br>");
                            }
                        }
                        if (data.starMatches) {
                            $("#results").append("<h2>Stars Matches:</h2>");
                            for (i in data.starMatches) {
                                $("#results").append("</br> review id: " + data.starMatches[i].id +
                                    "</br> beer id: " + data.starMatches[i].beer_id +
                                    "</br> user id: " + data.starMatches[i].user_id +
                                    "</br> store id: " + data.starMatches[i].store_id +
                                    "</br> stars: " + data.starMatches[i].stars +
                                    "</br> review: " + data.starMatches[i].review +
                                    "</br>price: $" + data.starMatches[i].price + "</br>");
                            }
                        }
                    }
                }
                if (callback) callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
}

function sendCreateRequest(method, callback, passSessionId) {

    if (isNaN(document.getElementById('beerId').value) || isNaN(document.getElementById('userId').value) || isNaN(document.getElementById('storeId').value) ||
        isNaN(document.getElementById('stars').value) || isNaN(document.getElementById('price').value)) {
        window.alert("The fields: beer id, user id, store id and stars must all be integers.\nThe field price must be an integer or floating point number.");
    }
    else {
        var params = {
            beer_id: document.getElementById('beerId').value,
            user_id: document.getElementById('userId').value,
            store_id: document.getElementById('storeId').value,
            stars: document.getElementById('stars').value,
            review: document.getElementById('review').value,
            price: document.getElementById('price').value,
        };
        if (passSessionId) params.sessionId = jobifyApi.sessionId;

        $.ajax({
            url: "http://54.200.14.217/?/" + method,
            type: "post",
            data: params,
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("#results").append("</br>" + JSON.stringify(data));

                if (callback) callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
}

function sendUpdateRequest(method, callback, passSessionId) {

    if (isNaN(document.getElementById('beerId').value) || isNaN(document.getElementById('userId').value) || isNaN(document.getElementById('storeId').value) ||
        isNaN(document.getElementById('stars').value) || isNaN(document.getElementById('price').value) || isNaN(document.getElementById('reviewId').value)) {
        window.alert("The fields: review id, beer id, user id, store id and stars must all be integers.\nThe field price must be an integer or floating point number.");
    }
    else {
        var params = {
            review_id: document.getElementById('reviewId').value,
            beer_id: document.getElementById('beerId').value,
            user_id: document.getElementById('userId').value,
            store_id: document.getElementById('storeId').value,
            stars: document.getElementById('stars').value,
            review: document.getElementById('review').value,
            price: document.getElementById('price').value,
        };
        if (passSessionId) params.sessionId = jobifyApi.sessionId;

        $.ajax({
            url: "http://54.200.14.217/?/" + method,
            type: "post",
            data: params,
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("#results").append("</br>" + JSON.stringify(data));

                if (callback) callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }
}
