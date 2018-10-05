
const express = require('express');
const router = express.Router();
const MicroGear = require('microgear');
const MongoClient = require('mongodb').MongoClient;
const date = new Date();
const datetime =  require('node-datetime');

const KEY = "kfHTjp8WB2e1ira";
const SECRET = "Nqyk0LBleDpZdl7in1SGC888k";
const APPID = "KangSmartHome";
const THINK = "ESP8266";
const ALIAS = "Dashboard1";

var status = "Not Request Status";

var url = "mongodb://localhost:27017/";

function insertTemp(tempData, datetimeNow){
  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    console.log("-----Connected Database");
    var dbo = db.db("temperator");
    var buf = new Buffer(tempData);
    var setData = parseInt(buf.toString('ascii'), 10);
    var myobj = { Celsius: setData, DateTime: datetimeNow };
      dbo.collection("temp").insertOne(myobj, function(err, res){
        if(err) throw err;
        console.log("-----Insert Success");
        db.close();
      });
  });
}

function dateTimeNow(){
  var dt = datetime.create();
  var formatedDate = dt.format('d/m/y H:M:S');
  return formatedDate;
}

var microgear = MicroGear.create({
  key: KEY,
  secret : SECRET
});

microgear.on('connected', function() {
  console.log('เชื่อมต่อกับ ESP8266 สำเร็จ');
  console.log('เวลา '+dateTimeNow());
  console.log(" ");
  console.log('กำลังร้องขอสถานะของหลอดไฟ');
  microgear.setAlias(ALIAS);
  microgear.chat(THINK, "?");
  setInterval(function() {
    microgear.chat(THINK, "2");
  },120000);
});

//microgear
microgear.on('message', function(topic,body) {
  console.log('ข้อความจาก ESP8266 : '+body);
  console.log("เวลา "+dateTimeNow());
  if(body == "Status : ON" || body == "Status : OFF"){
    status = body;
  }else{
    // temps = body;
    insertTemp(body, dateTimeNow());
  }
});

router.get('/', function(req, res, next) {
  microgear.chat(THINK, "?");
  if(status == "Status : ON"){
    var setTitle = "ไฟเปิดอยู่";
  }else if(status == "Status : OFF"){
    var setTitle = "ไฟปิดอยู่";
  }else{
    var setTitle = "ไม่สามารถเช็คสถานะได้";
  }
  res.render('index', { title: setTitle });
});

router.get('/on', function(req, res, next) {
  microgear.chat(THINK, "1");
  res.render('index', { title: 'เปิดไฟสำเร็จ' } );
});

router.get('/off', function(req, res, next) {
  microgear.chat(THINK, "0");
  res.render('index', { title: 'ปิดไฟสำเร็จ' } );
});

router.get('/temp', function(req, res, next) {
  res.render('dashboard', { title: "Angular-Chart.js" });
});

router.get('/thingSpeak', function(req, res, next) {
  res.render('thingSpeak', { title: "กราฟแสดงค่าอุณหภูมิ" });
});

router.get('/humidity', function(req, res, next) {
  res.render('humidity', { title: "กราฟแสดงค่าความชื่้น" });
});

microgear.on('closed', function() {
  console.log('Closed...');
});

microgear.connect(APPID);

module.exports = router;
