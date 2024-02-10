var SMS_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SMS');

var data = SMS_sheet.getDataRange().getValues();
var cel = SMS_sheet.getRange(4,6);
var sample = SMS_sheet.getRange(6,8);
var isTest = (SMS_sheet.getRange(4,9).getDisplayValue() == 'TRUE');
var attendedOrigin = data[2][1];
var unattendOrigin = data[16][1];

function writeMSG(student){
  if(student.attendance == "o"){
    var attendedText = attendedOrigin;
    if(student.grad==2){
      attendedText = attendedText.replace("@grad","◯");
    }
    if(student.grad==1){
      attendedText = attendedText.replace("@grad","▲");
    }
    if(student.grad==0){
      attendedText = attendedText.replace("@grad","X");
    }
    attendedText = attendedText.replace('@name',student.studentName);
    attendedText = attendedText.replace('@name',student.studentName);
    attendedText = attendedText.replace("@week",student.week);
    attendedText = attendedText.replace("@week",student.week);
    attendedText = attendedText.replace("@date",student.date);
    attendedText = attendedText.replace("@thirty",student.thirty);
    attendedText = attendedText.replace("@progress",student.progress);
    attendedText = attendedText.replace("@testNum",student.week-1);
    attendedText = attendedText.replace("@testScore",student.testScore);
    attendedText = attendedText.replace("@HighScore",student.highScore);
    attendedText = attendedText.replace("@average",student.averageScore);
  }
  if(student.attendance == '동'){
    var attendedText = unattendOrigin;
    attendedText = attendedText.replace("@week",student.week);
    attendedText = attendedText.replace("@date",student.date);
    attendedText = attendedText.replace("@ytlink",student.link);
  }
  return attendedText;
}

function prepareSMS(student){
  var attendedText = writeMSG(student);
  sendSMS(student.studentName,attendedText,student.parentHP);
  if(student.studentHP != "") sendSMS(student.studentName,attendedText,student.studentHP);
  return attendedText;
}

function sendSMS(name,text,parentHP){
  var sms = {
        'receiver': parentHP,
        'msg': text,
        'test': isTest,
        'name' : name
  };
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(sms)
  };
  var response = JSON.parse(UrlFetchApp.fetch(send_url, options).getContentText());
  sample.setValue(text);
  if(response.message == "success" ){
    //console.log(name+" ("+parentHP+") 발송 성공");
    cel.setValue(cel.getDisplayValue()+name+" ("+parentHP+") 발송 성공 \n");
    console.log(name+" ("+parentHP+") 발송 성공");
  }
  else if(response.message == "reserved"){
    cel.setValue(cel.getDisplayValue()+name+" ("+parentHP+") 예약 성공 \n");
    console.log(name+" ("+parentHP+") 예약 성공");
  }
  else{
    cel.setValue(cel.getDisplayValue()+name+" ("+parentHP+") 전송 실패: "+response.message+" \n");
    console.log(name+" 전송 실패: "+response.message);
  }
}

function prepLog(){
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SMS').getRange(4,6).setValue(""); //로그 초기화
  sample.setValue("");
}