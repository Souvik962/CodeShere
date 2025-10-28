import 'dotenv/config';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';

// Validate environment variables. In production we require explicit credentials.
if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Missing EMAIL_USER or EMAIL_APP_PASSWORD in .env file');
    throw new Error('Email configuration is incomplete');
  } else {
    console.warn('⚠️ EMAIL_USER or EMAIL_APP_PASSWORD not set — will attempt an ethereal test account in development');
  }
}

// Create transporter with Gmail credentials from .env
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'souvikmondal.7688@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD || 'vxuh zbjw rdyd eazmb',
  },
});

const sendOtpEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Code Share" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: "Verify Your Email - Code Share",
      text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 20px;">
          <div style="background: white; border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 25px; border-radius: 12px;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">🔐 Code Share</h1>
              </div>
            </div>

            <!-- Main Content -->
            <div style="text-align: center;">
              <h2 style="color: #333; margin: 0 0 10px 0; font-size: 28px;">Email Verification</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Enter this verification code to complete your registration:
              </p>

              <!-- OTP Display -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 30px; margin: 30px 0;">
                <div style="background: white; border-radius: 10px; padding: 20px; display: inline-block;">
                  <span style="font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #667eea; font-family: 'Courier New', monospace;">
                    ${otp}
                  </span>
                </div>
              </div>

              <!-- Timer Warning -->
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  ⏱️ <strong>Important:</strong> This code will expire in <strong>10 minutes</strong>
                </p>
              </div>

              <!-- Security Notice -->
              <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-top: 30px; text-align: left;">
                <h3 style="color: #333; font-size: 16px; margin: 0 0 10px 0;">🛡️ Security Tips:</h3>
                <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Never share this code with anyone</li>
                  <li>Code Share will never ask for your verification code</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                Having trouble? Check your spam folder or contact support
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Code Share. All rights reserved.
              </p>
            </div>
          </div>

          <!-- Outer Footer -->
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: white; font-size: 12px; opacity: 0.8;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ OTP Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};


const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);

    // If we're in development, try to fall back to an Ethereal test account
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.warn('⚠️ Creating an Ethereal test account for local development...');
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        // try verifying again with the ethereal account
        await transporter.verify();
        console.log('✅ Email server connection verified using Ethereal test account');
        console.log('ℹ️ Ethereal test credentials:', { user: testAccount.user });
        return true;
      } catch (ethErr) {
        console.error('❌ Ethereal fallback failed:', ethErr.message);
        return false;
      }
    }

    return false;
  }
};

// Export default service object for ESM import compatibility
const emailService = {
  sendOtpEmail,
  verifyConnection,
};

export default emailService;

// Self-test when file is run directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  (async () => {
    console.log("🧪 Testing email configuration...\n");

    const isConnected = await verifyConnection();

    if (isConnected) {
      console.log("\n📧 Sending test OTP email...\n");

      try {
        const testOtp = "123456";
        const result = await sendOtpEmail("test@example.com", testOtp);

        console.log("\n✅ Test completed successfully!");
        console.log("Result:", result);
      } catch (error) {
        console.error("\n❌ Test failed:", error.message);
      }
    }
  })();
}