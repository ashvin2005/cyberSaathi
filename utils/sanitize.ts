export function sanitizeInput(text: string): string {
    // Regex patterns
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const creditCardRegex = /\b(?:\d[ -]*?){13,16}\b/g;
    const otpRegex = /\b\d{4,8}\b/g;

    let sanitized = text;

    sanitized = sanitized.replace(emailRegex, "[EMAIL]");

    sanitized = sanitized.replace(phoneRegex, "[PHONE]");


    sanitized = sanitized.replace(creditCardRegex, "[CARD]");


    sanitized = sanitized.replace(otpRegex, (match) => {
        return "[OTP]";
    });

    return sanitized;
}
