import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "agentsa127@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD || "eclb szbn upnt xzvb",
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test the connection when the module loads
const testConnection = async () => {
  try {
    await transporter.verify();
  } catch (error) {
    console.error("❌ Email server connection failed:", error.message);
    if (error.message.includes("Username and Password not accepted")) {
      console.error("🔑 Please ensure you're using a Gmail App Password, not your regular password");
      console.error("📋 Steps to create App Password:");
      console.error("1. Enable 2-Factor Authentication on your Gmail account");
      console.error("2. Go to Google Account > Security > 2-Step Verification > App passwords");
      console.error("3. Generate a new App Password for 'Mail'");
      console.error("4. Use that 16-character password in your .env file");
    }
  }
};

// Test connection on startup (only in development)
if (process.env.NODE_ENV !== "production") {
  testConnection();
}

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const info = await transporter.sendMail({
      from: '"CodeShare" <agentsa127@gmail.com>',
      to: email,
      subject: "Your CodeShare OTP - Verify Your Email",
      text: `Your OTP verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">CodeShare</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for signing up with CodeShare! Please use the following OTP code to verify your email address:
            </p>
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">
                ${verificationCode}
              </span>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.
            </p>
            <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px;">
                © 2025 CodeShare. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });
    return info;
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      throw new Error(`Authentication failed. Please check your Gmail App Password. Error: ${error.message}`);
    } else if (error.code === 'ENOTFOUND') {
      throw new Error(`Network error. Please check your internet connection. Error: ${error.message}`);
    } else if (error.responseCode === 535) {
      throw new Error(`Gmail authentication failed. Please ensure you're using an App Password, not your regular Gmail password.`);
    } else {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
};