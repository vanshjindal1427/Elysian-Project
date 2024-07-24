function showpwd(pwd) {
    if (pwd.type === "password") {
        pwd.type = "text";
    } else {
        pwd.type = "password";
    }
}

$(document).ready(function(){

    $('#welcome').toast('show')

    if(localStorage.getItem("active")==null) {
        location.href="index.html";
    }

    // logout
    $("#logout").click(function () {
        localStorage.removeItem("active");
        location.href=("index.html");
    })

    // email-autofill
    {    
        let mail = localStorage.getItem("active");
        $("#emailid").val(mail);
        $("#updtemail").val(mail);
        $("#toast").html("Hello "+mail+", Welcome to Elysian...");
    }

    // checking email and password before updating password
    $("#oldpwd").keyup(function(){
        let obj = {
            type: "get",
            url: "/chk-update-pwd",
            data: {
                updtemail : $("#updtemail").val(),
                oldpwd: $("#oldpwd").val()
            }
        }
        $.ajax(obj).done(function (resp) {
            if(resp == "Valid") {
                $("#newpwd").prop("disabled",false);
                $("#conpwd").prop("disabled",false);
                $("#erremail").html("");
                return;
            }
            else if(resp == "Invalid Email or Password") {
                $("#newpwd").prop("disabled",true);
                $("#conpwd").prop("disabled",true);
                $("#erremail").html("Invalid Email or Password");
                return;
            }
            else if(resp == "User Blocked!") {
                $("#newpwd").prop("disabled",true);
                $("#conpwd").prop("disabled",true);
                $("#erremail").html("User Blocked!");
                return;
            }
            alert(resp);
        }).fail(function (err) {
            alert(err.statusText);
        })
    })

    // checking if the new and confirm password are same
    $("#conpwd").keyup(function(){
        if($("#newpwd").val() == $("#conpwd").val()) {
            $("#btnupdatepwd").prop("disabled",false);
            $("#errconfirm").html("");
        }
        else {
            $("#btnupdatepwd").prop("disabled",true);
            $("#errconfirm").html("Confirm Password should be same as New Password!");
        }
    })

    // updating password in database
    $("#btnupdatepwd").click(function(){
        let obj = {
            type: "get",
            url: "/update-pwd",
            data: {
                updtemail : $("#updtemail").val(),
                oldpwd: $("#oldpwd").val(),
                conpwd: $("#conpwd").val(),
            }
        }
        $.ajax(obj).done(function(resp){
            alert(resp);
        }).fail(function(err){
            alert(err.statusText);
        })
    })
})