import './TrespasserAccidentsArea.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import TrespasserAccidentItem from './TrespasserAccidentItem/TrespasserAccidentItem';
import ProgressLoader from '../../../component/common-components/ProgressLoader/ProgressLoader';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh';

export default function TrespasserAccidentsArea({ trespasserId }) {
    const [accidents, setAccidents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);
    const abortControllerRef = useRef(null);

    const fetchAccidents = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            setIsLoading(true);
            
            const url = `/api/reports/trespasser/${trespasserId}/documents`;
            console.log('Fetching URL:', url);
            
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    signal: abortController.signal
                });

                let data = null;
                try {
                    data = await response.json();
                } catch (e) {
                    console.error('Error parsing response:', e);
                    data = null;
                }

                console.log('Response status:', response.status);
                console.log('Response data:', data);

                return { status: response.status, data: data };
            });

            if (!isMounted.current) return;

            if (result.status === 200 && result.data) {
                console.log('Accidents count:', result.data.length);
                console.log('First accident:', result.data[0]);
                setAccidents(result.data);
            } else if (result.status === 403) {
                window.location.href = '/forbidden';
            } else if (result.status === 404) {
                window.location.href = '/not-found';
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            }
            console.error('Error fetching accidents:', error);
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
            if (abortControllerRef.current === abortController) {
                abortControllerRef.current = null;
            }
        }
    }, [trespasserId]);

    useEffect(() => {
        isMounted.current = true;
        fetchAccidents();
        
        return () => {
            isMounted.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [fetchAccidents]);

    if (isLoading) {
        return <ProgressLoader message="Загрузка нарушений..." />;
    }

    if (accidents.length === 0) {
        return (
            <div className="trespasser-accidents-area-empty">
                <p>Нет документированных нарушений</p>
            </div>
        );
    }

    return (
        <div className="trespasser-accidents-list">
            {accidents.map((accident) => (
                <TrespasserAccidentItem
                    key={accident.accidentReportId}
                    areaName={accident.areaName}
                    uploadDateTime={accident.uploadDateTime}
                    potentialAccidentId={accident.potentialAccidentId}
                />
            ))}
        </div>
    );
}