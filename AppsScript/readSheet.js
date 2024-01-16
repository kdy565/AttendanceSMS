function processSpreadsheet() {
  var spreadsheet = SpreadsheetApp.openById(sheetID);
  var sheet = spreadsheet.getSheetByName('SMS');
  var data = sheet.getDataRange().getValues();
  var sheetId = data[0][1];
  var week = data[1][1];
  var sheet = spreadsheet.getSheetByName(sheetId);
  var data = sheet.getDataRange().getValues();
  var date = sheet.getRange(1,4+3*week).getDisplayValue();
  var link = data[2][3+3*week]; //복습영상 링크
  
  console.log(sheetId+": "+week+"주차 문자 발송");
  //평균 구하기
  var averageScore = 0;
  var count = 0;
  var highScore = 0;
  var allScores = [];
  for (var i = 4; i < data.length; i++) {
    var testScore = data[i][5+3*week];
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
  var cell = sheet.getRange(3,5+3*week);
  cell.setValue(averageScore);
  
  console.log(averageScore);
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
  var cell = sheet.getRange(3,6+3*week);
  cell.setValue(sum);
  
  console.log(sum);

  for (var i = 4; i < data.length; i++) {
    var student={
      studentName : data[i][2],
      parentHP : data[i][4],
      studentHP : data[i][5],
      attendance : data[i][3+3*week],
      testScore : data[i][5+3*week],
      averageScore : averageScore,
      highScore :  highScore,
      thirty : sum,
      grad : data[i][4+3*week],
      week : week,
      date : date,
      link : link
    };
    if (student.studentName!=""){ //이름 존재하는 칸
      if (student.attendance == "o"||student.attendance == "동"){ //출석했음
        prepareSMS(student);
      }
    }
  }
}

function calculate(){
  var spreadsheet = SpreadsheetApp.openById(sheetID);
  var sheet = spreadsheet.getSheetByName('성적처리');
  var data = sheet.getDataRange().getValues();
  var sheetId = data[0][1];
  var week = data[1][1];
  var sheet = spreadsheet.getSheetByName(sheetId);
  var data = sheet.getDataRange().getValues();
  var date = sheet.getRange(1,4+3*week).getDisplayValue();
  var link = data[2][3+3*week]; //복습영상 링크
  
  //평균 구하기
  var averageScore = 0;
  var count = 0;
  var highScore = 0;
  var allScores = [];
  for (var i = 4; i < data.length; i++) {
    var testScore = data[i][5+3*week];
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
  var cell = sheet.getRange(3,5+3*week);
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
  var cell = sheet.getRange(3,6+3*week);
  cell.setValue(sum);
  sheet = spreadsheet.getSheetByName('성적처리');
  cell = sheet.getRange(4,2);
  cell.setValue(sum);
  cell = sheet.getRange(3,2);
  cell.setValue(averageScore);
}