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
                        window.location.href = '/safety-officer-user-page';
                        break;
                    case 'FOREMAN':
                        window.location.href = '/foreman-user-page';
                        break;
                    case 'SUPERVISOR':
                        window.location.href = '/supervisor-user-page';
                        break;
                    case 'ADMIN':
                        window.location.href = '/admin-user-page';
                        break;
                    case 'SUPERADMIN':
                        window.location.href = '/superadmin-user-page';
                        break;                       
                    default:
                        window.location.href = '/others-user-page';
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