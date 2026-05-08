/**
 * Скрипт для выполнения запросов с автоматическим обновлением JWT токенов
 * @param {Function} apiCall - функция, которая принимает accessToken и возвращает Promise с объектом { status, data }
 * @returns {Promise<{ status: number, data: any }>} - результат выполнения запроса
 */
export async function executeWithTokenRefresh(apiCall) {
    const getAccessToken = () => localStorage.getItem('accessToken');
    const getRefreshToken = () => localStorage.getItem('refreshToken');
    
    const saveTokens = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };
    
    const clearTokensAndRedirectToLogin = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    };
    
    const redirectToForbidden = () => {
        window.location.href = '/forbidden';
    };
    
    const refreshTokens = async () => {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
            clearTokensAndRedirectToLogin();
            throw new Error('No refresh token available');
        }
        
        try {
            const refreshResponse = await fetch('/api/authentication/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (refreshResponse.status === 403) {
                clearTokensAndRedirectToLogin();
                throw new Error('Refresh token expired');
            }
            
            if (refreshResponse.status === 201) {
                const tokenData = await refreshResponse.json();
                
                if (tokenData.accessToken && tokenData.refreshToken) {
                    saveTokens(tokenData.accessToken, tokenData.refreshToken);
                    return tokenData.accessToken;
                } else {
                    clearTokensAndRedirectToLogin();
                    throw new Error('Invalid token response');
                }
            }
            
            clearTokensAndRedirectToLogin();
            throw new Error(`Token refresh failed with status ${refreshResponse.status}`);
            
        } catch (error) {
            console.error('Token refresh error:', error);
            clearTokensAndRedirectToLogin();
            throw error;
        }
    };
    
    const isTokenExpiredError = (response) => {
        return response.status === 403 && 
               response.data && 
               response.data.exceptionMessage === 'Token has been expired';
    };
    
    let currentAccessToken = getAccessToken();
    
    if (!currentAccessToken) {
        clearTokensAndRedirectToLogin();
        throw new Error('No access token available');
    }
    
    try {
        let response = await apiCall(currentAccessToken);
        
        if (isTokenExpiredError(response)) {
            try {
                const newAccessToken = await refreshTokens();
                
                response = await apiCall(newAccessToken);
                
                if (isTokenExpiredError(response)) {
                    clearTokensAndRedirectToLogin();
                    throw new Error('Token expired after refresh');
                }
                
                if (response.status === 403) {
                    redirectToForbidden();
                    throw new Error('Forbidden access');
                }
                
                return response;
                
            } catch (refreshError) {
                throw refreshError;
            }
        }
        
        if (response.status === 403) {
            redirectToForbidden();
            throw new Error('Forbidden access');
        }
        
        return response;
        
    } catch (error) {
        throw error;
    }
}