import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from "axios";
import config from '../api/config';
import Notification from '../components/Notification';
const SideMenuTire = () => {
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Auth Token:', token); 
      if (!token) {
        console.log('No token found'); 
        setIsAuthenticated(false);
        return;
      }

      const response = await axios.get(`${config.apiUrl}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserDetails(response.data);

    } catch (error) {
      console.error('Error fetching user details:', error); 
    }
  };
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserDetails();
  }, [token]);  

  const handlePayment = async () => {
    try {
      // ✅ Load Razorpay script dynamically if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = initiatePayment;
        document.body.appendChild(script);
      } else {
        initiatePayment(); 
      }
    } catch (error) {
      console.error("🚨 Error initiating payment:", error);
      setNotification({
        show: true,
        message: '⚠️ Payment initialization failed. Please try again.',
        type: 'error',
      });
    }
  };
  
  const initiatePayment = async () => {
    try {
      // ✅ Get Razorpay order details from the backend
      const { data } = await axios.post(`${config.apiUrl}/payment/create-order`);
  
      const options = {
        key: "rzp_test_yZJ5sPINm3YEdJ", // ✅ Replace with actual Razorpay Key ID
        amount: data.amount,
        currency: data.currency,
        name: "AI Hire Me",
        description: "Upgrade to Premium",
        order_id: data.id,
        handler: async (response) => {
          console.log("✔️ Razorpay Payment Response:", response);
  
          try {
            // ✅ Verify the payment in the backend
            const verify = await axios.post(`${config.apiUrl}/payment/verify-payment`, {
              ...response,
              userId: userDetails.id, 
            });
                    
            if (verify.data.success) {
              setNotification({
                show: true,
                message: '✅ Payment Successful! 🎉 You are now a Premium User.',
                type: 'success',
              });
              window.location.reload(); 
            } else {
              setNotification({
                show: true,
                message: '❌ Payment Verification Failed! Please try again.',
                type: 'error',
              });
            }
          } catch (error) {
            console.error("🚨 Verification Error:", error);
            setNotification({
              show: true,
              message: '❌ Payment Verification Failed! Please try again.',
              type: 'error',
          });
          }
        },
        prefill: {
          name: userDetails.name , 
          email: userDetails.email,
          contact: `9999999999`,
        },
        theme: { color: "#ff4d4d" },
      };
  
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("🚨 Error creating Razorpay order:", error);
      setNotification({
        show: true,
        message: '⚠️ Failed to initiate payment. Please try again.',
        type: 'error',
      });
    }
  };
  
  return (
    <div className='side-menu-tire-container'>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h2>🚀 Time to Upgrade!</h2>
      <p>You've reached the limit of your current tier.</p>
      <p>Upgrade your account permanently for just <strong>₹40</strong></p>
      <button onClick={handlePayment} className='side-menu-tire-container-buttonx'>Upgrade</button>
    </div>
  )
}

export default SideMenuTire
