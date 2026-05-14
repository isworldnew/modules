import './ResponsesArea.css';
import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import ReportItem from '../../ReportNotificationsPage/ReportItem/ReportItem.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';

export default function ResponsesArea({ dateFrom, dateTo, searchTrigger }) {
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);

    const convertToISODate = (dateString) => {
        if (!dateString) return null;
        
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        
        return `${year}-${month}-${day}T00:00:00.000Z`;
    };

    const fetchResponses = async () => {
        setIsLoading(true);
        
        try {
            let url = '/api/reports/shortcuts?status=processed_by_foreman';
            
            if (dateFrom && dateTo) {
                const isoDateFrom = convertToISODate(dateFrom);
                const isoDateTo = convertToISODate(dateTo);
                
                if (isoDateFrom && isoDateTo) {
                    url += `&dateFrom=${encodeURIComponent(isoDateFrom)}&dateTo=${encodeURIComponent(isoDateTo)}`;
                }
            }
            
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(url, {
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
                setResponses(result.data);
            } else if (result.status === 403) {
                window.location.href = '/forbidden';
            } else if (result.status === 404) {
                window.location.href = '/not-found';
            }
        } catch (error) {
            console.error('Error fetching responses:', error);
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchResponses();
        
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (searchTrigger > 0) {
            fetchResponses();
        }
    }, [searchTrigger]);

    if (isLoading) {
        return <ProgressLoader message="Загрузка принятых мер..." />;
    }

    if (responses.length === 0) {
        return (
            <div className="responses-area-empty">
                <p>Нет принятых мер</p>
            </div>
        );
    }

    return (
        <div className="responses-list">
            {responses.map((response) => (
                <ReportItem
                    key={response.accidentReportId || response.potentialAccidentId}
                    potentialAccidentId={response.potentialAccidentId}
                    accidentReportId={response.accidentReportId}
                    areaName={response.areaName}
                    uploadDateTime={response.uploadDateTime}
                    status={response.reportStatus}
                />
            ))}
        </div>
    );
}