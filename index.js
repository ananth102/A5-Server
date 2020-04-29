let express = require("express");
let app = express();
let cors = require("cors");
let path = require("path");

let bodyParser = require("body-parser");
//let data = {};
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
    let ob = req.body;
    if (typeof ob == "string"){
      ob = JSON.parse(ob);
    }
    let age = ob.age;
    let empl = ob.emp;
    let gender = ob.gender;
    let prex = ob.prex;
    let score = Number(ob.score);
    ageSum[age]+=score;
    empSum[empl]+=score;
    genderSum[gender]+=score;
    prexSum[prex]+=score;
    ageData[age].push(score);
    empData[empl].push(score);
    genderArr[gender].push(score);
    prexArr[prex].push(score);
    console.log(ageSum);
    console.log(ageData);
    res.send("Done");
});

app.post("/getScore",(req,res) => {
  //format -> {hash key: x age:}
  //let hId = ob.hash;
  let ob = req.body;
    if (typeof ob == "string"){
      ob = JSON.parse(ob);
    }
  let age = ob.age;
  let empl = ob.emp;
  let gender = ob.gender;
  let prex = ob.prex;
  let out = [];
  out.push(ageSum[age]/ageData[age].length);
  out.push(empSum[empl]/empData[empl].length);
  out.push(genderSum[gender]/genderArr[gender].length);
  out.push(prexSum[prex]/prexArr[prex].length);
  res.send(out);
});



let port = process.env.PORT || 9000;

app.listen(port);