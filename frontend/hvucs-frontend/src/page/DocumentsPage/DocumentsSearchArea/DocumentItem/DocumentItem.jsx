import './DocumentItem.css';

export default function DocumentItem({ documentId, fileName, dateTime, contentType, content }) {
    const handleDownload = () => {
        const byteCharacters = atob(content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const getFileNameShort = (fullName) => {
        if (!fullName) return 'документ';
        const parts = fullName.split('-');
        if (parts.length > 2) {
            return parts.slice(2).join('-');
        }
        return fullName;
    };

    return (
        <div className="document-item" onClick={handleDownload}>
            <div className="document-item__info">
                <div className="document-item__name">
                    <span className="document-item__label">Документ</span>
                    <span className="document-item__value">{getFileNameShort(fileName)}</span>
                </div>
                <div className="document-item__date">
                    <span className="document-item__label">Дата нарушения</span>
                    <span className="document-item__value">{formatDateTime(dateTime)}</span>
                </div>
            </div>
            <div className="document-item__download">
                <span className="download-text">Скачать</span>
            </div>
        </div>
    );
}