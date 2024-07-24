function logout () {
    localStorage.removeItem("active");
    location.href="index.html";
}

//J-query
$(document).ready(function(){
    if(localStorage.getItem("active")==null) {
        location.href="index.html";
    }


    let mail = localStorage.getItem("active");
    $("#email").val(mail);

    let obj = {
        type:"get",
        url:"/check-account",
        data:{
            email:mail
        }
    }
    $.ajax(obj).done(function(jsonary){
        if(jsonary.length == 0){
            $("#btnupdate").prop("disabled",true);
            $("#btnsave").prop("disabled",false);
        } else {
            $("#btnupdate").prop("disabled",false);
            $("#btnsave").prop("disabled",true);
        }
    }).fail(function(err){
        alert(err.statusText);
    })

    // checking contact number
    $("#contact").blur(function chk(){
        var regex = /^(0|91)?[6-9][0-9]{9}$/;;
        let phn = $(this).val();
        if(regex.test(phn)==false){
            $("#errphone").html("Invalid Number!");
            $("#contact").focus();  
        }
        else{
            $("#errphone").html("Valid Number");
            $("#contact").blur();   
        }
    })

    //loading spinner
    $(document).ajaxStart(function(){
        $("#bg").css("display","block");
        $("#spinner").css("display","block");
    })
    $(document).ajaxStop(function(){
        $("#spinner").css("display","none");
        $("#bg").css("display","none");
    })
    // searching client profile
    $("#btnsearch").click(function(){
        let obj = {
            type:"get",
            url:"/find-client-profile",
            data:{
                email:$("#email").val()
            }
        }
        $.ajax(obj).done(function(jsonary){
            if(jsonary.length == 0){
                alert("Email ID doesn't exists!");
                return;
            }
            // alert(JSON.stringify(jsonary));
            $("#cname").val(jsonary[0].cname);
            $("#contact").val(jsonary[0].mobile);
            $("#city").val(jsonary[0].city);
            $("#state").val(jsonary[0].state);
        }).fail(function(err){
            alert(err.statusText);
        })
    })
})