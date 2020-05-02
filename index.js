let express = require("express");
let app = express();
let cors = require("cors");
let path = require("path");

let firebase = require("firebase/app");
require("firebase/database");

let firebaseConfig = {
  apiKey: "AIzaSyAwJivg_StnV4ODdSDB7ERjfFjfmhg_qL8",
  authDomain: "ua5-e7d57.firebaseapp.com",
  databaseURL: "https://ua5-e7d57.firebaseio.com",
  projectId: "ua5-e7d57",
  storageBucket: "ua5-e7d57.appspot.com",
  messagingSenderId: "754261369831",
  appId: "1:754261369831:web:60ccb3ec5af66b750fd342"
};
let data = {};
let initialized = false;
function getData() {
  let v = {};
  return database
    .ref("data/")
    .once("value")
    .then(snapshot => {
      data = snapshot.val();
      
    });
}

firebase.initializeApp(firebaseConfig);
let database = firebase.database();
getData();
//data = getData().then(woof => {data=woof});
console.log("arrrg",data);

let bodyParser = require("body-parser");

let ageData = [[],[],[],[],[]];
let empData = [[],[],[],[],[],[]];
let genderArr = [[],[]];
let prexArr = [[],[],[],[],[],[]];
let ageSum = [0,0,0,0,0];
let empSum = [0,0,0,0,0,0];
let genderSum = [0,0];
let prexSum = [0,0,0,0,0,0];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
  
    //intercepts OPTIONS method
    if ("OPTIONS" === req.method) {
      //respond with 200
      res.send(200);
    } else {
      //move on
      next();
    }
  });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html")); // relative path
    });
  }
app.post("/",(req,res) => {
    console.log(res.body.w);
});
app.post("/registerScore",(req,res) => {
    //format -> {hash key: x age:}
    //let hId = ob.hash;
    console.log("reg",data);
    if(!initialized)setArrs();
    initialized = true;
    let ob = req.body;
    if (typeof ob == "string"){
      ob = JSON.parse(ob);
    }
    let age = parseInt(ob.age.replace(/['"]+/g, ''));
    let empl = parseInt(ob.emp.replace(/['"]+/g, ''));
    let gender = parseInt(ob.gender.replace(/['"]+/g, ''));
    let prex = parseInt(ob.prex.replace(/['"]+/g, ''));
    let score = parseFloat(ob.score.replace(/['"]+/g, ''));

    ageSum[age]+=score;
    empSum[empl]+=score;
    genderSum[gender]+=score;
    prexSum[prex]+=score;
    ageData[age].push(score);
    empData[empl].push(score);
    genderArr[gender].push(score);
    prexArr[prex].push(score);
    updateFirebased({ageData:ageData,empData:empData,genderArr:genderArr,prexArr:prexArr,ageSum:ageSum,empSum:empSum,genderSum:genderSum,prexSum:prexSum});
    console.log(ageSum);
    console.log(ageData);
    res.send("Done");
});

app.post("/getScore",(req,res) => {
  //format -> {hash key: x age:}
  //let hId = ob.hash;
  //console.log(data);
  
  if(!initialized)setArrs();
  initialized = true;
  let ob = req.body;
    if (typeof ob == "string"){
      ob = JSON.parse(ob);
    }

  //let ord = getData();
  console.log(ob.age);
  
  let age = parseInt(ob.age.replace(/['"]+/g, ''));
  let empl = parseInt(ob.emp.replace(/['"]+/g, ''));
  let gender = parseInt(ob.gender.replace(/['"]+/g, ''));
  let prex = parseInt(ob.prex.replace(/['"]+/g, ''));
  //resetDatabase();
  //let score = Number(ob.score);
  console.log(prexArr,genderArr);
  let out = [];
  out.push(ageSum[age]/ageData[age].length);
  out.push(empSum[empl]/empData[empl].length);
  out.push(genderSum[gender]/genderArr[gender].length);
  out.push(prexSum[prex]/prexArr[prex].length);
  res.send(out);
  
});



let port = process.env.PORT || 9000;

app.listen(port);

// function getData() {
//   return database
//     .ref("data/")
//     .once("value")
//     .then(snapshot => {
//       console.log("ddd", snapshot.val());
//       return snapshot.val();
//     });
// }

function updateFirebased() {
  //console.log(polls[pollid]);

  database
    .ref("data/")
    .once("value")
    .then(snapshot => {
      database.ref("data").set({ ageData,empData,genderArr,prexArr,
        ageSum,empSum,genderSum,prexSum });
    });
}
function setArrs(){
  //console.log(data);
  ageData = data.ageData;
  empData = data.empData;
  genderArr = data.genderArr;
  prexArr = data.prexArr;
  ageSum = data.ageSum;
  empSum = data.empSum;
  genderSum = data.genderSum;
  prexSum = data.prexSum;
}

//ONLY USE FOR EMERGENCIES WHEN DATA IS CORRUPTED
function resetDatabase(){
  ageData = [[69],[70],[80],[90],[99]];
  empData = [[57],[69],[69],[50],[70],[60]];
  genderArr = [[50],[50]];
  prexArr = [[10],[20],[30],[40],[50],[60]];
  ageSum = [69,70,80,90,99];
  empSum = [57,69,69,50,70,60];
  genderSum = [50,50];
  prexSum = [10,20,30,40,50,60];
  updateFirebased();
}