/**
 * Утилита для извлечения роли из JWT токена (access или refresh)
 * @param {string} token - JWT токен
 * @returns {string} - значение поля role из payload токена
 * @throws {Error} - если токен невалидный или не содержит поле role
 */
export function extractRoleFromToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Token is required and must be a string');
    }
    
    try {
        const parts = token.split('.');
        
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token format');
        }
        
        const payloadBase64 = parts[1];
        
        let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        
        while (base64.length % 4) {
            base64 += '=';
        }
        
        const payloadString = atob(base64);
        
        const payload = JSON.parse(payloadString);
        
        if (!payload.role) {
            throw new Error('Role not found in token payload');
        }
        
        return payload.role;
        
    } catch (error) {
        console.error('Error extracting role from token:', error);
        throw new Error(`Failed to extract role: ${error.message}`);
    }
}

export function extractRoleFromTokenUnicode(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Token is required and must be a string');
    }
    
    try {
        const parts = token.split('.');
        
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token format');
        }
        
        const payloadBase64 = parts[1];
        let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        
        while (base64.length % 4) {
            base64 += '=';
        }
        
        const payloadString = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        const payload = JSON.parse(payloadString);
        
        if (!payload.role) {
            throw new Error('Role not found in token payload');
        }
        
        return payload.role;
        
    } catch (error) {
        console.error('Error extracting role from token:', error);
        throw new Error(`Failed to extract role: ${error.message}`);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { extractRoleFromToken, extractRoleFromTokenUnicode };
}