import apiClient from './mainApi';
import Cookies from 'js-cookie';

export const sendOTP = async (userEmail, userOTP) => {
  try {
    const response = await apiClient.post('/api/students/send-otp', {
      userEmail: userEmail,
      userOTP: userOTP,
    });

    if (response.status === 200) {
      //console.log('Response from server:', response.data);
      const token = response.data.token;
      if (token) {
        Cookies.set("token", token, { expires: 1 }); // Token stored in cookies for 1 day
        //console.log("Login successful, token stored in cookies.");
      }
      return response.data;
    } else {
      return response.statusText;
    }
  } catch (error) {
    return error;
  }
};

