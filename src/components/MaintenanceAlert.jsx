import React, { useEffect } from 'react';

const MaintenanceAlert = () => {
  useEffect(() => {
    const checkMaintenanceTime = () => {
      const now = new Date();
      const bangkokTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
      const hours = bangkokTime.getHours();

      if (hours >= 0 && hours < 8) {
        return 'Server maintenance between 0 A.M. to 8 A.M.';
      }else{
        return "An error occurred while communicating with the server. Please try again later.";
      }
       
    };

    checkMaintenanceTime();
  }, []);

  //return null; // This component doesn't render anything visible
};

export default MaintenanceAlert;
