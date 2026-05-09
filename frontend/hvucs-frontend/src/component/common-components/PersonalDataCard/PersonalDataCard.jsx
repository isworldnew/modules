import './PersonalDataCard.css';
import PersonalDataCardKey from './PersonalDataCardKey/PersonalDataCardKey.jsx';
import PersonalDataCardValue from './PersonalDataCardValue/PersonalDataCardValue.jsx';
import PersonalDataCardEnum from './PersonalDataCardEnum/PersonalDataCardEnum.jsx';
import ModalWindow from '../ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../common-components/ProgressLoader/ProgressLoader.jsx';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js'; 
import ActionButton from '../../common-components/ActionButton/ActionButton.jsx';

import { useState, useEffect } from 'react';

export default function PersonalDataCard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    
    // Загрузка данных пользователя
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await executeWithTokenRefresh(async (accessToken) => {
                    const fetchResponse = await fetch('/api/users/user', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    let data = null;
                    try {
                        data = await fetchResponse.json();
                    } catch (e) {
                        data = null;
                    }
                    
                    return {
                        status: fetchResponse.status,
                        data: data
                    };
                });
                
                if (response.status === 200 && response.data) {
                    setUserData(response.data);
                } else {
                    setError('Не удалось загрузить данные пользователя');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Произошла ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, []);
    
    // Формирование ФИО из полей
    const getFullName = () => {
        const parts = [
            userData?.lastname,
            userData?.firstname,
            userData?.parentname
        ].filter(part => part && part.trim() !== '');
        
        return parts.length > 0 ? parts.join(' ') : '—';
    };
    
    // Обработчик выхода из системы
    const handleLogout = () => {
        // Очищаем localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Перенаправляем на страницу логина
        window.location.href = '/login';
    };
    
    // Показываем лоадер во время загрузки
    if (loading) {
        return <ProgressLoader message="Загрузка данных пользователя..." />;
    }
    
    // Показываем ошибку, если она есть
    if (error) {
        return (
            <div className="personal-data-card personal-data-card--error">
                <h2 className="personal-data-card__title">Ошибка</h2>
                <p className="personal-data-card__error-message">{error}</p>
                <button 
                    className="btn btn-yellow"
                    onClick={() => window.location.reload()}
                >
                    Повторить
                </button>
            </div>
        );
    }
    
    // Если данные не загружены, показываем пустое состояние
    if (!userData) {
        return (
            <div className="personal-data-card personal-data-card--empty">
                <h2 className="personal-data-card__title">Информация о пользователе</h2>
                <p className="personal-data-card__empty-message">Данные не найдены</p>
            </div>
        );
    }
    
    return (
        <>
            <div className="personal-data-card">
                <h2 className="personal-data-card__title">Информация о пользователе</h2>
                
                <div className="personal-data-card__info">
                    <div className="info-row">
                        <PersonalDataCardKey>ФИО:</PersonalDataCardKey>
                        <PersonalDataCardValue>{getFullName()}</PersonalDataCardValue>
                    </div>
                    
                    <div className="info-row">
                        <PersonalDataCardKey>Логин:</PersonalDataCardKey>
                        <PersonalDataCardValue>{userData.username || '—'}</PersonalDataCardValue>
                    </div>
                    
                    <div className="info-row">
                        <PersonalDataCardKey>Роль:</PersonalDataCardKey>
                        <PersonalDataCardValue>
                            <PersonalDataCardEnum value={userData.role} />
                        </PersonalDataCardValue>
                    </div>
                    
                    <div className="info-row">
                        <PersonalDataCardKey>Статус:</PersonalDataCardKey>
                        <PersonalDataCardValue>
                            <PersonalDataCardEnum value={userData.status} />
                        </PersonalDataCardValue>
                    </div>
                </div>
                
                {/* Кнопка выхода */}
                <div className="personal-data-card__logout">
                    <ActionButton
                        onClick={handleLogout}
                        width="20%"
                        backgroundColor="var(--button-yellow)"
                        textColor="var(--button-text-dark)"
                    >
                        Выйти из системы
                    </ActionButton>
                </div>
            </div>
            
            <ModalWindow 
                message="Функция редактирования в разработке"
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </>
    );
}