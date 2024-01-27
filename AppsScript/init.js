const send_url =SERVER_IP_WITH_PORT;
const sheetID = SHEET_ID;
function start(){
  SpreadsheetApp.openById(sheetID).getSheetByName('SMS').getRange(4,6).setValue(""); //로그 초기화
  sample.setValue("");
  console.log(isTest);
  processSpreadsheet();
};

function onEdit(e) {
  var sheet = e.range.getSheet();
  var editedRow = e.range.getRow();
  calculate(sheet.getName(), editedRow);
}