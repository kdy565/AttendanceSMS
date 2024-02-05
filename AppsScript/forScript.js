function onEdit3(e) {
    var sheet = e.range.getSheet();
    var editedRow = e.range.getRow();
    var editedCol = e.range.getColumn();
    
    // Check if the edited cell is B32
    if (editedRow == 32 && editedCol == 2) {
      var targetRow = sheet.getRange("A35");
      targetRow.setValue(processSearch());
    }
  }
  
  function processSearch(){
    var sheet = SMS_sheet;
    var sheetName = sheet.getRange("B31").getValue();
    var searchValue = sheet.getRange("B32").getValue();
    var multiplier = sheet.getRange("D31").getValue();
    var targetRow = sheet.getRange("A35");
    var targetColumn = 3 * multiplier + 4;
    var attendsheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
    var matchedRow = findRow(attendsheet.getRange("C:C"), searchValue);
    if (matchedRow !== -1) {
        //var note = attendsheet.getRange(matchedRow, targetColumn).getNote();
        /*if (note == "") */return writeMSG(packStudent(attendsheet.getRange(matchedRow, targetColumn)));
        //else return note;
      }
  }
  
  // Custom function to find the row number based on a search value
  function findRow(range, searchValue) {
    var values = range.getValues();
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] == searchValue) {
        return i + 1; // Adding 1 because array indices start from 0, but row numbers start from 1
      }
    }
    console.log("FAIL TO SEARCH");
    return -1; // Return -1 if not found
  }
  
  // Update average
  function onEdit2(e) {
    var sheet = e.range.getSheet();
    var editedRow = e.range.getColumn();
    var sheetname = sheet.getName();
    if(editedRow > 6 && editedRow%3 == 0 && sheetname != 'SMS' && sheetname != '성적처리' && sheetname != '매뉴얼') calculate(sheetname, editedRow);
  }