import './ReportItem.css';

export default function ReportItem({ potentialAccidentId, accidentReportId, areaName, uploadDateTime, status }) {
    
    console.log('ReportItem potentialAccidentId:', potentialAccidentId);
    console.log('ReportItem accidentReportId:', accidentReportId);
    
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
            case 'PROCESSED_BY_FOREMAN':
                return { text: 'Разбирательство проведено', className: 'status-processed' };
            case 'UNPROCESSED_BY_FOREMAN':
                return { text: 'Провести разбирательство', className: 'status-unprocessed' };
            default:
                return { text: status || 'Неизвестно', className: 'status-unknown' };
        }
    };
    
    const statusInfo = getStatusInfo();
    const formattedDateTime = formatDateTime(uploadDateTime);
    
    const handleClick = () => {
        console.log('Navigating to report with potentialAccidentId:', potentialAccidentId, 'and accidentReportId:', accidentReportId);
        window.location.href = `/report/${potentialAccidentId}?reportId=${accidentReportId}`;
    };
    
    return (
        <div className="report-card" onClick={handleClick}>
            <div className="report-id">
                #{accidentReportId || potentialAccidentId} | {areaName}
            </div>
            <div className="report-meta">
                {formattedDateTime}
            </div>
            <div className={`report-status ${statusInfo.className}`}>
                {statusInfo.text}
            </div>
        </div>
    );
}
// import './ReportItem.css';

// export default function ReportItem({ potentialAccidentId, accidentReportId, areaName, uploadDateTime, status }) {
    
//     // Форматирование даты из ISO формата в "ЧЧ:ММ ДД/ММ/ГГГГ"
//     const formatDateTime = (dateTimeString) => {
//         if (!dateTimeString) return '';
        
//         const date = new Date(dateTimeString);
        
//         const hours = date.getUTCHours().toString().padStart(2, '0');
//         const minutes = date.getUTCMinutes().toString().padStart(2, '0');
//         const day = date.getUTCDate().toString().padStart(2, '0');
//         const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
//         const year = date.getUTCFullYear();
        
//         return `${hours}:${minutes} ${day}/${month}/${year}`;
//     };
    
//     // Определение статуса на русском и CSS-класса
//     const getStatusInfo = () => {
//         switch(status) {
//             case 'PROCESSED_BY_FOREMAN':
//                 return { text: 'Разбирательство проведено', className: 'status-processed' };
//             case 'UNPROCESSED_BY_FOREMAN':
//                 return { text: 'Провести разбирательство', className: 'status-unprocessed' };
//             default:
//                 return { text: status || 'Неизвестно', className: 'status-unknown' };
//         }
//     };
    
//     const statusInfo = getStatusInfo();
//     const formattedDateTime = formatDateTime(uploadDateTime);
    
//     const handleClick = () => {
//         // Переход на страницу отчёта о нарушении
//         window.location.href = `/report/${potentialAccidentId}`;
//     };
    
//     return (
//         <div className="report-card" onClick={handleClick}>
//             <div className="report-id">
//                 #{accidentReportId || potentialAccidentId} | {areaName}
//             </div>
//             <div className="report-meta">
//                 {formattedDateTime}
//             </div>
//             <div className={`report-status ${statusInfo.className}`}>
//                 {statusInfo.text}
//             </div>
//         </div>
//     );
// }