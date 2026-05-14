import './ExistingCamerasArea.css';
import ExistingCamera from './ExistingCamera/ExistingCamera.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import { useState, useEffect } from 'react';

export default function ExistingCamerasArea() {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCameras = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await executeWithTokenRefresh(async (accessToken) => {
                    const fetchResponse = await fetch('/api/cameras/shortcuts', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    let data = null;
                    try {
                        data = await fetchResponse.json();
                    } catch (e) {
                        data = null;
                    }
                    
                    return {
                        status: fetchResponse.status,
                        data: data
                    };
                });
                
                if (response.status === 200 && response.data) {
                    setCameras(response.data);
                } else {
                    setError('Не удалось загрузить список камер');
                }
            } catch (err) {
                console.error('Error fetching cameras:', err);
                setError('Произошла ошибка при загрузке камер');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCameras();
    }, []);

    if (loading) {
        return <ProgressLoader message="Загрузка списка камер..." />;
    }

    if (error) {
        return (
            <div className="existing-cameras-area existing-cameras-area--error">
                <h2 className="existing-cameras-area__title">Существующие камеры</h2>
                <p className="existing-cameras-area__error-message">{error}</p>
            </div>
        );
    }

    if (cameras.length === 0) {
        return (
            <div className="existing-cameras-area existing-cameras-area--empty">
                <h2 className="existing-cameras-area__title">Существующие камеры</h2>
                <p className="existing-cameras-area__empty-message">Нет созданных камер</p>
            </div>
        );
    }

    return (
        <div className="existing-cameras-area">
            <h2 className="existing-cameras-area__title">Существующие камеры</h2>
            <div className="existing-cameras-area__table-wrapper">
                <table className="existing-cameras-area__table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название камеры</th>
                            <th>Зона</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cameras.map((camera) => (
                            <ExistingCamera 
                                key={camera.id}
                                id={camera.id}
                                name={camera.name}
                                areaName={camera.areaName}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}