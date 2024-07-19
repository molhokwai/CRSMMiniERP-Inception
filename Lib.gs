function convertTimeToDecimal(timeString = "00:00") {
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Calculate the decimal representation of hours
  return hours + minutes / 60;
}

function getTimeValues(timeString) {
  Logger.log(timeString);
  const meridian = timeString.substring(timeString.length-3, timeString.length).replace(' ', '');  

  timeString = timeString.substring(0, timeString.length-3);
  timeValues = timeString.split(':').map(Number);
  
  if(meridian == 'PM'){
    timeValues[0] += 12;
  }
  timeString = timeValues.map(String).join(':');

  let date = new Date(`2024-07-16 ${timeString}`);
  let timeStringFormatted = 
      `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  return [date, timeStringFormatted];
}

// Helper function to validate time format
function isValidTimeString(timeString = "00:00") {
  /**
   *   // Check if input is valid time string
   *   if (!isValidTimeString(begin) || !isValidTimeString(end)) {
   *    throw new Error('Invalid time format. Please use HH:MM:SS (optional PM/AM) format.');
   *   }
   * 
   *   // Validate meridian indicators (optional)
   *   if (["AM", "PM"].indexOf(beginMeridian)<0 || ["AM", "PM"].indexOf(endMeridian)<0 ) {
   *     throw new Error('Wrong meridian indicator(s). Must be AM/PM format.');
   *   }
   * 
   * ***/
  const regex = /^([0-9]|1[0-9]|2[0-3])(:[0-5][0-9])(:[0-5][0-9])?( [AP]M)?$/i;
  return regex.test(timeString);
}

function subtractTimes(begin = "00:00", end = "00:00") {

  // 1. extract
  // 2. set PM if so
  // 3. mod 12 
  // 4. if PM: add 12
  // 5. substract
  // 6. set sign, and and Math.abs
  // 7. get timestring and timefloat
  // 8. assign sign
  // 9. end

  // Extract time components with optional seconds and meridian indicator
  let [beginHours, beginMinutes, beginSeconds = 0, beginMeridian = ""] = begin.split(/[ :\.]+/).map(part => parseInt(part, 10)); // Parse as integers
  let [endHours, endMinutes, endSeconds = 0, endMeridian = ""] = end.split(/[ :\.]+/).map(part => parseInt(part, 10));
  console.log([beginHours, beginMinutes, beginSeconds = 0, beginMeridian = ""]);
  console.log([endHours, endMinutes, endSeconds = 0, endMeridian = ""]);


  // Handle meridian indicators (convert to 12-hour format based on individual indicator)
  const isBeginPM = beginMeridian.toUpperCase() === "PM";
  const isEndPM = endMeridian.toUpperCase() === "PM";

  beginHours = (beginHours % 12) + (isBeginPM ? 12 : 0);
  endHours = (endHours % 12) + (isEndPM ? 12 : 0);

  // Calculate the difference in hours considering meridian indicators
  let hourDifference = endHours - beginHours;
  let sign = +1;
  if(hourDifference<0){
    sign = -1;
  }
  hourDifference = Math.abs(hourDifference);

  // Calculate the difference in minutes
  let totalMinutes = hourDifference * 60 + (endMinutes - beginMinutes) + (endSeconds - beginSeconds);

  // Handle negative time differences (end time before begin time)
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; // Add a day in minutes (1440 minutes)
  }

  // Calculate hours and remaining minutes
  const timeHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Format the time string (HH:MM or HH:MM:SS)
  let timeString = `${timeHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  if (beginSeconds > 0 || endSeconds > 0) {
    timeString += `:${beginSeconds.toString().padStart(2, '0')}`;
  }

  // Calculate the time as a decimal representing hours
  const timeFloat = (timeHours + remainingMinutes / 60).toFixed(2);

  // Return the results
  return [timeString, timeFloat];
}

function getHours(endTime, startTime) {
  return ((endTime - startTime)/(3600*1000)).toFixed(2);

}


let employees = []; // Global array to store Employee objects

class Employee {
  constructor(name, contact, siaNumber, expiry) {
    this.name = name;
    this.contact = contact;
    this.siaNumber = siaNumber;
    this.expiry = expiry;
  }

  static getEmployeeByName(name) {
    return employees.find(employee => employee.name === name);
  }
}


function convertDecimalHoursToTime(decimalHours) {
  if (decimalHours < 0 || decimalHours > 1) {
    return "Invalid";
  }

  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  return Utilities.formatString('%02d:%02d', hours, minutes);
}
function convertDateToTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return Utilities.formatString('%02d:%02d', hours, minutes);
}

/*** TESTS
// Valid Cases
console.log(1, subtractTimes('08:00', '09:00'));
console.log(2, subtractTimes('13:30:00', '11:00:00'));
console.log(3, subtractTimes('05:00 PM', '02:00 AM'));
console.log(4, subtractTimes('02:00 AM', '05:00 PM'));
console.log(5, subtractTimes('5:00 PM', '02:00 AM'));
console.log(6, subtractTimes('02:1 AM', '05:1 PM'));
console.log(7, subtractTimes('02:1', '05:1'));
console.log(8, subtractTimes('10:00', '10:00'));
console.log(9, subtractTimes('01:00', '12:59'));
console.log(10, subtractTimes('23:59', '00:01'));
console.log(11, subtractTimes('09:00:00', '08:59:59'));
console.log(12, subtractTimes('01:00:30', '12:30:00'));
console.log(13, subtractTimes('10:30', '09:30:00'));

// Error Cases (wrapped in try-catch blocks)
try { subtractTimes('hello', 'world'); } catch(error) { console.error(error); }
try { subtractTimes('10:00:aa', '09:00'); } catch(error) { console.error(error); }
try { subtractTimes('24:00', '10:00'); } catch(error) { console.error(error); }
try { subtractTimes('10:60', '09:00'); } catch(error) { console.error(error); }
try { subtractTimes('10:00', '30:00'); } catch(error) { console.error(error); }
try { subtractTimes('', '09:00'); } catch(error) { console.error(error); }
try { subtractTimes('09:00', ''); } catch(error) { console.error(error); }
try { subtractTimes(null, '09:00'); } catch(error) { console.error(error); }
try { subtractTimes('09:00', null); } catch(error) { console.error(error); }
try { subtractTimes(); } catch(error) { console.error(error); } // Empty call
 ***/
