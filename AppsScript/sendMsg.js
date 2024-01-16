var data = SpreadsheetApp.openById(sheetID).getSheetByName('SMS').getDataRange().getValues();
var cel = SpreadsheetApp.openById(sheetID).getSheetByName('SMS').getRange(4,6);
var sample = SpreadsheetApp.openById(sheetID).getSheetByName('SMS').getRange(6,8);
var isTest = (SpreadsheetApp.openById(sheetID).getSheetByName('SMS').getRange(4,9).getDisplayValue() == 'TRUE');
var attendedOrigin = data[2][1];
var unattendOrigin = data[16][1];
var progress = data[0][3];

function prepareSMS(student){
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
    attendedText = attendedText.replace("@progress",progress);
    attendedText = attendedText.replace("@testNum",student.week-1);
    attendedText = attendedText.replace("@testScore",student.testScore);
    attendedText = attendedText.replace("@HighScore",student.highScore);
    attendedText = attendedText.replace("@average",student.averageScore);
    attendedText = attendedText.replace("@ytlink",student.link);
    sendSMS(student.studentName,attendedText,student.parentHP);
    if(student.studentHP != ""){
      sendSMS(student.studentName,attendedText,student.studentHP);
    }
  }
  if(student.attendance == '동'){
    var attendedText = unattendOrigin;
    attendedText = attendedText.replace("@week",student.week);
    attendedText = attendedText.replace("@date",student.date);
    attendedText = attendedText.replace("@progress",progress);
    attendedText = attendedText.replace("@ytlink",student.link);
    sendSMS(student.studentName,attendedText,student.parentHP);
    if(student.studentHP != ""){
      sendSMS(student.studentName,attendedText,student.studentHP);
    }
  }
}
function sendSMS(name,text,parentHP){
  var sms = {
        'receiver': parentHP,
        'msg': text,
        'test': isTest
  };
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(sms)
  };
  var response = JSON.parse(UrlFetchApp.fetch(send_url, options).getContentText());
  if(sample.getValue()==""){
      sample.setValue(text);
    }
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