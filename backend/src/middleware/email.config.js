import nodemailer from "nodemailer";

// Read SMTP configuration from environment variables
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || null; // e.g. 'gmail'
const EMAIL_HOST = process.env.EMAIL_HOST || null; // e.g. 'smtp.gmail.com' or 'smtp.sendgrid.net'
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10) || 587;
const EMAIL_SECURE = (process.env.EMAIL_SECURE === 'true') || false; // true for 465
const EMAIL_USER = process.env.EMAIL_USER || process.env.EMAIL_FROM || null;
// Accept either EMAIL_PASS or EMAIL_APP_PASSWORD (your .env uses EMAIL_APP_PASSWORD)
const EMAIL_PASS = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD || process.env.SENDGRID_API_KEY || null;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER || 'no-reply@codeshare.local';

// Nodemailer connection options with timeouts to fail fast in production
const transporterOptions = {
  host: EMAIL_HOST || (EMAIL_SERVICE === 'gmail' ? 'smtp.gmail.com' : undefined),
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: EMAIL_USER && EMAIL_PASS ? { user: EMAIL_USER, pass: EMAIL_PASS } : undefined,
  tls: { rejectUnauthorized: false },
  // timeouts (ms)
  connectionTimeout: parseInt(process.env.EMAIL_CONNECTION_TIMEOUT || '10000', 10),
  greetingTimeout: parseInt(process.env.EMAIL_GREETING_TIMEOUT || '5000', 10),
  socketTimeout: parseInt(process.env.EMAIL_SOCKET_TIMEOUT || '10000', 10),
};

// If a SendGrid API key is provided in SENDGRID_API_KEY and no host is set, use SendGrid SMTP relay
if (!transporterOptions.host && process.env.SENDGRID_API_KEY) {
  transporterOptions.host = 'smtp.sendgrid.net';
  transporterOptions.port = 587;
  transporterOptions.auth = { user: 'apikey', pass: process.env.SENDGRID_API_KEY };
}

export const transporter = nodemailer.createTransport(transporterOptions);

// Helpful startup check (only logs; do not crash the app in production)
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email transporter verified');
  } catch (error) {
    console.error('❌ Email server connection failed:', error && error.message ? error.message : error);
    // Give specific guidance for common cases
    if (process.env.SENDGRID_API_KEY) {
      console.error('� Using SendGrid SMTP relay. Ensure SENDGRID_API_KEY is valid and SendGrid account is active.');
    } else if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
      console.error('💡 SMTP configured via EMAIL_HOST. Check credentials and that your host allows connections from this environment.');
    } else {
      console.error('💡 No SMTP credentials detected. Set EMAIL_HOST/EMAIL_USER/EMAIL_PASS or SENDGRID_API_KEY in your environment.');
    }
    console.error('🔍 Original error:', error);
  }
};

// Only run verification in development by default; in production it will log but not crash
if (process.env.NODE_ENV !== 'production') {
  testConnection();
} else {
  // In production, run a non-blocking verify that only logs
  testConnection().catch(() => { });
}

const buildEmailHtml = (verificationCode) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">CodeShare</h1>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
      <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for signing up with CodeShare! Please use the following OTP code to verify your email address:</p>
      <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">${verificationCode}</span>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.</p>
      <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;"><p style="color: #999; font-size: 12px;">© 2025 CodeShare. All rights reserved.</p></div>
    </div>
  </div>
`;

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    if (!transporterOptions.auth) {
      throw new Error('Email transporter is not configured. Set EMAIL_USER and EMAIL_PASS or SENDGRID_API_KEY');
    }

    const info = await transporter.sendMail({
      from: `"CodeShare" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Your CodeShare OTP - Verify Your Email',
      text: `Your OTP verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
      html: buildEmailHtml(verificationCode),
    });
    return info;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error && error.message ? error.message : error);
    // Map common errors to friendlier messages
    if (error && error.code === 'ETIMEDOUT') {
      throw new Error('Email sending failed: Connection timeout. Your hosting provider may block outbound SMTP. Consider using a transactional email API (SendGrid, Mailgun).');
    }
    if (error && (error.code === 'EAUTH' || error.responseCode === 535)) {
      throw new Error('Authentication failed. Check EMAIL_USER / EMAIL_PASS or use a provider-specific API key (e.g. SENDGRID_API_KEY).');
    }
    throw new Error(`Email sending failed: ${error && error.message ? error.message : String(error)}`);
  }
};