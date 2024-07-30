// preview of profile pic
function doPrev(fileCtrl, imgPrev) {
    let [file] = fileCtrl.files
    if (file) {
        imgPrev.src = URL.createObjectURL(file)
    }
}

function logout () {
    localStorage.removeItem("active");
    location.href="index.html";
}

//J-query
$(document).ready(function(){
    if(localStorage.getItem("active")==null) {
        location.href="index.html";
    }

    // email autofill
    let mail = localStorage.getItem("active");
    $("#email").val(mail);

    // checking account
    let obj = {
        type:"get",
        url:"/check-acc",
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
    // searching influencer profile
    $("#btnsearch").click(function(){
        let obj = {
            type:"get",
            url:"/find-infl-profile",
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
            $("#iname").val(jsonary[0].iname);
            $("#contact").val(jsonary[0].contact);
            $("#gender").val(jsonary[0].gender);
            $("#dob").val(jsonary[0].dob.split("T")[0]);
            $("#address").val(jsonary[0].address);
            $("#city").val(jsonary[0].city);
            $("#state").val(jsonary[0].state);
            $("#insta").val(jsonary[0].insta);
            $("#fb").val(jsonary[0].fb);
            $("#youtube").val(jsonary[0].youtube);
            $("#field").val(jsonary[0].field);
            $("#otherinfo").val(jsonary[0].otherinfo);
            $("#prev").prop("src",jsonary[0].picpath);
            $("#hdn").val(jsonary[0].picpath);
        }).fail(function(err){
            alert(err.statusText);
        })
    })
})