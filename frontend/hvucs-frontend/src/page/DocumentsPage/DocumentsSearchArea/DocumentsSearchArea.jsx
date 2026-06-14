import './DocumentsSearchArea.css';
import { useState, useEffect, useRef } from 'react';
import ProgressLoader from '../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import InlineTextInputField from '../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../component/common-components/ActionButton/ActionButton.jsx';
import DocumentItem from './DocumentItem/DocumentItem.jsx';
import ModalWindow from '../../../component/common-components/ModalWindow/ModalWindow.jsx';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js';

export default function DocumentsSearchArea() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const isMounted = useRef(true);

    const validateDateFormat = (dateString) => {
        if (!dateString) return true;
        
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(dateString)) {
            return false;
        }
        
        const day = parseInt(dateString.split('/')[0], 10);
        const month = parseInt(dateString.split('/')[1], 10);
        const year = parseInt(dateString.split('/')[2], 10);
        
        if (day < 1 || day > 31) return false;
        if (month < 1 || month > 12) return false;
        if (year < 1000 || year > 9999) return false;
        
        return true;
    };

    const convertToISODate = (dateString) => {
        if (!dateString) return null;
        
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        
        return `${year}-${month}-${day}T00:00:00.000Z`;
    };

    const fetchDocuments = async () => {
        setIsLoading(true);
        
        try {
            let url = '/api/documents/date-range';
            
            if (dateFrom && dateTo) {
                const isoDateFrom = convertToISODate(dateFrom);
                const isoDateTo = convertToISODate(dateTo);
                
                if (isoDateFrom && isoDateTo) {
                    url += `?dateFrom=${encodeURIComponent(isoDateFrom)}&dateTo=${encodeURIComponent(isoDateTo)}`;
                }
            }
            
            console.log('Fetching documents from:', url);
            
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                let data = null;
                try {
                    data = await response.json();
                } catch (e) {
                    data = null;
                }

                console.log('Response status:', response.status);
                console.log('Response data:', data);

                return { status: response.status, data: data };
            });

            if (!isMounted.current) return;

            if (result.status === 200 && result.data) {
                console.log('Documents count:', result.data.length);
                setDocuments(result.data);
            } else if (result.status === 403) {
                window.location.href = '/forbidden';
            } else if (result.status === 404) {
                window.location.href = '/not-found';
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchDocuments();
        
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (searchTrigger > 0) {
            fetchDocuments();
        }
    }, [searchTrigger]);

    const handleSearch = () => {
        if (!dateFrom && !dateTo) {
            setSearchTrigger(prev => prev + 1);
            return;
        }
        
        if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
            setModalMessage('Пожалуйста, заполните обе даты для поиска по диапазону');
            setShowModal(true);
            return;
        }
        
        if (dateFrom && !validateDateFormat(dateFrom)) {
            setModalMessage('Неверный формат даты "От"\nДата должна быть в формате ДД/ММ/ГГГГ\nДень: 1-31, Месяц: 1-12, Год: 4 цифры');
            setShowModal(true);
            return;
        }
        
        if (dateTo && !validateDateFormat(dateTo)) {
            setModalMessage('Неверный формат даты "До"\nДата должна быть в формате ДД/ММ/ГГГГ\nДень: 1-31, Месяц: 1-12, Год: 4 цифры');
            setShowModal(true);
            return;
        }
        
        if (dateFrom && dateTo) {
            const dayFrom = parseInt(dateFrom.split('/')[0], 10);
            const monthFrom = parseInt(dateFrom.split('/')[1], 10);
            const yearFrom = parseInt(dateFrom.split('/')[2], 10);
            
            const dayTo = parseInt(dateTo.split('/')[0], 10);
            const monthTo = parseInt(dateTo.split('/')[1], 10);
            const yearTo = parseInt(dateTo.split('/')[2], 10);
            
            const dateFromObj = new Date(yearFrom, monthFrom - 1, dayFrom);
            const dateToObj = new Date(yearTo, monthTo - 1, dayTo);
            
            if (dateFromObj > dateToObj) {
                setModalMessage('Дата "От" не может быть позже даты "До"');
                setShowModal(true);
                return;
            }
        }
        
        setSearchTrigger(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (isLoading) {
        return <ProgressLoader message="Загрузка документов..." />;
    }

    return (
        <div className="documents-search-area">
            <div className="documents-filters">
                <div className="filter-group">
                    <label>Дата от</label>
                    <InlineTextInputField
                        type="date"
                        placeholder="ДД/ММ/ГГГГ"
                        value={dateFrom}
                        onChange={setDateFrom}
                        width="140px"
                    />
                </div>
                <div className="filter-group">
                    <label>Дата до</label>
                    <InlineTextInputField
                        type="date"
                        placeholder="ДД/ММ/ГГГГ"
                        value={dateTo}
                        onChange={setDateTo}
                        width="140px"
                    />
                </div>
                <ActionButton 
                    onClick={handleSearch}
                    width="auto"
                >
                    Найти
                </ActionButton>
            </div>

            {documents.length === 0 && !isLoading && (
                <div className="documents-area-empty">
                    <p>Нет документов</p>
                </div>
            )}

            {documents.length > 0 && (
                <div className="documents-list">
                    {documents.map((doc) => (
                        <DocumentItem
                            key={doc.documentId}
                            documentId={doc.documentId}
                            fileName={doc.fileName}
                            dateTime={doc.dateTime}
                            contentType={doc.contentType}
                            content={doc.content}
                        />
                    ))}
                </div>
            )}

            <ModalWindow 
                message={modalMessage}
                isOpen={showModal}
                onClose={handleCloseModal}
            />
        </div>
    );
}