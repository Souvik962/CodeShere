// backend/middleware/captcha.middleware.js
import axios from 'axios';

export const verifyCaptcha = async (req, res, next) => {
  try {
    const { captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({ message: "CAPTCHA verification required" });
    }

    // For Google reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const verificationResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
          remoteip: req.ip
        }
      }
    );

    const { success, score, action } = verificationResponse.data;

    if (!success || (score && score < 0.5)) {
      return res.status(400).json({ 
        message: "CAPTCHA verification failed. Please try again." 
      });
    }

    // For reCAPTCHA v3, optionally verify the action matches
    if (action && req.body.expectedAction && action !== req.body.expectedAction) {
      return res.status(400).json({ 
        message: "Invalid CAPTCHA action" 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "CAPTCHA verification error" });
  }
};

// Alternative: hCaptcha verification
export const verifyHCaptcha = async (req, res, next) => {
  try {
    const { captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({ message: "CAPTCHA verification required" });
    }

    const secretKey = process.env.HCAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const verificationResponse = await axios.post(
      'https://hcaptcha.com/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
          remoteip: req.ip
        }
      }
    );

    const { success } = verificationResponse.data;

    if (!success) {
      return res.status(400).json({ 
        message: "CAPTCHA verification failed. Please try again." 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "CAPTCHA verification error" });
  }
};