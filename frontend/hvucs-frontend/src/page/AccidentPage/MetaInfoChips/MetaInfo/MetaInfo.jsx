import './MetaInfo.css';

export default function MetaInfo({ info, infoType }) {
    
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        
        const date = new Date(dateTimeString);
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
    };

    const formatAccuracy = (value) => {
        if (value === undefined || value === null) return '';
        const percentage = (value * 100).toFixed(2);
        return `${percentage} %`;
    };
    
    const getStatusInfo = () => {
        switch(info) {
            case 'PROCESSED':
                return { text: 'Обработан', className: 'status-processed' };
            case 'UNPROCESSED':
                return { text: 'Не обработан', className: 'status-unprocessed' };
            default:
                return { text: info || 'Неизвестно', className: 'status-unknown' };
        }
    };
    
    const getInterpretationInfo = () => {
        switch(info) {
            case 'REAL_ALARM':
                return { text: 'Реальный инцидент', className: 'interpretation-real' };
            case 'FALSE_ALARM':
                return { text: 'Ложное срабатывание', className: 'interpretation-false' };
            default:
                return { text: info || 'Неизвестно', className: 'interpretation-unknown' };
        }
    };
    
    const renderInfo = () => {
        switch(infoType) {
            case 'datetime':
                return <div className="info-value">{formatDateTime(info)}</div>;
            
            case 'accuracy':
                return <div className="info-value">{formatAccuracy(info)}</div>;
            
            case 'status':
                const statusInfo = getStatusInfo();
                return (
                    <div className={`info-status ${statusInfo.className}`}>
                        {statusInfo.text}
                    </div>
                );
            
            case 'description':
                return <div className="info-value">{info || 'Нет описания'}</div>;
            
            case 'interpretation':
                const interpretationInfo = getInterpretationInfo();
                return (
                    <div className={`info-interpretation ${interpretationInfo.className}`}>
                        {interpretationInfo.text}
                    </div>
                );
            
            case 'type':
                return <div className="info-value">{info || 'Не указан'}</div>;
            
            default:
                return <div className="info-value">{info}</div>;
        }
    };
    
    return (
        <div className="meta-info">
            {renderInfo()}
        </div>
    );
}