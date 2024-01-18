const express = require("express");
const axios = require('axios');
const FormData = require('form-data');
const app = express();
require("dotenv").config();

app.use(express.json());

app.post('/', function(req, res){
    //Load New FormData to send
    var pack=req.body;
    let data = new FormData();
    data.append('key', process.env.API_KEY);
    data.append('userid', process.env.USER_ID);
    data.append('sender', process.env.SENDER);
    data.append('title' , process.env.TITLE);
    data.append('msg_type' , 'LMS');
    if(pack.test){ //Check if test checkbox is TRUE
        data.append('testmode_yn', 'Y');
    }
    data.append('receiver', pack.receiver);
    data.append('msg', pack.msg);
    
    //If time is between 23:00~7:00, Set reservation
    let date_ob = new Date();
    let hour = date_ob.getHours();
    if(hour > 22){
      date_ob.setDate(date_ob.getDate()+1);
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      data.append('rdate' ,year +  month +  date);
      data.append('rtime' ,"0700");
      date_ob.setDate(date_ob.getDate()-1);
    }
    else if(hour < 7){
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      data.append('rdate' , year +  month +  date);
      data.append('rtime' ,"0700");
    }

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apis.aligo.in/send/',
        headers: { 
          ...data.getHeaders()
        },
        data : data
      };
      axios.request(config)
      .then((response) => {
        //Print message and return to Apps Script
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        console.log("["+month+"/"+date+" "+hour+":"+date_ob.getMinutes()+"] "+pack.receiver+" "+response.data.message);
        let answer = {
            message : response.data.message
        }
        res.send(answer);
      })
      .catch((error) => {
        console.log(error);
      });
});
app.listen(process.env.portNum, () => console.log("listening on port "+  process.env.portNum +"..."));