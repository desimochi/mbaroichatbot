// utils/otpUtils.js
export async function sendOTP(mobile, message) {
    const username = "MBAROI"; // Your username
    const password = "bhanvi@3120"; // Your password
    const sender = "MBAROI"; // Your sender ID
    const pid = "1701160629650079148";
    const tempid = "1707162091462883866";
  
    const url = `http://tulipinfo.info/sendsms?uname=${encodeURIComponent(username)}&pwd=${encodeURIComponent(password)}&senderid=${encodeURIComponent(sender)}&to=${mobile}&msg=${encodeURIComponent(message)}&route=T&peid=${pid}&tempid=${tempid}`;
  
    try {
      const response = await fetch(url);
      const result = await response.text(); 
      console.log(result)// Get the raw response from the SMS service
      if (response.ok) {
        return { success: true, message: result };
      } else {
        return { success: false, message: result };
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { success: false, message: "Error sending OTP." };
    }
  }
  