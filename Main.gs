
/**
 * Global configuration. Adjust for sheets...
 */
const globalConfiguration = {
  "Global": {
    "Timezone": "GMT",
  },
  "ClientsRosters": {
    "clientColumnIndex": 0,
    "clientSiteColumnIndex": 1,
    "headerRowIndex": 5,
    "datesColumnsStartIndex": 2,
    "datesFormat": "ddd, dd MMM yyyy",
  },
  "Forms": {
    "receivedDateFormat": "MM/dd/yyyy",
  },
};


/**
 * Handles form submission for adding a new shift.
 *
 * @param {FormApp.Event} e The form submit event object.
 * @throws {Error}  If any data extraction or retrieval fails.
 */
function onAddShiftFormSubmit(e) {
  /*
    *  Test OnFormSubmit
    *  ----------------
    *  OnFormSubmit event attributes
    * 
    *  // Start at row 1, skipping headers in row 0
    *  for (var row=1; row < data.length; row++) {
    *    var e = {};
    *    e.values = data[row].filter(Boolean);  // filter: https://stackoverflow.com/a/19888749
    *    e.range = dataRange.offset(row,0,1,data[0].length);
    *    e.namedValues = {};
    *    // Loop through headers to create namedValues object
    *    // NOTE: all namedValues are arrays.
    *    for (var col=0; col<headers.length; col++) {
          e.namedValues[headers[col]] = [data[row][col]];
    *  }
    *  
    * Full columns:: CLIENT  SITE  POST CODE  DATE  START TIME  END TIME  HOURS  EMPLOYEE  CONTACT  SIA  EXPIRY  STATUS
   * Form columns:: CLIENT  SITE  DATE  START TIME  END TIME  EMPLOYEE  STATUS
  */
  const clientObj = getClient(e.namedValues["CLIENT"][0]);
  const CLIENT = clientObj["CLIENT"];
  Logger.log(111111111);

  const siteObj = getSite(e.namedValues["SITE"][0]);
  const SITE = siteObj["SITE"];
  const POST_CODE = siteObj["POST_CODE"];
  Logger.log(22222222);
 
  const DATE = new Date(e.namedValues["DATE"][0]);
 
  Logger.log(e.namedValues);
  let [startTime, START_TIME]= getTimeValues(e.namedValues["START TIME"][0]);
  let [endTime, END_TIME] = getTimeValues(e.namedValues["END TIME"][0]);
 
  const HOURS = getHours(endTime - startTime);
  Logger.log(333333333);

  const employeeObj = getEmployee(e.namedValues["EMPLOYEE"][0]);
  const EMPLOYEE = employeeObj["EMPLOYEE"];
  const CONTACT = employeeObj["CONTACT"];
  const SIA = employeeObj["SIA"];
  const EXPIRY = employeeObj["EXPIRY"];
  Logger.log(44444444);
 
  const STATUS = e.namedValues["STATUS"][0];
  
  // Get the spreadsheet and the "Shifts" sheet
  const sheetId = '1cCnA38rnvxScbrLQmL4WIVV3bRxy_9epfFQ_r2i5wvc', sheetName = 'Shifts';
  let sheet = getSheetByName(sheetId, sheetName);
  Logger.log(55555555);

  // Create a new row with the extracted data
  const newRow = [new Date(), CLIENT,  SITE,  POST_CODE,  DATE,  START_TIME,  END_TIME,  HOURS,  EMPLOYEE,  CONTACT,  SIA,  EXPIRY,  STATUS];
  console.log("newRow: ", newRow);
  sheet.appendRow(newRow);

  const shiftData = {
    "CLIENT": CLIENT,
    "CLIENT SITE": SITE,
    "POST CODE": POST_CODE,
    "DATE": DATE,
    "START TIME": START_TIME,
    "END TIME": END_TIME,
    "HOURS": HOURS,
    "EMPLOYEE": EMPLOYEE,
    "CONTACT": CONTACT,
    "SIA": SIA,
    "EXPIRY": EXPIRY,
    "STATUS": STATUS,
  };
  updateClientRostersData(shiftData);
}

let eObj = {
  'namedValues': {
    "CLIENT": ["Supreme Guarding Ltd  45 London Road, SS1 1PL"],
    "SITE": ["45 London Road, SS1 1PL"],
    "DATE": ["7/16/2024"],
    "START TIME": ["3:15:00 PM"],
    "END TIME": ["8:10:00 PM"],
    "EMPLOYEE": ["Abdul Rafay"],
    "STATUS": ["Confirmed"],
  }
};

// ** TEST **//
if(false){
  onAddShiftFormSubmit(eObj);
}

if(false){
  // TESTS
  console.log(Utilities.parseDate("07/06/2023", "GMT", "MM/dd/yyyy"))
  console.log(Utilities.parseDate("12/23/2023", "GMT", "MM/dd/yyyy"))
  console.log(Utilities.parseDate("7/06/2023", "GMT", "MM/dd/yyyy"))
  console.log(Utilities.parseDate("07/6/2023", "GMT", "MM/dd/yyyy"))
  console.log(Utilities.parseDate("7/6/2023", "GMT", "MM/dd/yyyy"))
  console.log(Utilities.parseDate("23/12/2023", "GMT", "MM/dd/yyyy"))
}



/**
 * Function OnShiftsChange
 *
 * This function is triggered when any cell in a designated "Shifts" range is edited.
 * It handles the changes made to the shifts data and updates the spreadsheet accordingly.
 *
 * @param {Event} e The event object containing information about the change.
 *     * `oldValue`: The previous value of the cell before modification (available only for single-cell edits).
 *     * `range`: A Range object representing the modified cell or range of cells.
 *     * `source`: A Spreadsheet object representing the Google Sheets file associated with the script.
 *     * `triggerUid`: The ID of the trigger that generated this event (installable triggers only).
 *     * `value`: The new cell value after modification (available only for single-cell edits).
 *
 * @additionalInfo
 *     * English: [https://developers.google.com/apps-script/guides/triggers/events?hl=en#change](https://developers.google.com/apps-script/guides/triggers/events?hl=en#change)
 *     * French: [https://developers.google.com/apps-script/guides/triggers/events?hl=fr#change](https://developers.google.com/apps-script/guides/triggers/events?hl=fr#change)
 */
function onShiftsChange(e) {
  Logger.log("------- onShiftsChange -------------");

  if(e.range){
    Logger.log(`------- onShiftsChange - isShiftsRange(e.range) :: ${isShiftsRange(e.range)}  -------------`);
    if (isShiftsRange(e.range)) {
      const shiftData = getModifiedShiftData(e, updateShiftData);
      updateClientRostersData(shiftData);
    }
  }
}


