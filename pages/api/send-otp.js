// pages/api/send-otp.js
import { withSession } from "@/lib/withSession";
import { sendOTP } from "@/utils/otpUtils";
import allowCors from "@/lib/cors";
async function handler(req, res) {
  if (req.method === "POST") {
    const { mobile } = req.body;

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number.",
      });
    }

    try {
      // Generate a random OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const message = `Hello Welcome to MBAROI - Your OTP is ${otp} valid for the next 30 mins. Do not share the OTP with anyone. Team MBAROI`
      // Send OTP via SMS service
      const sendResult = await sendOTP(mobile, message);

      if (!sendResult.success) {
        return res.status(500).json({
          success: false,
          message: sendResult.message,
        });
      }
    console.log(sendResult)
      // Store OTP in session
      await req.session.set("otp", {
        mobile,
        otp,
        createdAt: Date.now()
      });

      // Save the session
      await req.session.save();

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
      });
    } catch (error) {
      console.error("Error during OTP process:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Only POST requests are accepted.",
    });
  }
}

// Wrap the handler with the session middleware
export default allowCors(withSession(handler));
