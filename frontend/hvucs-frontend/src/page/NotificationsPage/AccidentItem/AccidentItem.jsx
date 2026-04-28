import './AccidentItem.css';

export default function AccidentItem({ id, areaName, uploadDateTime, status }) {
    
    // Форматирование даты из ISO формата в "ЧЧ:ММ ДД/ММ/ГГГГ"
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
    
    // Определение статуса на русском и CSS-класса
    const getStatusInfo = () => {
        switch(status) {
            case 'PROCESSED':
                return { text: 'Обработан', className: 'status-processed' };
            case 'UNPROCESSED':
                return { text: 'Не обработан', className: 'status-unprocessed' };
            default:
                return { text: status || 'Неизвестно', className: 'status-unknown' };
        }
    };
    
    const statusInfo = getStatusInfo();
    const formattedDateTime = formatDateTime(uploadDateTime);
    
    const handleClick = () => {
        window.location.href = `/accident/${id}`;
    };
    
    return (
        <div className="incident-card" onClick={handleClick}>
            <div className="incident-id">
                #{id} | {areaName}
            </div>
            <div className="incident-meta">
                {formattedDateTime}
            </div>
            <div className={`incident-status ${statusInfo.className}`}>
                {statusInfo.text}
            </div>
        </div>
    );
}