import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../../script/executeWithTokenRefresh.js';
import { extractRoleFromToken } from '../../../../script/extractRoleTokenUtil.js';
import './NotificationBadge.css';

export default function NotificationBadge() {
    const [unprocessedCount, setUnprocessedCount] = useState(null);
    const [role, setRole] = useState(null);
    const intervalRef = useRef(null);
    const isMounted = useRef(true);

    const getEndpointByRole = (userRole) => {
        switch (userRole) {
            case 'SAFETY_OFFICER':
                return '/api/accidents/unprocessed-amount';
            case 'FOREMAN':
                return '/api/reports/unprocessed-amount';
            case 'SUPERVISOR':
                return '/api/reports/event-shortcuts?documented=NON_DOCUMENTED';
            default:
                throw new Error(`Unknown role: ${userRole}`);
        }
    };

    const fetchUserRole = async () => {
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                return extractRoleFromToken(accessToken);
            });
            
            if (isMounted.current) {
                setRole(result);
                return result;
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            if (isMounted.current) {
                setRole(null);
            }
            return null;
        }
    };

    const fetchUnprocessedAmount = async (userRole) => {
        if (!userRole) return;
        
        try {
            const endpoint = getEndpointByRole(userRole);
            
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                return { status: response.status, data: data };
            });

            if (result.status === 200 && isMounted.current) {
                let count = 0;
                
                if (userRole === 'SUPERVISOR') {
                    count = Array.isArray(result.data) ? result.data.length : 0;
                } else {
                    count = typeof result.data === 'object' ? result.data.count : result.data;
                }
                
                setUnprocessedCount(count);
            }
        } catch (error) {
            console.error('Error fetching unprocessed amount:', error);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        
        const initialize = async () => {
            const userRole = await fetchUserRole();
            
            if (userRole) {
                await fetchUnprocessedAmount(userRole);

                intervalRef.current = setInterval(() => {
                    fetchUnprocessedAmount(userRole);
                }, 2000);
            }
        };

        initialize();

        return () => {
            isMounted.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); 

    if (unprocessedCount === null || unprocessedCount === 0 || role === null) {
        return null;
    }

    const badgeClassName = unprocessedCount >= 10 ? 'notification-badge wide' : 'notification-badge';

    return (
        <div className={badgeClassName}>
            {unprocessedCount > 99 ? '99+' : unprocessedCount}
        </div>
    );
}