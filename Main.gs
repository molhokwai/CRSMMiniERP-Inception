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
    * Full columns:: CLIENT    SITE    POST CODE    DATE    START TIME    END TIME    HOURS    EMPLOYEE    CONTACT    SIA    EXPIRY    STATUS
   * Form columns:: CLIENT    SITE    DATE    START TIME    END TIME    EMPLOYEE    STATUS
  */

  const clientObj = getClient(e.namedValues["CLIENT"]);
  const CLIENT = clientObj["CLIENT"];

  const siteObj = getSite(e.namedValues["SITE"]);
  const SITE = siteObj["SITE"];
  const POST_CODE = siteObj["POST_CODE"];
 
  const DATE = new Date(e.namedValues["DATE"]);
 
  let [startTime, START_TIME]= getTimeValues(e.namedValues["START_TIME"]);
  let [endTime, END_TIME] = getTimeValues(e.namedValues["END_TIME"]);
  
  console.log(startTime, START_TIME);
  console.log(endTime, END_TIME);

  const HOURS = ((endTime - startTime)/(3600*1000)).toFixed(2);
  console.log(HOURS);

  const employeeObj = getEmployee(e.namedValues["EMPLOYEE"]);
  const EMPLOYEE = employeeObj["EMPLOYEE"];
  const CONTACT = employeeObj["CONTACT"];
  const SIA = employeeObj["SIA"];
  const EXPIRY = employeeObj["EXPIRY"];
 
  const STATUS = e.namedValues["STATUS"];
  
  // Get the spreadsheet and the "Shifts" sheet
  const sheetId = '1cCnA38rnvxScbrLQmL4WIVV3bRxy_9epfFQ_r2i5wvc', sheetName = 'Shifts';
  let sheet = getSheetByName(sheetId, sheetName);
 
  // Create a new row with the extracted data
  const newRow = [CLIENT,    SITE,    POST_CODE,    DATE,    START_TIME,    END_TIME,    HOURS,    EMPLOYEE,    CONTACT,    SIA,    EXPIRY,    STATUS];
  sheet.appendRow(newRow);
}

let eObj = {
  'namedValues': {
    "CLIENT": "Supreme Guarding Ltd    45 London Road, SS1 1PL",
    "SITE": "45 London Road, SS1 1PL",
    "DATE": "7/16/2024",
    "START_TIME": "2:15:00 PM",
    "END_TIME": "8:10:00 PM",
    "EMPLOYEE": "Abdul Rafay",
    "STATUS": "Confirmed",
  }
};
onAddShiftFormSubmit(eObj);

