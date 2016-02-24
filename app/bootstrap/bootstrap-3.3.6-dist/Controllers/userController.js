function sendVerificationEmail(callback, passSessionId) {
    if (/.*@.*\..*/.test(document.getElementById('email').value)) {
        var params = {
            email: document.getElementById('email').value
        };
        if (typeof(params) === "undefined") {
            params = {};
        }
        if (passSessionId) params.sessionId = jobifyApi.sessionId;

        $.ajax({
            url: "http://54.200.14.217/?/User/testEmail",
            type: "post",
            data: params,
            dataType: "json",
            success: function (data) {
                console.log(data);
                window.alert("Confirmation email will be sent to that address within 30 minutes.");

                if (callback) callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                window.alert("Something went wrong, email could not be sent.");
            }
        });
    }
    else {
        window.alert("The entered email must be valid.");
    }
}
function sendRequest(callback, passSessionId) {
    var method = 'User/createAccount';
    if (document.getElementById('username').value && document.getElementById('password').value &&
        document.getElementById('email').value) {
        if (/.*@.*\..*/.test(document.getElementById('email').value)) {
            var params = {
                userName: document.getElementById('username').value,
                password: document.getElementById('password').value,
                email: document.getElementById('email').value,
                location: document.getElementById('location').value
            };
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
                    $("#results").append("</br>" + JSON.stringify(data));
                    if (callback) callback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        }
        else {
            window.alert("The entered email must be valid.");
        }
    }
    else {
        window.alert("One or more required fields are missing: username, password or email.");
    }
}