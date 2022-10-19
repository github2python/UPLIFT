const express = require('express');
const app=express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const csrf = require('csurf');
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.listen(3000, () => {
    console.log("Hello! listening on port 3000");
})

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const csrfMiddleware = csrf({cookie:true});
const PORT = process.env.PORT || 3000;

//app.engine("html", require("ejs").renderFile);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.set("views",path.join(__dirname,"/views"));
app.set("public",path.join(__dirname,"/public"));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("method"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all('*',(req,res,next)=>{
    res.cookie("XSRF-TOKEN",req.csrfToken())
    next();
})
app.get('/login', (req, res) => {
    res.render("login.ejs");
})
app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/sessionLogin',(req,res)=>{
    const idToken=req.body.idToken.toString();
    const expiresIn=60*60*24*5*1000;
    admin
    .auth()
    .createSessionCookie(idToken,{expiresIn})
    .then(
        (sessionCookie) => {
            const options = {maxAge:expiresin,httpOnly:true}
            res.cookie("session",sessionCookie,options)
            res.send(JSON.stringify({status:"success"}))
        },
        (error)=> {
            res.status(401).send("Sorry Unauthorized request")
            res.redirect("/login")
        }
        
    )
})
app.get("/home", function (req, res) {
    const sessionCookie = req.cookies.session || "";
   
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("index");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  });
app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
  });

// app.get('/home', (req, res) => {
//     res.render('index');
// })


// app.get('/home/scholarship', (req, res) => {
//     res.render('scholarship');
// })
// app.get('/home/jobs', (req, res) => {
//     res.render('jobs');
// })
// app.get('/home/createResume', (req, res) => {
//     res.render('resume');
// })




























// app.get('*', (req, res) => {
//     res.send("<script>alert('Sorry the page you searched not exists')</script>");
//     res.redirect('/login');
// })
