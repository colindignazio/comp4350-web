function login() {
        var username = $('#username').val();
        var password = $('#password').val();

        if(password.length > 0 && username.length > 0) {
            var params = {  userName: username,
                            password: password
                         };
            $.ajax({
                url: "http://54.200.14.217/?/User/login",
                type: "post",
                data: params,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (callback) callback(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    window.alert("Something went wrong, email could not be sent.");
                }
            });

        } else {
            window.alert("The entered username and password must be valid.");
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

            
        }
        else {
            window.alert("The entered email must be valid.");
        }
    }
    else {
        window.alert("One or more required fields are missing: username, password or email.");
    }
}