function getSheetByName(spreadsheetId, sheetName) {
  // Open the spreadsheet by its ID
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  
  // Get the sheet object by its name
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  // Check if the sheet exists
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in spreadsheet with ID "${spreadsheetId}"`);
  }
  
  // Return the sheet object
  return sheet;
}

function goToSheet(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.activate();
}
function goToShifts() {
  goToSheet("Shifts");
}


function getActiveSheetData() {
  /* USAGE
   * -----    
   * let headers = null, data = null;
   * headers, data = getActiveSheetData();
  */
  var dataRange = SpreadsheetApp.getActiveSheet().getDataRange();
  var data = dataRange.getValues();
  var headers = data.pop();
  return headers, data;
}


function getClient(clientName){
  return {    
    "CLIENT": clientName,
  }
}
function getSite(siteName){
  return {
    "SITE": siteName,
    "POST_CODE": null,    
  }
}
function getEmployee(employeeName){
  return {
    "EMPLOYEE": employeeName,
    "CONTACT": null,    
    "SIA": null,    
    "EXPIRY": null,    
  }
}
