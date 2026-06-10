import './DocumentViewer.css';
import { useState, useEffect } from 'react';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';

export default function DocumentViewer({ accidentId }) {
    const [documentUrl, setDocumentUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const fetchDocument = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(`/api/documents/by-accident/${accidentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                return data;
            });

            if (result && result.content) {
                const url = `data:${result.contentType};base64,${result.content}`;
                setDocumentUrl(url);
            } else {
                setError('Документ не содержит данных');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            setError(`Не удалось загрузить документ: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (accidentId) {
            fetchDocument();
        }

        return () => {
            if (documentUrl) {
                URL.revokeObjectURL(documentUrl);
            }
        };
    }, [accidentId]);

    const handleDownload = () => {
        if (documentUrl) {
            const link = document.createElement('a');
            link.href = documentUrl;
            link.download = `document_${accidentId}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (isLoading) {
        return <div className="document-viewer-loading">Загрузка документа...</div>;
    }

    if (error) {
        return <div className="document-viewer-error">{error}</div>;
    }

    if (!documentUrl) {
        return null;
    }

    return (
        <>
            <div className="document-viewer-buttons">
                <img 
                    src={documentUrl} 
                    alt="document preview"
                    className="document-viewer-thumbnail"
                    onClick={() => setIsModalOpen(true)}
                />
                <ActionButton onClick={handleDownload} width="auto">
                    Скачать
                </ActionButton>
            </div>

            {isModalOpen && (
                <div className="document-viewer-modal" onClick={() => setIsModalOpen(false)}>
                    <div className="document-viewer-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="document-viewer-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
                        <img 
                            src={documentUrl} 
                            alt="document full"
                            className="document-viewer-image"
                        />
                    </div>
                </div>
            )}
        </>
    );
}