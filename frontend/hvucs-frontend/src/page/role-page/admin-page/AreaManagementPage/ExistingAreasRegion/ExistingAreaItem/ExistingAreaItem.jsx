import './ExistingAreaItem.css';

export default function ExistingAreaItem({ areaId, name, foreman, cameras }) {
    
    const getFullName = () => {
        if (!foreman) return 'Не назначен';
        const parts = [foreman.lastname, foreman.firstname];
        if (foreman.parentname) {
            parts.push(foreman.parentname);
        }
        return parts.join(' ');
    };

    const handleClick = () => {
        window.location.href = `/area/${areaId}`;
    };

    return (
        <div className="existing-area-item" onClick={handleClick}>
            <div className="existing-area-header">
                <div className="existing-area-name">{name}</div>
                <div className="existing-area-id">Зона #{areaId}</div>
            </div>
            
            <div className="existing-area-content">
                <div className="existing-area-section">
                    <div className="section-label">Ответственный:</div>
                    <div className="section-value">
                        {foreman ? (
                            <>
                                <span className="foreman-name">{getFullName()}</span>
                                <span className="foreman-email">{foreman.username}</span>
                            </>
                        ) : (
                            <span className="no-data">Не назначен</span>
                        )}
                    </div>
                </div>

                <div className="existing-area-section">
                    <div className="section-label">Камеры:</div>
                    <div className="cameras-list">
                        {cameras && cameras.length > 0 ? (
                            cameras.map((camera) => (
                                <div key={camera.id} className="camera-item">
                                    <span className="camera-id">#{camera.id}</span>
                                    <span className="camera-name">{camera.name}</span>
                                </div>
                            ))
                        ) : (
                            <span className="no-data">Нет камер</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}