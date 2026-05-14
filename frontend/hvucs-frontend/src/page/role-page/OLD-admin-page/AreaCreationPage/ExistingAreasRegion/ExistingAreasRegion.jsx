import './ExistingAreasRegion.css';
import ExistingArea from './ExistingArea/ExistingArea.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import { useState, useEffect } from 'react';

export default function ExistingAreasRegion() {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAreas = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await executeWithTokenRefresh(async (accessToken) => {
                    const fetchResponse = await fetch('/api/areas/shortcuts', {
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
                    setAreas(response.data);
                } else {
                    setError('Не удалось загрузить список зон');
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
                setError('Произошла ошибка при загрузке зон');
            } finally {
                setLoading(false);
            }
        };
        
        fetchAreas();
    }, []);

    if (loading) {
        return <ProgressLoader message="Загрузка списка зон..." />;
    }

    if (error) {
        return (
            <div className="existing-areas-region existing-areas-region--error">
                <h2 className="existing-areas-region__title">Существующие зоны</h2>
                <p className="existing-areas-region__error-message">{error}</p>
            </div>
        );
    }

    if (areas.length === 0) {
        return (
            <div className="existing-areas-region existing-areas-region--empty">
                <h2 className="existing-areas-region__title">Существующие зоны</h2>
                <p className="existing-areas-region__empty-message">Нет созданных зон</p>
            </div>
        );
    }

    return (
        <div className="existing-areas-region">
            <h2 className="existing-areas-region__title">Существующие зоны</h2>
            <div className="existing-areas-region__table-wrapper">
                <table className="existing-areas-region__table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название зоны</th>
                        </tr>
                    </thead>
                    <tbody>
                        {areas.map((area) => (
                            <ExistingArea 
                                key={area.id}
                                id={area.id}
                                name={area.name}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}