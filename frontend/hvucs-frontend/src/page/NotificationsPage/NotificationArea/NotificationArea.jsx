import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js';
import AccidentItem from '../AccidentItem/AccidentItem.jsx';
import './NotificationArea.css';

export default function NotificationArea() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef(null);
    const isMounted = useRef(true);

    const fetchNotifications = async () => {
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch('/api/accidents/shortcuts?status=unprocessed', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                let data = null;
                try {
                    data = await response.json();
                } catch (e) {
                    data = null;
                }

                return { status: response.status, data: data };
            });

            if (!isMounted.current) return;

            if (result.status === 200 && result.data) {
                setNotifications(result.data);
                setIsLoading(false);
            }
            else if (result.status === 403) {
                window.location.href = '/forbidden';
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        
        fetchNotifications();

        intervalRef.current = setInterval(() => {
            fetchNotifications();
        }, 2000);

        return () => {
            isMounted.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    if (isLoading) {
        return (
            <div className="notification-area-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка уведомлений...</p>
            </div>
        );
    }

    // Отображение, если нет уведомлений
    if (notifications.length === 0) {
        return (
            <div className="notification-area-empty">
                <p>Нет новых уведомлений</p>
            </div>
        );
    }

    // Отображение списка уведомлений
    return (
        <div className="notification-area">
            <div className="incidents-list">
                {notifications.map((notification) => (
                    <AccidentItem
                        key={notification.id}
                        id={notification.id}
                        areaName={notification.areaName}
                        uploadDateTime={notification.uploadDateTime}
                        status={notification.status}
                    />
                ))}
            </div>
        </div>
    );
}