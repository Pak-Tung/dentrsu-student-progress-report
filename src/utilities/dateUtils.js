export const formatDateFormISO = (date) => {
    if (!date) return null;
    const dateObj = convertToUTCPlus7(date);
    return dateObj;//date.split('T')[0];  // or use any other preferred date formatting logic
  };

  export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return year===1899?"-":`${day}/${month}/${year}`;
  };

  export const convertToUTCPlus7 = (timeString) => {
    // Parse the input time string as a Date object in UTC
    const date = new Date(timeString);
  
    // Get the time in milliseconds since the epoch
    const timeInMs = date.getTime();
  
    // Calculate the time difference for UTC+7 (7 hours ahead of UTC)
    const utcPlus7TimeInMs = timeInMs + 7 * 60 * 60 * 1000;
  
    // Create a new Date object for UTC+7 time
    const utcPlus7Date = new Date(utcPlus7TimeInMs);
  
    // Format the date components
    const year = utcPlus7Date.getUTCFullYear();
    const month = String(utcPlus7Date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(utcPlus7Date.getUTCDate()).padStart(2, '0');
  
    // Combine into the desired format
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }

