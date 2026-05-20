import './OperatedArea.css';
import { useState, useEffect } from 'react';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';

export default function OperatedArea() {
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchAreas = async () => {
            setIsLoading(true);
            try {
                const result = await executeWithTokenRefresh(async (accessToken) => {
                    const response = await fetch('/api/areas', {
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

                if (result.status === 200 && result.data) {
                    setAreas(result.data);
                } else if (result.status === 403) {
                    window.location.href = '/forbidden';
                } else {
                    setError('Не удалось загрузить зоны');
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
                setError('Не удалось подключиться к серверу');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAreas();
    }, []);

    if (isLoading) {
        return <ProgressLoader message="Загрузка зон..." />;
    }

    if (error) {
        return (
            <div className="operated-area-error">
                <p>{error}</p>
            </div>
        );
    }

    if (areas.length === 0) {
        return (
            <div className="operated-area-empty">
                <p>Зона ответственности пока не назначена</p>
            </div>
        );
    }

    const areaNames = areas.map(area => area.name).join(', ');

    return (
        <div className="operated-area">
            <div className="operated-area-card">
                <div className="operated-area-label">Зоны ответственности:</div>
                <div className="operated-area-names">{areaNames}</div>
            </div>

            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}