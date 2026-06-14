import './EventsArea.css';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import EventItem from './EventItem/EventItem.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';

export default function EventsArea({ dateFrom, dateTo, searchTrigger, areaId }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const isMounted = useRef(true);
    const intervalRef = useRef(null);
    const location = useLocation();

    const isArchivePage = location.pathname === '/archive';
    const isEventsToDocumentPage = location.pathname === '/events-to-document';

    const getDocumentedStatus = () => {
        if (isArchivePage) return 'DOCUMENTED';
        if (isEventsToDocumentPage) return 'NON_DOCUMENTED';
        return null;
    };

    const convertToISODate = (dateString) => {
        if (!dateString) return null;
        
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        
        return `${year}-${month}-${day}T00:00:00.000Z`;
    };

    const fetchEvents = async () => {
        try {
            const documentedStatus = getDocumentedStatus();
            
            if (isEventsToDocumentPage) {
                const url = `/api/reports/event-shortcuts?documented=${documentedStatus}`;
                
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
                    setEvents(result.data);
                } else if (result.status === 403) {
                    window.location.href = '/forbidden';
                } else if (result.status === 404) {
                    window.location.href = '/not-found';
                }
                return;
            }
            
            if (isArchivePage) {
                setIsLoading(true);
                
                let url = `/api/reports/event-shortcuts?documented=${documentedStatus}`;
                
                if (areaId) {
                    url += `&areaId=${areaId}`;
                }
                
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
                    setEvents(result.data);
                } else if (result.status === 403) {
                    window.location.href = '/forbidden';
                } else if (result.status === 404) {
                    window.location.href = '/not-found';
                }
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (isEventsToDocumentPage) {
            fetchEvents();
            
            intervalRef.current = setInterval(() => {
                console.log('Polling events for /events-to-document...');
                fetchEvents();
            }, 3000);
            
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                isMounted.current = false;
            };
        }
    }, [isEventsToDocumentPage]);

    useEffect(() => {
        isMounted.current = true;
        
        if (isArchivePage) {
            fetchEvents();
        }
        
        return () => {
            isMounted.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (searchTrigger > 0 && isArchivePage) {
            fetchEvents();
        }
    }, [searchTrigger]);

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (isLoading && isArchivePage) {
        return <ProgressLoader message="Загрузка событий..." />;
    }

    if (events.length === 0) {
        return (
            <div className="events-area-empty">
                <p>Нет событий</p>
            </div>
        );
    }

    return (
        <>
            <div className="events-list">
                {events.map((event) => (
                    <EventItem
                        key={event.potentialAccidentId}
                        potentialAccidentId={event.potentialAccidentId}
                        areaName={event.areaName}
                        uploadDateTime={event.uploadDateTime}
                        documented={event.documented}
                    />
                ))}
            </div>
            
            <ModalWindow 
                message={modalMessage}
                isOpen={showModal}
                onClose={handleCloseModal}
            />
        </>
    );
}