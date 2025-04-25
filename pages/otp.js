
import { useState } from "react";

const OTPForm = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (data.success) {
        alert("OTP sent successfully!");
        setOtpSent(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error sending OTP", err);
      alert("Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error verifying OTP", err);
      alert("Error verifying OTP");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">OTP Verification</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:ring focus:ring-orange-300"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={otpSent}
        />
      </div>

      <button
        className="w-full bg-red-700 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-red-600"
        onClick={handleSendOtp}
        disabled={otpSent}
      >
        {otpSent ? "OTP Sent" : "Send OTP"}
      </button>

      {otpSent && !otpVerified && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-orange-300"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="w-full bg-green-700 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-green-600"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
        </div>
      )}

      {otpVerified && (
        <div className="mt-6 text-green-700">
          <h2 className="text-lg font-semibold">OTP Verified Successfully!</h2>
        </div>
      )}
    </div>
  );
};

export default OTPForm;
