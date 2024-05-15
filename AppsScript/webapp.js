function doGet(e) {
    return HtmlService.createHtmlOutputFromFile('index');
}
  
function getDropdownOptionsFromCell() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SMS"); // Change "Sheet1" to your sheet's name
    var cell = sheet.getRange("B1"); // Change "A1" to the cell that contains the dropdown
    var rule = cell.getDataValidation();
    if (rule != null) {
        var criteria = rule.getCriteriaType();
        var args = rule.getCriteriaValues();
        
        if (criteria === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
            return args[0]; // args[0] is an array of the dropdown items
        } else if (criteria === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
            var range = args[0];
            var values = range.getValues();
            return values.map(function(row) { return row[0]; }); // Assuming the dropdown range has a single column
        }
    }
    return ["No dropdown or unsupported dropdown type"]; // Fallback message
}

function buttonOneAction(data) {
    prepLog();
    processSpreadsheet1(data);
    var completeMessage = data.dropdownValue + "수업 " + data.numberValue + "주차 테스트 문자 발송 완료하였습니다";
    return completeMessage;
}

function buttonTwoAction(data) {
    prepLog();
    processSpreadsheet2(data);
    var completeMessage = data.dropdownValue + "수업 " + data.numberValue + "주차 영상 발송 완료하였습니다";
    return completeMessage;
}