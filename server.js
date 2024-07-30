var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
var nodemailer = require('nodemailer');
var cloudinary = require('cloudinary').v2;
let app = express();

app.listen(1414, function () {
    console.log("Server started *^____^*");
});

//app.use codes
{
    app.use(express.static("public"));
    app.use(express.urlencoded("true"));// converts binary form data to JSON Object
    app.use(fileuploader());
}

// configuring nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'try.vanshjindal@gmail.com',
        pass: 'rvrv cblo hkkg oswk'
    }
});

// nodemailer code
{
    // var mailOptions = {
    //     from: 'try.vanshjindal@gmail.com',
    //     to: 'vanshjindal1427@gmail.com',
    //     subject: 'Forgot Password Request',
    //     text: ``
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
}

// configuring mysql database
{
    // let config = {
    //     host: "127.0.0.1",
    //     user: "root",
    //     password: "Vansh*1427",
    //     database: "project",
    //     dateStrings: true
    // }
    // let config = {
    //     host: "bqrucbp8xguwhbzu94sw-mysql.services.clever-cloud.com",
    //     user: "upzhsboozmdz4jkx",
    //     password: "bx87Be1eXFlsqKgD5uBK",
    //     database: "bqrucbp8xguwhbzu94sw",
    //     dateStrings: true,
    //     keepAliveInitialDelay : 10000,
    //     enableKeepAlive : true
    // }
    cloudinary.config({ 
        cloud_name: 'dhd3ofr7h', 
        api_key: '242238285667416', 
        api_secret: '4wnsK9kMfyBA8LCVDiO4rymUB7k' // Click 'View Credentials' below to copy your API secret
    });

    let config = "mysql://avnadmin:AVNS_hrx3WSXOTfHcWyyxRxQ@mysql-3119cfd2-elysian1427-0009.e.aivencloud.com:25697/defaultdb"
    var mysql = mysql2.createConnection(config);
    mysql.connect(function (err) {
        if (err == null)
            console.log("Connected To Database O.O");
        else
            console.log(err.message + "  ########");
    })
}

// open home page
app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);
});

// index.html
{
    // saving signup data in database
    app.get("/signup-process", function (req, resp) {
        let email = req.query.txtemail;
        let pwd = req.query.txtpwd;
        let utype = req.query.utype;
        mysql.query("insert into users values(?,?,?,?)", [email, pwd, utype, 1], function (err) {
            if (err != null) {
                resp.send("Please insert the details carefully. Try checking the email / password or check if you have chosen between Influencer or Host.");
            } else {
                resp.send("Sign Up successful");
            }
        })
    })

    // checking email availability
    app.get("/email-availability", function (req, resp) {
        let email = req.query.txtemail;
        mysql.query("select * from users where email=?", [email], function (err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            if (resultJsonAry.length == 0) {
                resp.send("Email Available");
            }
            else
                resp.send("Email already exists!");
        })
    })

    // checking credentials for login process
    app.get("/login-process", function (req, resp) {
        let email = req.query.logemail;
        let pwd = req.query.logpwd;
        mysql.query("select * from users where email = ? and pwd = ?", [email, pwd], function (err, result) {
            if (err) {
                resp.send(err.message);
            } else {
                if (result.length == 1) {
                    if (result[0].status == 1) {
                        resp.send(result[0].utype);
                        return;
                    } else {
                        resp.send("User Blocked!");
                    }
                } else {
                    resp.send("Invalid Email or Password");
                }
            }
        })
    })

    // open influncer dash
    app.get("/open-idash", function (req, resp) {
        let path = __dirname + "/public/influencer-dash.html";
        resp.sendFile(path);
    })

    // sending email on forgot password
    app.get("/forgot-password", function (req, resp) {
        let email = req.query.logemail;
        mysql.query("select * from users where email = ?", [email], function (err, result) {
            if (err) {
                resp.send(err.message);
            }
            else {
                if (result.length == 0) {
                    resp.send("Invalid Email ID");
                }
                else if (result.length == 1) {
                    var mailOptions = {
                        from: 'try.vanshjindal@gmail.com',
                        to: email,
                        subject: 'Forgot Password Request',
                        text: `Your Elysian Password: ` + result[0].pwd
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            resp.send(err.message);
                        } else {
                            console.log('Email sent: ' + info.response);
                            resp.send("Email sent to registered email!");
                        }
                    });
                }
            }
        })
    })

    // open admin dash
    app.get("/open-admin-dash", function (req, resp) {
        let path = __dirname + "/public/Admin-dash.html";
        resp.sendFile(path);
    })

    // open influencer finder
    app.get("/open-influ-finder",function(req,resp){
        let path = __dirname + "/public/influ-finder.html";
        resp.sendFile(path);
    })
}

// influencer dash page
{
    // open influencer profile
    app.get("/open-inf-profile", function (req, resp) {
        let path = __dirname + "/public/influencer-profile.html";
        resp.sendFile(path);
    })

    // saving add event details
    app.get("/post-event", function (req, resp) {
        let emailid = req.query.emailid;
        let events = req.query.events;
        let doe = req.query.doe;
        let tos = req.query.tos;
        let city = req.query.city;
        let venue = req.query.venue;

        mysql.query("insert into eventss values (null,?,?,?,?,?,?)", [emailid, events, doe, tos, city, venue], function (err, result) {
            if (err == null) {
                resp.send("Event added!");
            } else {
                resp.send(err.message);
            }
        })
    })

    // checking email and password before updating password
    app.get("/chk-update-pwd", function (req, resp) {
        let email = req.query.updtemail;
        let pwd = req.query.oldpwd;
        mysql.query("select * from users where email = ? and pwd = ?", [email, pwd], function (err, result) {
            if (err) {
                resp.send(err.message);
            } else {
                if (result.length == 1) {
                    if (result[0].status == 1) {
                        resp.send("Valid");
                        return;
                    } else {
                        resp.send("User Blocked!");
                    }
                } else {
                    resp.send("Invalid Email or Password");
                }
            }
        })
    })

    // updating password in database
    app.get("/update-pwd", function (req, resp) {
        let email = req.query.updtemail;
        let old = req.query.oldpwd;
        let con = req.query.conpwd;
        mysql.query("update users set pwd = ? where email = ? and pwd = ?", [con, email, old], function (err, result) {
            if (err) {
                resp.send(err.message);
            } else {
                if (result.affectedRows == 1) {
                    resp.send("Password updated successfully!");
                }
                else {
                    resp.send("Invalid data!");
                }
            }
        })
    })

    // open event manager
    app.get("/open-event-manager",function(req,resp){
        let path = __dirname + "/public/event-manager.html";
        resp.sendFile(path);
    })
}

// influencer profile page
{
    // saving influencer profile
    app.post("/infl-profile-save",async function (req, resp) {
        let fileName = "";
        if (req.files != null) {
            fileName = req.files.picpath.name;
            let path = __dirname + "/public/uploads/" + fileName;
            req.files.picpath.mv(path);
            await cloudinary.uploader.upload(path)
            .then(function(result){
                fileName = result.url;
            })
        }
        else {
            fileName = "31903202.jpg";
            //let path = __dirname + "/public/uploads/" + fileName;
            //req.files.picpath.mv(path);
        }
        // req.body.ppic = fileName;
        // resp.send(req.body);
        let email = req.body.email;
        let iname = req.body.iname;
        let contact = req.body.contact;
        let gender = req.body.gender;
        let dob = req.body.dob;
        let address = req.body.address;
        let city = req.body.city;
        let state = req.body.state;
        let insta = req.body.insta;
        let fb = req.body.fb;
        let youtube = req.body.youtube;
        let field = req.body.field;
        let otherinfo = req.body.otherinfo;

        mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [fileName, email, iname, contact, gender, dob, address, city, state, insta, fb, youtube, field, otherinfo], function (err) {
            if (err == null) {
                resp.send("Data saved!");
            } else {
                resp.send(err.message);
            }
        })
    })

    // updating influencer profile
    app.post("/update-infl-profile", function (req, resp) {
        let fileName = "";
        if (req.files != null) {
            fileName = req.files.picpath.name;
            let path = __dirname + "/public/uploads/" + fileName;
            req.files.picpath.mv(path);
        }
        else {
            fileName = req.body.hdn;
        }
        let email = req.body.email;
        let iname = req.body.iname;
        let contact = req.body.contact;
        let gender = req.body.gender;
        let dob = req.body.dob;
        let address = req.body.address;
        let city = req.body.city;
        let state = req.body.state;
        let insta = req.body.insta;
        let fb = req.body.fb;
        let youtube = req.body.youtube;
        let field = req.body.field;
        let otherinfo = req.body.otherinfo;

        mysql.query("update iprofile set picpath=? , iname=?, contact=?, gender=?, dob=?, address=?,city=?, state=?,insta=?,fb=?, youtube=?,field=?,otherinfo=? where email=?", [fileName, iname, contact, gender, dob, address, city, state, insta, fb, youtube, field, otherinfo, email], function (err, result) {
            if (err == null) {
                if (result.affectedRows >= 1) {
                    resp.send("Updated successfully!");
                } else {
                    resp.send("Invalid email ID");
                }
            } else {
                resp.send(err.message);
            }
        })
    })

    // searching for influencer profile
    app.get("/find-infl-profile", function (req, resp) {
        let email = req.query.email;
        mysql.query("select * from iprofile where email = ?", [email], function (err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
        })
    })

    // checking account
    app.get("/check-acc",function(req,resp){
        let email = req.query.email;
        mysql.query("select * from iprofile where email = ?",[email],function(err,result){
            if (err){
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })
}

// admin dash page
{
    // open admin users management
    app.get("/open-admin-users", function (req, resp) {
        let path = __dirname + "/public/Admin-users.html";
        resp.sendFile(path);
    })
    
    // open admin all influencer console
    app.get("/open-admin-all-influ", function (req, resp) {
        let path = __dirname + "/public/Admin-all-influ.html";
        resp.sendFile(path);
    })

}

// admin users page
{
    //fetch all users data form database
    app.get("/fetch-data",function(req,resp){
        mysql.query("select * from users", function(err, result){
            if (err) {
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    // fill user type in list box
    app.get("/fill-utype",function(req,resp){
        mysql.query("select distinct utype from users",function(err,result){
            if(err){
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    // fill utype data in table
    app.get("/show-utype-data",function(req,resp){
        mysql.query("select * from users where utype = ?",[req.query.type],function(err,result){
            if(err){
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    // block user 
    app.get("/block-user",function(req,resp){
        mysql.query("update users set status = ? where email = ?",[0,req.query.email],function(err,result){
            if(err){
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    // unblock user 
    app.get("/unblock-user",function(req,resp){
        mysql.query("update users set status = ? where email = ?",[1,req.query.email],function(err,result){
            if(err){
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    // delete user
    app.get("/del-user",function(req,resp){
        mysql.query("delete from users where email = ?",[req.query.email],function(err,result){
            if(err) {
                resp.send(err.message);
            } else {
                resp.send("User-data deleted!")
            }
        })
    })
}

// admin influencers console page
{
    // fetch influencers data
    app.get("/fetch-influ-data",function(req,resp){
        mysql.query("select * from iprofile",function(err,result){
            if (err) {
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })
}

// influencer finder page
{
    // fetch all influencers
    app.get("/fetch-all-influ",function(req,resp){
        mysql.query("select * from iprofile order by iname",function(err,result){
            if (err) {
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    // get influencer data
    app.get("/get-influ",function(req,resp){
        search = "%"+req.query.search+"%";
        mysql.query("select * from iprofile where iname like ? or city like ? or state like ? or field like ? order by iname",[search , search , search , search],function(err,result){
            if (err) {
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    app.get("/get-past-events",function(req,resp){
        let email = req.query.email;
        mysql.query("select events from eventss where emailid = ? order by doe desc",[email],function(err,result){
            if(err){
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })
}

// event manager page
{
    // fetch events
    app.get("/fetch-events",function(req,resp){
        mysql.query("select * from eventss where doe >= current_date() and emailid = ?",[req.query.mail],function(err,result){
            if (err) {
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })

    // delete event
    app.get("/del-event",function(req,resp){
        mysql.query("delete from eventss where rid = ?",[req.query.rid],function(err,result){
            if(err) {
                resp.send(err.message);
            } else {
                resp.send("Event deleted!")
            }
        })
    })

    // update event
    app.get("/updt-event",function(req,resp){
        let rid = req.query.rid;
        let events = req.query.events;
        let doe = req.query.doe;
        let tos = req.query.tos;
        let city = req.query.city;
        let venue = req.query.venue;
        mysql.query("update eventss set  events=? , doe=? , tos=? , city=?, venue=? where rid=?",[events,doe,tos,city,venue,rid],function(err,result){
            if(err){
                resp.send(err.message);
            }else {
                resp.send("Updated Successfully!");
            }
        })
    })
}

// client dash page
{
    // open influencer finder
    app.get("/open_influ_finder",function(req,resp){
        let path = __dirname + "/public/influ-finder.html";
        resp.sendFile(path);
    })

    // open client profile
    app.get("/open-client-profile",function(req,resp){
        let path = __dirname + "/public/client-profile.html";
        resp.sendFile(path);
    })
}

// client profile page
{
    // saving influencer profile
    app.post("/client-profile-save", function (req, resp) {
        let email = req.body.email;
        let cname = req.body.cname;
        let contact = req.body.contact;
        let city = req.body.city;
        let state = req.body.state;

        mysql.query("insert into cprofile values(?,?,?,?,?)", [email, cname, city, state , contact], function (err) {
            if (err == null) {
                resp.send("Data saved!");
                console.log("Data saved");
            } else {
                resp.send(err.message);
                console.log(err.message);
            }
        })
    })

    // update client profile
    app.post("/update-client-profile", function (req, resp) {
        let email = req.body.email;
        let cname = req.body.cname;
        let contact = req.body.contact;
        let city = req.body.city;
        let state = req.body.state;

        mysql.query("update cprofile set cname=?, mobile=?, city=?, state=? where email=?", [cname, contact, city, state, email], function (err, result) {
            if (err == null) {
                if (result.affectedRows >= 1) {
                    resp.send("Updated successfully!");
                } else {
                    resp.send("Invalid email ID");
                }
            } else {
                resp.send(err.message);
            }
        })
    })

    // searching for client profile
    app.get("/find-client-profile", function (req, resp) {
        let email = req.query.email;
        mysql.query("select * from cprofile where email = ?", [email], function (err, resultJsonAry) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            // console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
        })
    })

    // checking account existence
    app.get("/check-account",function(req,resp){
        let email = req.query.email;
        mysql.query("select * from cprofile where email = ?",[email],function(err,result){
            if (err){
                resp.send(err.message);
            } else {
                resp.send(result);
            }
        })
    })
}