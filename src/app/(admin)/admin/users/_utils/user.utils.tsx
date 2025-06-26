export const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;

    if (password.length >= 8) {
        score += 1;
    }
    if (password.length >= 12) {
        score += 1;
    }
    if (/[a-z]/.test(password)) {
        score += 1;
    }
    if (/[A-Z]/.test(password)) {
        score += 1;
    }
    if (/\d/.test(password)) {
        score += 1;
    }
    if (/[@$!%*?&]/.test(password)) {
        score += 1;
    }
    if (password.length >= 16) {
        score += 1;
    }

    if (score <= 2) {
        return { score, label: "Débil", color: "bg-red-500" };
    }
    if (score <= 4) {
        return { score, label: "Media", color: "bg-yellow-500" };
    }
    if (score <= 6) {
        return { score, label: "Fuerte", color: "bg-green-500" };
    }
    return { score, label: "Muy Fuerte", color: "bg-emerald-500" };
};

// Password generator
export const generateSecurePassword = (length = 16): string => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@$!%*?&";

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = "";

    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i = i + 1) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
};
