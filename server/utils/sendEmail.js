const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (to, otp) => {
  try {
    const response = await resend.emails.send({
      from: "noreply@srmhive.online",
      to,
      subject: "Your SRMHive Verification Code",
      html: `
        <div style="font-family:Arial; text-align:center;">
          <h2>Your OTP is:</h2>
          <h1>${otp}</h1>
          <p>Expires in 5 minutes</p>
        </div>
      `
    });

    console.log("✅ Email sent:", response);
    return response;

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendOtpEmail;