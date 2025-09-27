// src/hooks/useCaptcha.js
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export const useCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const captchaRef = useRef();

  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
    setIsCaptchaVerified(!!token);
    if (token) {
      toast.success("CAPTCHA verified!");
    }
  };

  const handleCaptchaError = () => {
    setCaptchaToken(null);
    setIsCaptchaVerified(false);
    toast.error("CAPTCHA verification failed. Please try again.");
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setIsCaptchaVerified(false);
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
  };

  return {
    captchaToken,
    isCaptchaVerified,
    captchaRef,
    handleCaptchaVerify,
    handleCaptchaError,
    resetCaptcha
  };
};