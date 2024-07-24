function showpwd(pwd) {
    if (pwd.type === "password") {
        pwd.type = "text";
    } else {
        pwd.type = "password";
    }
}

$(document).ready(function () {

    // checking if email filled is a valid email
    $("#txtemail").blur(function () {
        var pattern = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
        let email = $(this).val();
        if (pattern.test(email) == true) {
            $("#txtpwd").prop("disabled", false);
            $("#iconemail").html("✔️");
            $("#txtemail").css("border", "1px green solid");
            return;
        }
        else {
            $("#txtpwd").prop("disabled", true);
            alert("Invalid email address");
            $("#errsignup").html(resp);
            $("#txtemail").css("border", "1px red solid");
        }
    });

    // checking strength of the password
    $("#txtpwd").keydown(function () {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,}$/;
        let pass = $(this).val();
        if (regex.test(pass) == true) {
            $("#errpwd").html("Password Strength: Strong");
        }
        else {
            $("#errpwd").html("Password Strength: Weak");
        }
    })

    // show password in signup
    // $("#showpwd").click(function () {
    //     let x = $("#txtpwd");
    //     if (x.prop("type") == "password") {
    //         x.prop("type", "text");
    //     } else {
    //         x.prop("type", "password");
    //     }
    // })

    // preloader spinner
    $(document).ajaxStart(function () {
        $("#spinnerforgotpwd").css("display", "block");
    })
    $(document).ajaxStop(function () {
        $("#spinnerforgotpwd").css("display", "none");
    })

    // saving sign up data
    $("#btnsignup").click(function () {
        let obj = {
            type: "get",
            url: "/signup-process",
            data: {
                txtemail: $("#txtemail").val(),
                txtpwd: $("#txtpwd").val(),
                utype: $("#utype").val()
            }
        }
        $.ajax(obj).done(function (resp) {
            alert(resp);
        }).fail(function (err) {
            alert(err.statusText);
        })
    })

    // checking if the email is available or not
    $("#txtemail").blur(function () {
        if ($(this).val() == "") {
            $("#errsignup").html("");
            return;
        }
        let obj = {
            type: "get",
            url: "/email-availability",
            data: {
                txtemail: $("#txtemail").val()
            }
        }
        $.ajax(obj).done(function (resp) {
            //alert(resp)
            if (resp == "Email Available") {
                $("#errsignup").html("");
                $("#iconemail").html("✔️");
                $("#txtemail").css("border", "1px green solid");
                $("#txtpwd").prop("disabled", false);
            }
            if (resp == "Email already exists!") {
                $("#txtpwd").prop("disabled", true);
                $("#errsignup").html(resp);
                $("#txtemail").css("border", "1px red solid");
            }
        }).fail(function (err) {
            alert(err.statusText);
        })
    })

    // clicking login button
    $("#btnlogin").click(function () {
        let obj = {
            type: "get",
            url: "/login-process",
            data: {
                logemail: $("#logemail").val(),
                logpwd: $("#logpwd").val()
            }
        }
        $.ajax(obj).done(function (resp) {
            // alert(resp);
            if (resp === "Influencer") {
                location.href = ("influencer-dash.html");
            }
            else if (resp === "Host") {
                location.href = ("client-dash.html");
            } else {
                alert(resp);
            }
            localStorage.setItem("active", $("#logemail").val());

        }).fail(function (err) {
            alert(err.statusText);
        })
    })

    // sending email on forgot password
    $("#forgotpwd").click(function () {
        $("#spinnerforgotpwd").css("display", "block");
        let obj = {
            type: "get",
            url: "/forgot-password",
            data: {
                logemail: $("#logemail").val()
            }
        }
        $.ajax(obj).done(function (resp) {
            alert(resp);
        }).fail(function (err) {
            alert(err.statusText);
        })
    })

})

