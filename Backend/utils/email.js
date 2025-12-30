import nodemailer from 'nodemailer';


const getTransporter = () => {

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(' Email configuration is missing. OTP emails will not be sent.');
    console.warn(`EMAIL_USER: ${process.env.EMAIL_USER ? 'Set' : 'Missing'}`);
    console.warn(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Set' : 'Missing'}`);
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};


export const sendOTPEmail = async (email, otp) => {
  const transporter = getTransporter();
  
  if (!transporter) {
    throw new Error('Email configuration is missing');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Your OTP Code</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

