const send_url =SERVER_IP_WITH_PORT;
const SHEET_ID = SHEET_ID;

function sendTests(){
  prepLog();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('SMS');
  var data = sheet.getDataRange().getValues();
  var sheetId = data[0][1];
  var week = data[1][1];
  var data = {
        dropdownValue: sheetId,
        numberValue: week
      };
  processSpreadsheet1(data);
}

function sendVideos(){
  prepLog();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('SMS');
  var data = sheet.getDataRange().getValues();
  var sheetId = data[0][1];
  var week = data[1][1];
  var data = {
        dropdownValue: sheetId,
        numberValue: week
      };
  processSpreadsheet2(data);
}

function sendSearched(){
  sendSMS(SMS_sheet.getRange(32,2).getValue(),SMS_sheet.getRange(35,1).getValue(),SMS_sheet.getRange(34,1).getValue());
  if(SMS_sheet.getRange(34,2).getValue() != "") sendSMS(SMS_sheet.getRange(32,2).getValue(),processSearch(),SMS_sheet.getRange(34,2).getValue());
}