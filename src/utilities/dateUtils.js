export const formatDateFormISO = (date) => {
    if (!date) return null;
    return date.split('T')[0];  // or use any other preferred date formatting logic
  };