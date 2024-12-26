export function generateSecureRandomId(length = 16) {
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((b) => b.toString(36).padStart(2, 0))
        .join('')
        .substr(0, length);
}