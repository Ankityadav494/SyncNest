const nodemailer = require('nodemailer');

const sendOtpEmail = async (to, otp) => {
  try {
    // ✅ Transporter (fixed for Render IPv6 issue)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // 🔥 forces IPv4 (fixes ENETUNREACH error)
    });

    // ✅ Optional: verify connection (helps debugging)
    await transporter.verify();
    console.log("✅ SMTP server is ready");

    // ✅ Mail content
    const mailOptions = {
      from: `"SRMHive" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your SRMHive Verification Code",
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;
          background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;color:#f1f5f9;">
          
          <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:40px;">🐝</div>
            <h1 style="margin:12px 0 4px;font-size:22px;color:#e2e8f0;">
              SRMHive Verification
            </h1>
            <p style="margin:0;color:#94a3b8;font-size:14px;">
              Use this code to complete your registration
            </p>
          </div>

          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;
            padding:28px;text-align:center;margin:24px 0;">
            <span style="font-size:40px;font-weight:700;letter-spacing:14px;
              color:#ffffff;font-family:monospace;">
              ${otp}
            </span>
          </div>

          <p style="text-align:center;color:#f87171;font-size:13px;margin:16px 0 0;">
            Expires in <strong>5 minutes</strong>. Do not share this code.
          </p>

          <p style="text-align:center;color:#64748b;font-size:12px;margin:24px 0 0;">
            If you did not sign up for SRMHive, ignore this email.
          </p>
        </div>
      `,
    };

    // ✅ Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ OTP email sent:", info.messageId);
    return info;

  } catch (error) {
    // 🔥 FULL error logging (important for debugging)
    console.error("❌ EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendOtpEmail;