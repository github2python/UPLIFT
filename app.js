const express = require('express');
const app=express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const csrf = require('csurf');
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const Student = require('./models/student');
const Job=require('./models/job')
const detail=require("./seed/a");
const det=require("./seed/b")
app.listen(3000, () => {
    console.log("Hello! listening on port 3000");
})
mongoose.connect('mongodb://localhost:27017/uplift', {
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// const seedDB = async () => {
//   // await Student.deleteMany({});
//   for (let i = 0; i < 12; i++) {
//       const stu = new Student({
//           name:`${detail[i].name}`,
//           familyincome:`${detail[i].familyincome}`,
//           reward:`${detail[i].reward}`,
//           percentage:`${detail[i].percentage}`,
//           standard:`${detail[i].standard}`,
//           website:`${detail[i].website}`
//       })
//       await stu.save();
//   }
// }

// seedDB().then(() => {
//   mongoose.connection.close();
// })



// const seedDB = async () => {
//   await Job.deleteMany({});
//   for (let i = 0; i < 7; i++) {
//       const joy = new Job({
//           name:`${det[i].name}`,
//           standard:`${det[i].standard}`,
//           skills:`${det[i].skills}`,
//           organization:`${det[i].organization}`,
//           salary:`${det[i].salary}`

//       })
//       await joy.save();
//   }
// }

// seedDB().then(() => {
//   mongoose.connection.close();
// })




var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://uplift-8715a-default-rtdb.firebaseio.com"
});
const csrfMiddleware = csrf({cookie:true});
const PORT = process.env.PORT || 3000;

app.engine("html", require("ejs").renderFile);
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
    res.render("login");
})
app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get("/home", function (req, res) {
  const sessionCookie = req.cookies.session || "";
  // console.log(req.body)
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      res.render("index");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});
app.post('/sessionLogin',(req,res)=>{
    const idToken=req.body.idToken.toString();
    const expiresIn=60*60*24*5*1000;
    //console.log(req.body);
    admin
      .auth()
      .createSessionCookie(idToken,{expiresIn})
      .then(
          (sessionCookie) => {
              const options = {maxAge:expiresIn, httpOnly:true}
              res.cookie("session",sessionCookie,options)
              res.send(JSON.stringify({status:"success"}))
          },
          (error)=> {
              res.status(401).send("Sorry Unauthorized request")
              window.alert("Incorrect details")
              // res.redirect("/login")
          }
        
      )
      .catch(error => {
        console.log(error.message)
      })
});

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
});
app.get("/home/profile", (req, res) => {
  res.render("profile")
  //console.log(req.body);
});



app.get('/home/scholarship', async(req, res) => {
    const list = await Student.find({});
    res.render('scholarship',{ list });
})
app.get('/home/scholarship/specify',async(req,res)=>{
  console.log(req.query);
  const income= parseInt(req.query.myfamilyincome,10);
  const cgpa = parseInt(req.query.myCGPA,10);
  // console.log(grade);
  // console.log(cgpa);
  const temp = await Student.find({$and: [{"percentage":{$gt:`${cgpa}`}},{"familyincome":{$gt:`${income}`}}]});
  res.render("sorted",{ temp })
  // console.log(temp);
})
app.get('/home/jobs', async(req, res) => {
  const list = await Job.find({});
    res.render('jobs',{ list });
})
app.get('/home/jobs/specify',async(req,res) => {
  const occup = req.query.name;
  const education = req.query.myclass;
  console.log(education);
  const temp = await Job.find({$and:[{"name":occup},{"standard":education}]});
  // console.log(temp);
  res.render('jobsort',{ temp })
  
})
// app.get('/home/createResume', (req, res) => {
//     res.render('resume');
// })




























// app.get('*', (req, res) => {
//     //res.send("<script>alert('Sorry the page you searched not exists')</script>");
//     res.redirect('/login');
// })
