import { useEffect } from 'react';
import './InitPage.css';
import { extractRoleFromToken } from '../../script/extractRoleTokenUtil.js'; // Правильный путь к файлу с утилитой

export default function InitPage() {
    useEffect(() => {
        const redirectBasedOnRole = () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                
                console.log('AccessToken exists:', !!accessToken);
                console.log('RefreshToken exists:', !!refreshToken);
                
                if (!accessToken && !refreshToken) {
                    console.log('No tokens found, redirecting to login');
                    window.location.href = '/login';
                    return;
                }
                
                let token = accessToken;
                let usedTokenType = 'access';
                
                if (!token && refreshToken) {
                    token = refreshToken;
                    usedTokenType = 'refresh';
                }
                
                if (!token) {
                    console.log('No valid token found, redirecting to login');
                    window.location.href = '/login';
                    return;
                }
                
                console.log(`Using ${usedTokenType} token for role extraction`);
                
                const role = extractRoleFromToken(token);
                
                console.log(`Role extracted from ${usedTokenType} token:`, role);
                
                switch(role) {
                    case 'SAFETY_OFFICER':
                        console.log('Redirecting to /notifications');
                        window.location.href = '/notifications';
                        break;
                    case 'ADMIN':
                        console.log('Redirecting to /admin-home-page');
                        window.location.href = '/admin-home-page';
                        break;
                    default:
                        console.log('Redirecting to /others-home-page');
                        window.location.href = '/others-home-page';
                        break;
                }
                
            } catch (error) {
                console.error('Error extracting role from token:', error);
                window.location.href = '/login';
            }
        };
        
        redirectBasedOnRole();
    }, []);
    
    return (
        <>
        </>
    );
}