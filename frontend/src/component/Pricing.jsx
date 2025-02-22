import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import config from "../api/config";
import "./Pricing.css"; 

const Pricing = () => {
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setNotification({ show: true, message: "⚠️ Please log in to upgrade!", type: "warning" });
          return;
        }

        const response = await axios.get(`${config.apiUrl}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handlePayment = async () => {
    if (!userDetails) {
      setNotification({ show: true, message: "⚠️ You need to log in first!", type: "warning" });
      return;
    }

    try {
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
      console.error("🚨 Payment initiation failed:", error);
    }
  };

  const initiatePayment = async () => {
    try {
      const { data } = await axios.post(`${config.apiUrl}/payment/create-order`);
      const options = {
        key: "rzp_test_yZJ5sPINm3YEdJ",
        amount: data.amount,
        currency: data.currency,
        name: "AI Hire Me",
        description: "Upgrade to Premium",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verify = await axios.post(`${config.apiUrl}/payment/verify-payment`, {
              ...response,
              userId: userDetails.id,
            });

            if (verify.data.success) {
              setNotification({ show: true, message: "✅ Payment Successful! 🎉 You're now Premium.", type: "success" });
              window.location.reload();
            } else {
              setNotification({ show: true, message: "❌ Payment Verification Failed!", type: "error" });
            }
          } catch (error) {
            console.error("🚨 Verification Error:", error);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: "9999999999",
        },
        theme: { color: "#000000" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("🚨 Error creating Razorpay order:", error);
    }
  };

  return (
    
    <div className="pricing-container">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <h1 className="pricing-title">🚀 Unlock Premium for Just ₹40!</h1>
      <p className="pricing-description">
        Get unlimited access to AI-powered interview tools, resume enhancements, and exclusive job insights. <br />
        <strong>One-time payment, lifetime access!</strong>
      </p>

      {userDetails?.subscription === "paid" ? (
        <p className="premium-badge">✅ You are already a Premium User!</p>
      ) : (
        <button onClick={handlePayment} className="black-button">Join Premium Now</button>
      )}

      {!userDetails && <p className="login-reminder">⚠️ Log in to upgrade!</p>}
    </div>
  );
};

export default Pricing;
