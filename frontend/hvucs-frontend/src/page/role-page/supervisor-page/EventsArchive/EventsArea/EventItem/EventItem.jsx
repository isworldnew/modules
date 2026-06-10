import './EventItem.css';

export default function EventItem({ potentialAccidentId, areaName, uploadDateTime, status }) {
    
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
    
    const getStatusInfo = () => {
        switch(status) {
            case 'DOCUMENTED':
                return { text: 'Обработано', className: 'status-documented' };
            case 'NON_DOCUMENTED':
                return { text: 'Не обработано', className: 'status-non-documented' };
            default:
                return { text: status || 'Неизвестно', className: 'status-unknown' };
        }
    };
    
    const statusInfo = getStatusInfo();
    const formattedDateTime = formatDateTime(uploadDateTime);
    
    const handleClick = () => {
        window.location.href = `/report/${potentialAccidentId}`;
    };
    
    return (
        <div className="event-card" onClick={handleClick}>
            <div className="event-id">
                #{potentialAccidentId} | {areaName}
            </div>
            <div className="event-meta">
                {formattedDateTime}
            </div>
            <div className={`event-status ${statusInfo.className}`}>
                {statusInfo.text}
            </div>
        </div>
    );
}