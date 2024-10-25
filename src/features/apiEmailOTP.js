import axios from 'axios';
import { api } from "./mainApi";
const host = api();

const url = host;//'http://localhost:3001'; //'; // Your backend endpoint

export const sendOTP = async (userEmail, userOTP) => {
  try {
    const response = await axios.post(`${url}/api/students/send-otp`, {
      userEmail: userEmail,
      userOTP: userOTP,
    });

    if (response.status === 200) {
      //console.log('Response from server:', response.data);
      return response.data;
    } else {
      //console.error('Error:', response.status, response.statusText);
      return response.statusText;
    }
  } catch (error) {
    //console.error('Error:', error);
    return error;
  }
};
