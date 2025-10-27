// Input validation middleware
export const validateSignup = (req, res, next) => {
    const { fullName, email, password } = req.body;
    const errors = [];

    // Validate fullName
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please provide a valid email address');
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    // Check for strong password (optional)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (password && password.length >= 6 && !strongPasswordRegex.test(password)) {
        // Just a warning, not an error
        console.log('Password could be stronger - consider using uppercase, lowercase, and numbers');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please provide a valid email address');
    }

    // Validate password
    if (!password || password.length < 1) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validatePost = (req, res, next) => {
    const { projectName, programmingLanguage, projectCode, privacy } = req.body;
    const errors = [];

    // Validate projectName
    if (!projectName || typeof projectName !== 'string' || projectName.trim().length < 1) {
        errors.push('Project name is required');
    }

    // Validate programmingLanguage
    if (!programmingLanguage || typeof programmingLanguage !== 'string' || programmingLanguage.trim().length < 1) {
        errors.push('Programming language is required');
    }

    // Validate projectCode
    if (!projectCode || typeof projectCode !== 'string' || projectCode.trim().length < 1) {
        errors.push('Project code is required');
    }

    // Validate privacy
    const validPrivacyOptions = ['public', 'private'];
    if (!privacy || !validPrivacyOptions.includes(privacy)) {
        errors.push('Privacy must be either "public" or "private"');
    }

    // Additional validations
    if (projectName && projectName.length > 100) {
        errors.push('Project name must be less than 100 characters');
    }

    if (projectCode && projectCode.length > 10000) {
        errors.push('Project code must be less than 10,000 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateComment = (req, res, next) => {
    const { text } = req.body;
    const errors = [];

    // Validate comment text
    if (!text || typeof text !== 'string' || text.trim().length < 1) {
        errors.push('Comment text is required');
    }

    if (text && text.length > 500) {
        errors.push('Comment must be less than 500 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const sanitizeInput = (req, res, next) => {
    // Basic input sanitization
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str.trim().replace(/[<>]/g, '');
    };

    // Sanitize string fields
    if (req.body.fullName) {
        req.body.fullName = sanitizeString(req.body.fullName);
    }
    if (req.body.projectName) {
        req.body.projectName = sanitizeString(req.body.projectName);
    }
    if (req.body.programmingLanguage) {
        req.body.programmingLanguage = sanitizeString(req.body.programmingLanguage);
    }
    if (req.body.text) {
        req.body.text = sanitizeString(req.body.text);
    }

    next();
};
