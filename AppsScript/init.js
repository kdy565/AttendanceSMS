const send_url =SERVER_IP_WITH_PORT;
const SHEET_ID = SHEET_ID;
function start(){
  SpreadsheetApp.openById(SHEET_ID).getSheetByName('SMS').getRange(4,6).setValue(""); //로그 초기화
  sample.setValue("");
  processSpreadsheet();
};

function sendSearched(){
  sendSMS(SMS_sheet.getRange(32,2).getValue(),SMS_sheet.getRange(35,1).getValue(),SMS_sheet.getRange(34,1).getValue());
  if(SMS_sheet.getRange(34,2).getValue() != "") sendSMS(SMS_sheet.getRange(32,2).getValue(),processSearch(),SMS_sheet.getRange(34,2).getValue());
}