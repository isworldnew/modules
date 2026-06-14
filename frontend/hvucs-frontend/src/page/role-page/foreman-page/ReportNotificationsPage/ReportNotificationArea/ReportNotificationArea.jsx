import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import ReportItem from '../ReportItem/ReportItem.jsx';
import './ReportNotificationArea.css';

export default function ReportNotificationArea() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef(null);
    const isMounted = useRef(true);

    const fetchNotifications = async () => {
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch('/api/reports/shortcuts?status=unprocessed_by_foreman', {
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
            console.error('Error fetching report notifications:', error);
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
            <div className="report-notification-area-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка уведомлений...</p>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="report-notification-area-empty">
                <p>Нет новых уведомлений</p>
            </div>
        );
    }

    return (
        <div className="report-notification-area">
            <div className="reports-list">
                {notifications.map((notification) => (
                    <ReportItem
                        key={notification.accidentReportId || notification.potentialAccidentId}
                        potentialAccidentId={notification.potentialAccidentId}
                        accidentReportId={notification.accidentReportId}
                        areaName={notification.areaName}
                        uploadDateTime={notification.uploadDateTime}
                        status={notification.reportStatus}
                    />
                ))}
            </div>
        </div>
    );
}