
/**
 * Determines if the given range is within the "Shifts" sheet and its specified boundaries.
 *
 * @param {Range} range The range to check.
 * @returns {boolean} True if the range is within the "Shifts" sheet and its boundaries (A7:I), false otherwise.
 * 
 * !!! UNTESTED !!!
 */
function isShiftsRange(range) {
  const sheetName = range.getSheet().getName();
  const startRow = range.getRow();
  const startColumn = range.getColumn();
  const endColumn = range.getLastColumn();

  return sheetName === "Shifts" && startRow >= 6 && [2, 3, 5 ,6, 7, 8 ,9, 12, 13].indexOf(startColumn)>= 0;
}

/**
 * Extracts the modified shift data from the provided event object.
 *
 * @param {Object} e The event object containing information about the change.
 * @returns {Object} An object representing the modified shift data, or null if no shift data was found.
 * 
 * !!! UNTESTED !!!
 */
function getModifiedShiftData(e, updateShiftData) {
  /***********************
   *  All columns: CLIENT,CLIENT SITE,POST CODE,DATE,START TIME,END TIME,HOURS,
   *               EMPLOYEE,  CONTACT,SIA,EXPIRY,STATUS
   * Change columns: CLIENT,CLIENT SITE,DATE,START TIME,END TIME,HOURS,EMPLOYEE,EXPIRY,
   *                 STATUS
   * Change columns letters: A, B, D, E, F, H, K, L
   * 
   * From ["Google Sheets events"]
   *          (https://developers.google.com/apps-script/guides/triggers/events?hl=en#change triggerUid)
   * 
   * 
   *      Event Object
   *      ------------  
   *      e.triggerUid :String
   *          - ID of trigger that produced this event (installable triggers only).
   *      e.changeType :String
   *          - The type of change (EDIT, INSERT_ROW, INSERT_COLUMN, REMOVE_ROW,
   *                                REMOVE_COLUMN, INSERT_GRID, REMOVE_GRID, 
   *                                FORMAT, or OTHER).
   *      e.triggerUid
   *          - ID of trigger that produced this event (installable triggers only).
   *      e.oldValue :[cellType]
   *          - !Unique cell change
   *            !Will be undefined if the cell had no previous content.
   *            Cell value prior to the edit, if any. Only available if the edited
   *            range is a single cell. 
   *      e.range :Range
   *          ! Edited range 
   *          - A Range object, representing the cell or range of cells that were 
   *            edited.
   *            ["Class Range"](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=fr)
   *      e.source :Spreadsheet  
   *          - A Spreadsheet object, representing the Google Sheets file to which the 
   *            script is bound.
   *      e.value :[cellType]
   *          - !Unique cell change
   *          - New cell value after the edit. Only available if the edited range is a 
   *            single cell.
   * 
   ***********************/
  const changeDataColumnsIndices =   [1,        2,            4,      5,          6,          8,        11,       12];
  const changeDataColumnsLetters =   ["A",      "B",          "D",    "E",        "F",        "H",      "K",      "L"];
  const changeDataColumnsNames =     ["CLIENT","CLIENT SITE","DATE","START TIME","END TIME","EMPLOYEE","EXPIRY","STATUS"];

  /*******
  // Create an empty shift data object to be filled 
  // with changed columns if any
  let shiftData = {};
  *******/
  let sheet = e.range.getSheet();
  let modifiedRow = sheet.getRange(e.range.rowStart,1,1,13);
  let modifiedValues = modifiedRow.getValues()[0];
 
  let modifiedData = {};
  for(i in changeDataColumnsIndices){
    const ind = changeDataColumnsIndices[i];
    modifiedData[changeDataColumnsNames[parseInt(i)]] = modifiedValues[ind];
  }
  Logger.log(`------- getModifiedShiftData - JSON.stringify(modifiedData) :: ${JSON.stringify(modifiedData)}  -------------`);

  updateShiftData(e, sheet, modifiedData);

  return modifiedData;
}
function updateShiftData(e, sheet, modifiedData){
  // Hours
  const hourCell = sheet.getRange(e.range.rowStart,8);
  const hourValue = getHours(modifiedData["END TIME"], modifiedData["START TIME"]);
  hourCell.setValue(hourValue);
}


function convertTimeValue(value){
  if(typeof(value) == typeof("")){
    return value;
  } else {
    return convertDateToTime(value);
  }     
}

/**
 * Updates the Client Roster sheet based on the provided shift data.
 *
 * @param {Object} shiftData The shift data to be added or updated.
 */
function updateClientRostersData(shiftData) {
  console.log(`----- updateClientRostersData ------`);

  // Assuming the ClientRoster sheet is named "ClientRoster" and has the specified column structure
  const sheetName = "ClientsRosters";
  const clientRosterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  // Find the row for the specified client and site
  const clientSiteRowIndex = findClientSiteRowIndex(sheetName, clientRosterSheet,
                              shiftData["CLIENT"], shiftData["CLIENT SITE"]);
  console.log(`updateClientRostersData - clientSiteRowIndex :: ${clientSiteRowIndex}`);
  console.log(shiftData["DATE"]);

  
  // Calculate the column index for the shift date
  // !Warning :: "23/12/2023" parsed with "MM/dd/yyyy" will not crash 
  //  but rather modulo 12 to the next year giving Nov 12 2024 
  const dateColumnIndex = getShiftDateColumnIndex(sheetName, clientRosterSheet, shiftData["DATE"]);
  console.log(`updateClientRostersData - dateColumnIndex :: ${dateColumnIndex}`);

  // Update the cell with the shift data
  const cell = clientRosterSheet.getRange(clientSiteRowIndex, dateColumnIndex);
  let startTime = convertTimeValue(shiftData["START TIME"]);
  let endTime = convertTimeValue(shiftData["END TIME"]);

  cell.setValue(`${shiftData["EMPLOYEE"]}\n${startTime} - ${endTime}`);
}

/**
 * Finds the row index of the specified client and site in the given sheet.
 *
 * @param {string} sheetName The name of the sheet to search in.
 * @param {GoogleAppsScript.SpreadsheetApp.Sheet} sheet The sheet to search in.
 * @param {string} client The client name to search for.
 * @param {string} site The site name to search for.
 * @returns {number} The row index of the found client and site, or -1 if not found.
 * 
 */
function findClientSiteRowIndex(sheetName, sheet, client, site) {
  console.log(`----- findClientSiteRowIndex ------`);

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  const clientCIndex = globalConfiguration.ClientsRosters.clientColumnIndex;
  const siteCIndex = globalConfiguration.ClientsRosters.clientSiteColumnIndex;

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    console.log(`findClientSiteRowIndex - row ::  ${row}`);
    if(row[0]){
      console.log(`findClientSiteRowIndex - row[clientCIndex] ::  ${row[clientCIndex]}`);
      console.log(`findClientSiteRowIndex - client ::  ${client}`);
      console.log(row[clientCIndex]==client);

      console.log(`findClientSiteRowIndex - row[siteCIndex] ::  ${row[siteCIndex]}`);
      console.log(`findClientSiteRowIndex - site ::  ${site}`);
      console.log(row[siteCIndex]==site);
    }
    
    if (row[clientCIndex] === client && row[siteCIndex] === site) {
      return i + 1; // Adjust for header row
    }
  }

  return -1; // Not found
}

/**
 * Finds the column index of the specified shift date in the given sheet's header row.
 *
 * @param {GoogleAppsScript.SpreadsheetApp.Sheet} sheet The sheet to search in.
 * @param {Date} shiftDate The shift date to find.
 * @returns {number} The column index of the shift date, or -1 if not found.
 * 
 */
function getShiftDateColumnIndex(sheetName, sheet, shiftDate) {
  console.log(`----- getShiftDateColumnIndex ------`);
  console.log(`----- getShiftDateColumnIndex:shiftDate :: ${shiftDate.toDateString()} ------`);

  const headerRIndex = globalConfiguration.ClientsRosters.headerRowIndex;
  const datesCStartIndex = globalConfiguration.ClientsRosters.datesColumnsStartIndex;

  const headerRow = sheet.getRange(headerRIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  console.log(`getShiftDateColumnIndex - headerRow ::  ${headerRow}`);
  const toDateString = (date) => Utilities.formatDate(date, Session.getScriptTimeZone(), 
                                            globalConfiguration.ClientsRosters.datesFormat);

  for (let i = datesCStartIndex; i < headerRow.length; i++) {
    console.log(`getShiftDateColumnIndex - headerRow[i] ::  ${headerRow[i]}`);
    console.log(`getShiftDateColumnIndex - shiftDate ::  ${shiftDate}`);
    if (toDateString(headerRow[i]) == toDateString(shiftDate)) {
      return i + 1; // Adjust for 1-based indexing
    }
  }

  return -1; // Not found
}

