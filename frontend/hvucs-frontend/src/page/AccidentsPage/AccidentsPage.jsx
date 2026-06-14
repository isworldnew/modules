import { useState, useEffect } from 'react';
import './AccidentsPage.css';

import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../component/common-components/PageName/PageName.jsx';
import InlineTextInputField from '../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../component/common-components/ModalWindow/ModalWindow.jsx';
import AccidentArea from './AccidentArea/AccidentArea.jsx';

export default function AccidentsPage() {

    const navItems = [
        { 
            label: 'Уведомления', 
            href: '/notifications', 
            isActive: false,
            showBadge: true 
        },
        { 
            label: 'Инциденты', 
            href: '/accidents', 
            isActive: true,
            showBadge: false 
        },
        {
            label: 'Документы', 
            href: '/documents', 
            isActive: false,
            showBadge: false,            
        },
        {
            label: 'Личный кабинет',
            href: '/safety-officer-user-page',
            isActive: false,
            showBadge: false
        }
    ];

    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    const showErrorModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };
    
    // Функция для валидации формата даты ДД/ММ/ГГГГ
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
    
    // Сохранение дат в localStorage
    const saveDatesToLocalStorage = (from, to) => {
        if (from && to) {
            localStorage.setItem('accidentsDateFrom', from);
            localStorage.setItem('accidentsDateTo', to);
        }
    };
    
    // Удаление дат из localStorage
    const clearDatesFromLocalStorage = () => {
        localStorage.removeItem('accidentsDateFrom');
        localStorage.removeItem('accidentsDateTo');
    };
    
    // Загрузка дат из localStorage при старте
    useEffect(() => {
        const savedDateFrom = localStorage.getItem('accidentsDateFrom');
        const savedDateTo = localStorage.getItem('accidentsDateTo');
        
        if (savedDateFrom && savedDateTo) {
            setDateFrom(savedDateFrom);
            setDateTo(savedDateTo);
            // Триггер для поиска с сохранёнными датами
            setTimeout(() => {
                setSearchTrigger(prev => prev + 1);
            }, 100);
        }
        setIsInitialLoad(false);
    }, []);
    
    const handleSearch = () => {
        // Валидация: если обе даты пустые - всё окей
        if (!dateFrom && !dateTo) {
            console.log('Search accidents (no filters)');
            clearDatesFromLocalStorage(); // Удаляем даты из localStorage
            setSearchTrigger(prev => prev + 1);
            return;
        }
        
        // Валидация: если заполнена только одна из дат
        if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
            showErrorModal('Пожалуйста, заполните обе даты для поиска по диапазону');
            return;
        }
        
        // Валидация формата даты "От"
        if (dateFrom && !validateDateFormat(dateFrom)) {
            showErrorModal('Неверный формат даты "От"\nДата должна быть в формате ДД/ММ/ГГГГ\nДень: 1-31, Месяц: 1-12, Год: 4 цифры');
            return;
        }
        
        // Валидация формата даты "До"
        if (dateTo && !validateDateFormat(dateTo)) {
            showErrorModal('Неверный формат даты "До"\nДата должна быть в формате ДД/ММ/ГГГГ\nДень: 1-31, Месяц: 1-12, Год: 4 цифры');
            return;
        }
        
        // Валидация: дата "От" не может быть позже даты "До"
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
        
        // Если валидация прошла успешно, сохраняем даты в localStorage
        console.log('Search accidents with filters:', { dateFrom, dateTo });
        saveDatesToLocalStorage(dateFrom, dateTo);
        setSearchTrigger(prev => prev + 1);
    };
    
    return (
        <div className="accidents-page-wrapper">
            <Header />
            
            <div className="accidents-layout">
                 <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                
                <main className="accidents-content">
                    <PageName title="Инциденты" />
                    
                    <div className="filters">
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
                        
                        <ActionButton 
                            onClick={handleSearch}
                            width="auto"
                        >
                            Найти
                        </ActionButton>
                    </div>
                    
                    <AccidentArea 
                        dateFrom={dateFrom} 
                        dateTo={dateTo} 
                        searchTrigger={searchTrigger}
                        isInitialLoad={isInitialLoad}
                    />
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