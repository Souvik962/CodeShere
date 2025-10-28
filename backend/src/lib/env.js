// Environment variable validation
import dotenv from 'dotenv';

dotenv.config();

// Accept alternative env var names and provide small defaults so the validator
// doesn't warn when a reasonable default or equivalent name is present.
// Map EMAIL_APP_PASSWORD (used in .env) to EMAIL_PASS expected by the code.
if (process.env.EMAIL_APP_PASSWORD && !process.env.EMAIL_PASS) {
    process.env.EMAIL_PASS = process.env.EMAIL_APP_PASSWORD;
}

// Provide a sensible default for CLIENT_URL so local dev doesn't trigger a warning.
if (!process.env.CLIENT_URL) {
    process.env.CLIENT_URL = 'http://localhost:5173';
}

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT'
];

const optionalEnvVars = [
    'CLIENT_URL',
    'NODE_ENV',
    'RECAPTCHA_SECRET_KEY',
    'HCAPTCHA_SECRET_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    //'EMAIL_HOST',
    //'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS'
];

export const validateEnvironment = () => {
    const missingVars = [];
    const warnings = [];

    // Check required environment variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    // Check optional environment variables and warn if missing
    optionalEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    });

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease set these environment variables in your .env file');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('⚠️  Missing optional environment variables:');
        warnings.forEach(varName => {
            console.warn(`   - ${varName}`);
        });
        console.warn('Some features may not work properly without these variables\n');
    }

    console.log('✅ Environment variables validated successfully');
};

export const getEnvConfig = () => {
    return {
        // Database
        mongodbUri: process.env.MONGODB_URI,

        // JWT
        jwtSecret: process.env.JWT_SECRET,

        // Server
        port: process.env.PORT || 5001,
        nodeEnv: process.env.NODE_ENV || 'development',

        // Client
        clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

        // CAPTCHA
        recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
        hcaptchaSecretKey: process.env.HCAPTCHA_SECRET_KEY,

        // Cloudinary
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET,
        },

        // Email
        email: {
           // host: process.env.EMAIL_HOST,
           // port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    };
};
