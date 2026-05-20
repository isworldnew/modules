import './EventsArchive.css';
import { useState, useEffect } from 'react';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import InlineTextInputField from '../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import DropDownMenu from '../../../../component/common-components/DropDownMenu/DropDownMenu.jsx';
import ActionButton from '../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../component/common-components/ModalWindow/ModalWindow.jsx';

import EventsArea from './EventsArea/EventsArea.jsx';

export default function EventsArchive() {
    const navItems = [
        { 
            label: 'Сотрудники', 
            href: '/employees', 
            isActive: false,
            showBadge: false,
        }, 
        { 
            label: 'Зоны', 
            href: '/areas-page', 
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Камеры',
            href: '/cameras-page',
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Архив проишествий',
            href: '/archive',
            isActive: true,
            showBadge: false,
        },
        {
            label: 'Статистика',
            href: '/stats',
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Личный кабинет',
            href: '/supervisor-user-page',
            isActive: false,
            showBadge: false,
        }
    ];

    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedArea, setSelectedArea] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    const showErrorModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };
    
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
    
    const saveDatesToLocalStorage = (from, to) => {
        if (from && to) {
            localStorage.setItem('archiveDateFrom', from);
            localStorage.setItem('archiveDateTo', to);
        }
    };
    
    const clearDatesFromLocalStorage = () => {
        localStorage.removeItem('archiveDateFrom');
        localStorage.removeItem('archiveDateTo');
    };
    
    useEffect(() => {
        const savedDateFrom = localStorage.getItem('archiveDateFrom');
        const savedDateTo = localStorage.getItem('archiveDateTo');
        
        if (savedDateFrom && savedDateTo) {
            setDateFrom(savedDateFrom);
            setDateTo(savedDateTo);
            setTimeout(() => {
                setSearchTrigger(prev => prev + 1);
            }, 100);
        }
        setIsInitialLoad(false);
    }, []);
    
    const handleAreaSelect = (area) => {
        setSelectedArea(area);
        console.log('Выбрана зона:', area);
    };
    
    const handleSearch = () => {
        if (!dateFrom && !dateTo) {
            clearDatesFromLocalStorage();
            setSearchTrigger(prev => prev + 1);
            return;
        }
        
        if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
            showErrorModal('Пожалуйста, заполните обе даты для поиска по диапазону');
            return;
        }
        
        if (dateFrom && !validateDateFormat(dateFrom)) {
            showErrorModal('Неверный формат даты "От"\nДата должна быть в формате ДД/ММ/ГГГГ\nДень: 1-31, Месяц: 1-12, Год: 4 цифры');
            return;
        }
        
        if (dateTo && !validateDateFormat(dateTo)) {
            showErrorModal('Неверный формат даты "До"\nДата должна быть в формате ДД/ММ/ГГГГ\nДень: 1-31, Месяц: 1-12, Год: 4 цифры');
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
                showErrorModal('Дата "От" не может быть позже даты "До"');
                return;
            }
        }
        
        saveDatesToLocalStorage(dateFrom, dateTo);
        setSearchTrigger(prev => prev + 1);
        console.log('Поиск по зоне:', selectedArea?.areaId, selectedArea?.name);
    };
    
    return (
        <div className="event-archive-page">
            <Header />
            <div className="event-archive-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="event-archive-page__content">
                    <div className="event-archive-page__content-inner">
                        <PageName title="Архив проишествий" />
                        
                        <div className="archive-filters">
                            <div className="filter-group">
                                <label>От:</label>
                                <InlineTextInputField
                                    type="date"
                                    placeholder="ДД/ММ/ГГГГ"
                                    value={dateFrom}
                                    onChange={setDateFrom}
                                    width="140px"
                                />
                            </div>
                            
                            <div className="filter-group">
                                <label>До:</label>
                                <InlineTextInputField
                                    type="date"
                                    placeholder="ДД/ММ/ГГГГ"
                                    value={dateTo}
                                    onChange={setDateTo}
                                    width="140px"
                                />
                            </div>
                            
                            <div className="filter-group">
                                <label>Зона:</label>
                                <DropDownMenu
                                    type="area"
                                    endpoint="/api/areas"
                                    onSelect={handleAreaSelect}
                                    placeholder="Выберите зону..."
                                    width="260px"
                                />
                            </div>
                            
                            <ActionButton 
                                onClick={handleSearch}
                                width="auto"
                            >
                                Найти
                            </ActionButton>
                        </div>
                        
                        <EventsArea 
                            dateFrom={dateFrom} 
                            dateTo={dateTo} 
                            searchTrigger={searchTrigger}
                            isInitialLoad={isInitialLoad}
                            areaId={selectedArea?.areaId}
                        />
                    </div>
                </main>
            </div>
            <Footer />
            
            <ModalWindow 
                message={modalMessage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}