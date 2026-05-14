import './ExistingCamerasArea.css';
import { useState, useEffect } from 'react';
import ExistingCameraItem from './ExistingCameraItem/ExistingCameraItem.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';

export default function ExistingCamerasArea() {
    const [cameras, setCameras] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchCameras = async () => {
            setIsLoading(true);
            try {
                const result = await executeWithTokenRefresh(async (accessToken) => {
                    const response = await fetch('/api/cameras', {
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
                    setCameras(result.data);
                } else if (result.status === 403) {
                    window.location.href = '/forbidden';
                } else {
                    setError('Не удалось загрузить список камер');
                }
            } catch (err) {
                console.error('Error fetching cameras:', err);
                setError('Не удалось подключиться к серверу');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCameras();
    }, []);

    if (isLoading) {
        return <ProgressLoader message="Загрузка камер..." />;
    }

    if (error) {
        return (
            <div className="existing-cameras-error">
                <p>{error}</p>
            </div>
        );
    }

    if (cameras.length === 0) {
        return (
            <div className="existing-cameras-empty">
                <p>Нет созданных камер</p>
            </div>
        );
    }

    return (
        <div className="existing-cameras-region">
            <h2 className="existing-cameras-title">Существующие камеры</h2>
            <div className="existing-cameras-list">
                {cameras.map((camera) => (
                    <ExistingCameraItem
                        key={camera.id}
                        id={camera.id}
                        name={camera.name}
                        areaId={camera.areaId}
                        areaName={camera.areaName}
                    />
                ))}
            </div>

            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}