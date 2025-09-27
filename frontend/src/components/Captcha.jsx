// src/components/Captcha.jsx
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useThemeStore } from '../store/useThemeStore';

// Google reCAPTCHA Component
export const GoogleCaptcha = forwardRef(({ onVerify, onError }, ref) => {
  const { theme } = useThemeStore();
  const captchaRef = useRef();

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (captchaRef.current) {
        captchaRef.current.reset();
      }
    },
    execute: () => {
      if (captchaRef.current) {
        captchaRef.current.execute();
      }
    }
  }));

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        ref={captchaRef}
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        onChange={onVerify}
        onErrored={onError}
        theme={theme}
        size="normal" // Can be 'compact', 'normal', or 'invisible'
      />
    </div>
  );
});

GoogleCaptcha.displayName = 'GoogleCaptcha';

// hCaptcha Component (Alternative option)
export const HCaptchaComponent = forwardRef(({ onVerify, onError }, ref) => {
  const { theme } = useThemeStore();
  const captchaRef = useRef();

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
    },
    execute: () => {
      if (captchaRef.current) {
        captchaRef.current.execute();
      }
    }
  }));

  return (
    <div className="flex justify-center my-4">
      <HCaptcha
        ref={captchaRef}
        sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
        onVerify={onVerify}
        onError={onError}
        theme={theme}
        size="normal"
      />
    </div>
  );
});

HCaptchaComponent.displayName = 'HCaptchaComponent';