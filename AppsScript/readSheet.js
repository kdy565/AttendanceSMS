function processSpreadsheet1(dat) {//과제&테스트 전송
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetId = dat.dropdownValue;
  var week = dat.numberValue;
  var sheet = spreadsheet.getSheetByName(sheetId);
  var data = sheet.getDataRange().getValues();
  
  console.log(sheetId+": "+week+"주차 문자 발송");
  
  for (var i = 4; i < data.length; i++) {
    var student=packStudent(sheet.getRange(i+1,4+3*week));
    if (student.studentName!=""){ //이름 존재하는 칸
      if (student.attendance == "o"){ //출석했음
        var text = prepareSMS(student);
        sheet.getRange(i+1,4+3*week).setNote("["+Utilities.formatDate(new Date(), "GMT+9", "MM/dd HH:mm")+"]\n"+text);
      }
    }
  }
  return "sent";
}

function processSpreadsheet2(dat) {//영상 전송
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetId = dat.dropdownValue;
  var week = dat.numberValue;
  var sheet = spreadsheet.getSheetByName(sheetId);
  var data = sheet.getDataRange().getValues();
  
  console.log(sheetId+": "+week+"주차 문자 발송");
  
  for (var i = 4; i < data.length; i++) {
    var student=packStudent(sheet.getRange(i+1,4+3*week));
    if (student.studentName!=""){ //이름 존재하는 칸
      if (student.attendance == "o"||student.attendance == "동"){ //출석했음
        student.attendance = "동";
        prepareSMS(student);
      }
    }
  }
  return "sent";
}

function packStudent(e){
  var sheet = e.getSheet();
  var _row = e.getRow();
  var _column = e.getColumn();
  var calculation = calculate(e.getSheet().getName(),_column+2);
  var student={
      studentName : sheet.getRange(_row,3).getValue(),
      parentHP : sheet.getRange(_row,5).getValue(),
      studentHP : sheet.getRange(_row,6).getValue(),
      attendance : sheet.getRange(_row,_column).getValue(),
      testScore : sheet.getRange(_row,_column+2).getValue(),
      averageScore : calculation._average,
      highScore :  calculation._highscore,
      thirty : calculation._30average,
      grad : sheet.getRange(_row,_column+1).getValue(),
      week : (_column-4)/3,
      date : sheet.getRange(1,_column).getDisplayValue(),
      link : sheet.getRange(3,_column).getValue(),
      progress : sheet.getRange(4,_column).getNote()
    };
    return student;
}

//row = 6+3*week
function calculate(sheetName,row){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  //평균 구하기
  var averageScore = 0;
  var count = 0;
  var highScore = 0;
  var allScores = [];
  for (var i = 4; i < data.length; i++) {
    var testScore = data[i][row-1];
    if (testScore != "" ){
      allScores[count]=testScore;
      averageScore = averageScore + testScore;
      count++;
      if(testScore>highScore){
        highScore=testScore;
      }
    }
  }
  averageScore = averageScore/count;
  averageScore = averageScore.toFixed(1);
  var cell = sheet.getRange(3,row-1);
  cell.setValue(averageScore);
  
  //상위30퍼평균 구하기
  allScores.sort(function(a, b) {
  return b - a;
  });
  var sum=0;
  var i=0
  for(;i<count*3/10;i++){
    sum=sum+allScores[i];
  }
  sum = sum/i;
  sum = sum.toFixed(1);

  var cell = sheet.getRange(3,row);
  cell.setValue(sum);
  
  return {
    '_average' : averageScore,
    '_30average' : sum,
    '_highscore' : highScore,
    '_perfectNum': 0
  }
}