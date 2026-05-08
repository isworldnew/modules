import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js';
import AccidentItem from '../../NotificationsPage/AccidentItem/AccidentItem.jsx';
import ProgressLoader from '../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import './AccidentArea.css';

export default function AccidentArea({ dateFrom, dateTo, searchTrigger }) {
    const [accidents, setAccidents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);

    // Функция для преобразования даты из ДД/ММ/ГГГГ в ISO формат для API
    const convertToISODate = (dateString) => {
        if (!dateString) return null;
        
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        
        return `${year}-${month}-${day}T00:00:00.000Z`;
    };

    // Функция для запроса списка инцидентов
    const fetchAccidents = async () => {
        setIsLoading(true);
        
        try {
            let url = '/api/accidents/shortcuts?status=processed';
            
            // Добавляем фильтрацию по датам, если обе даты заполнены
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

            // Обработка успешного ответа (статус 200)
            if (result.status === 200 && result.data) {
                setAccidents(result.data);
            }
            // Обработка 403 (Forbidden)
            else if (result.status === 403) {
                window.location.href = '/forbidden';
            }
            // Обработка 404 (Not Found)
            else if (result.status === 404) {
                window.location.href = '/not-found';
            }
        } catch (error) {
            console.error('Error fetching accidents:', error);
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    // При загрузке страницы делаем запрос
    useEffect(() => {
        isMounted.current = true;
        fetchAccidents();
        
        return () => {
            isMounted.current = false;
        };
    }, []);

    // При клике на кнопку (изменении searchTrigger) делаем запрос
    useEffect(() => {
        if (searchTrigger > 0) {
            fetchAccidents();
        }
    }, [searchTrigger]);

    // Отображение ProgressLoader во время загрузки
    if (isLoading) {
        return <ProgressLoader message="Загрузка инцидентов..." />;
    }

    // Отображение, если нет инцидентов
    if (accidents.length === 0) {
        return (
            <div className="accident-area-empty">
                <p>Нет инцидентов</p>
            </div>
        );
    }

    // Отображение списка инцидентов (без лишней обёртки)
    return (
        <div className="accidents-list">
            {accidents.map((accident) => (
                <AccidentItem
                    key={accident.id}
                    id={accident.id}
                    areaName={accident.areaName}
                    uploadDateTime={accident.uploadDateTime}
                    status={accident.status}
                />
            ))}
        </div>
    );
}