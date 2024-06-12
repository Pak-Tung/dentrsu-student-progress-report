import React, { useEffect } from "react";
import { getJwtToken } from "../features/apiCalls";

const EmailVerificationButton = ({handleLoginSuccess}) => {
  useEffect(() => {
    // Load the script for the phone/email sign-in button
    const script = document.createElement("script");
    script.src = "https://www.phone.email/verify_email_v1.js";
    script.async = true;
    document.body.appendChild(script);

    // Define the listener function
    window.phoneEmailReceiver = async (userObj) => {
      //console.log("I am in phoneEmailReceiver");
      const { user_json_url, user_email_id } = userObj;

      //console.log(user_json_url);

      // You can submit your form here or redirect user to post login dashboard page
      // Send user_json_url to your backend to retrieve user info (i.e. country code and phone number) from this URL.
      try {
        const response = await getJwtToken({user_json_url, user_email_id});
        //console.log("response", response);
        // Save the token to local storage for future use
        const token = response.data.token;
        const email = response.data.user_email_id;
        //console.log("token", token);
        //console.log("email", email);
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        handleLoginSuccess();
      } catch (error) {
        console.error(error);
      }
    };

    // Cleanup script and listener on component unmount
    return () => {
      document.body.removeChild(script);
      delete window.phoneEmailReceiver;
    };
  }, []);

  return (
    <div className="pe_verify_email" data-client-id="15681933261308996779">
      <script src="https://www.phone.email/verify_email_v1.js" async></script>
    </div>
  );
};

export default EmailVerificationButton;
