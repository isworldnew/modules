import './DocumentItem.css';
import { useState } from 'react';
import ActionButton from '../../../../component/common-components/ActionButton/ActionButton';

export default function DocumentItem({ documentId, fileName, dateTime, contentType, content }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const documentUrl = `data:${contentType};base64,${content}`;

    const handleDownload = (e) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    const isImage = contentType && contentType.startsWith('image/');

    return (
        <>
            <div className="document-item">
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
                <div className="document-item__actions">
                    {isImage && (
                        <div className="document-item__preview" onClick={() => setIsModalOpen(true)}>
                            <img 
                                src={documentUrl} 
                                alt="preview"
                                className="document-preview-thumbnail"
                            />
                        </div>
                    )}
                    <ActionButton onClick={handleDownload} width="auto">
                        Скачать
                    </ActionButton>
                </div>
            </div>

            {isModalOpen && (
                <div className="document-modal" onClick={() => setIsModalOpen(false)}>
                    <div className="document-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button className="document-modal__close" onClick={() => setIsModalOpen(false)}>×</button>
                        <img 
                            src={documentUrl} 
                            alt="document full"
                            className="document-modal__image"
                        />
                    </div>
                </div>
            )}
        </>
    );
}