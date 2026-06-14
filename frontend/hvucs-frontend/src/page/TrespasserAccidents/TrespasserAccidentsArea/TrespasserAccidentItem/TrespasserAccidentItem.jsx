import './TrespasserAccidentItem.css';

export default function TrespasserAccidentItem({ areaName, uploadDateTime, potentialAccidentId }) {
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        
        const date = new Date(dateTimeString);
        
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };
    
    const formattedDateTime = formatDateTime(uploadDateTime);
    
    const handleClick = () => {
        window.location.href = `/report/${potentialAccidentId}`;
    };
    
    return (
        <div className="trespasser-accident-item" onClick={handleClick}>
            <div className="trespasser-accident-item__info">
                <div className="trespasser-accident-item__area">
                    <span className="trespasser-accident-item__label">Зона</span>
                    <span className="trespasser-accident-item__value">{areaName}</span>
                </div>
            </div>
            <div className="trespasser-accident-item__datetime">
                <span className="trespasser-accident-item__label">Дата и время</span>
                <span className="trespasser-accident-item__value">{formattedDateTime}</span>
            </div>
        </div>
    );
}