const nodemailer = require('nodemailer');

const sendOtpEmail = async (to, otp) => {
  // Transporter created here so it always reads .env values at call time
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'SRMHive <' + process.env.EMAIL_USER + '>',
    to: to,
    subject: 'Your SRMHive Login OTP',
    html:
      "<div style='font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;color:#f1f5f9;'>" +
      "<div style='text-align:center;margin-bottom:24px;'>" +
      "<div style='font-size:40px;'>&#128029;</div>" +
      "<h1 style='margin:12px 0 4px;font-size:22px;color:#e2e8f0;'>SRMHive Login Code</h1>" +
      "<p style='margin:0;color:#94a3b8;font-size:14px;'>Use the code below to sign in to your account</p>" +
      "</div>" +
      "<div style='background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;padding:28px;text-align:center;margin:24px 0;'>" +
      "<span style='font-size:40px;font-weight:700;letter-spacing:14px;color:#ffffff;font-family:monospace;'>" + otp + "</span>" +
      "</div>" +
      "<p style='text-align:center;color:#f87171;font-size:13px;margin:16px 0 0;'>This code expires in <strong>5 minutes</strong>.</p>" +
      "<p style='text-align:center;color:#64748b;font-size:12px;margin:24px 0 0;'>If you did not request this, you can safely ignore this email.</p>" +
      "</div>",
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('OTP email sent to ' + to + ' | ID: ' + info.messageId);
  return info;
};

module.exports = sendOtpEmail;
