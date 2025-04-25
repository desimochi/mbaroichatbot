// pages/api/verify-otp.js
import { withSession } from "@/lib/withSession";
import allowCors from "@/lib/cors"; // CORS handler

async function handler(req, res) {
  if (req.method === "POST") {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required.",
      });
    }

    const sessionOtp = await req.session.get("otp");
    if (!sessionOtp || sessionOtp.mobile !== mobile) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired.",
      });
    }

    const timeDifference = Date.now() - sessionOtp.createdAt;
    if (timeDifference > 30 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (sessionOtp.otp.toString() === otp.toString()) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed. Only POST requests are accepted.",
    });
  }
}

export default allowCors(withSession(handler)); // Wrap the handler with session and CORS middleware
