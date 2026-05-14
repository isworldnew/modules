import './ExistingCameraItem.css';

export default function ExistingCameraItem({ id, name, areaId, areaName }) {
    
    const handleClick = () => {
        window.location.href = `/camera/${id}`;
    };

    const displayName = name && name.trim() !== '' ? name : `Камера #${id}`;

    return (
        <div className="existing-camera-item" onClick={handleClick}>
            <div className="existing-camera-header">
                <div className="existing-camera-name">{displayName}</div>
                <div className="existing-camera-id">Камера #{id}</div>
            </div>
            
            <div className="existing-camera-content">
                <div className="existing-camera-section">
                    <div className="section-label">Принадлежит зоне:</div>
                    <div className="section-value">
                        <span className="area-name">{areaName || 'Не указана'}</span>
                        {areaId && <span className="area-id">ID зоны: {areaId}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}