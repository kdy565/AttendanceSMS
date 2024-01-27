const send_url =SERVER_IP_WITH_PORT;
const SHEET_ID = SHEET_ID;
function start(){
  SpreadsheetApp.openById(SHEET_ID).getSheetByName('SMS').getRange(4,6).setValue(""); //로그 초기화
  sample.setValue("");
  console.log(isTest);
  processSpreadsheet();
};

function onEdit2(e) {
  var sheet = e.range.getSheet();
  var editedRow = e.range.getColumn();
  var sheetname = sheet.getName();
  if(editedRow > 6 && editedRow%3 == 0 && sheetname != 'SMS' && sheetname != '성적처리' && sheetname != '매뉴얼') calculate(sheetname, editedRow);
}