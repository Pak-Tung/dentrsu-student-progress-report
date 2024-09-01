export const formatDateFormISO = (date) => {
    if (!date) return null;
    return date.split('T')[0];  // or use any other preferred date formatting logic
  };

  export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return year===1899?"-":`${day}/${month}/${year}`;
  };