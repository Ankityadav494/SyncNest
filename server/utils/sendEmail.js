const nodemailer = require('nodemailer');

const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Crucial for cloud deployments (Render, Railway, etc.)
    connectionTimeout: 10000,  // 10s to establish connection
    greetingTimeout: 10000,    // 10s to receive SMTP greeting
    socketTimeout: 15000,      // 15s of socket inactivity allowed
    tls: {
      rejectUnauthorized: false, // avoid TLS cert issues on cloud
    },
  });

  const mailOptions = {
    from: `"SRMHive" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Your SRMHive Verification Code',
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;
        background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;color:#f1f5f9;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:40px;">🐝</div>
          <h1 style="margin:12px 0 4px;font-size:22px;color:#e2e8f0;">SRMHive Verification</h1>
          <p style="margin:0;color:#94a3b8;font-size:14px;">
            Use this code to complete your registration
          </p>
        </div>
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;
          padding:28px;text-align:center;margin:24px 0;">
          <span style="font-size:40px;font-weight:700;letter-spacing:14px;
            color:#ffffff;font-family:monospace;">${otp}</span>
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

  const info = await transporter.sendMail(mailOptions);
  console.log(`OTP email sent to ${to} | ID: ${info.messageId}`);
  return info;
};

module.exports = sendOtpEmail;
