import './UserSearchArea.css';
import { useState, useRef } from 'react';
import UserSearchItem from './UserSearchItem/UserSearchItem.jsx';
import InlineTextInputField from '../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';

export default function UserSearchArea() {
    const [searchValue, setSearchValue] = useState('');
    const [selectedRole, setSelectedRole] = useState('SAFETY_OFFICER');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const roleOptions = [
        { value: 'ADMIN', label: 'Администратор' },
        { value: 'SUPERADMIN', label: 'Супер-администратор' },
        { value: 'SAFETY_OFFICER', label: 'Сотрудник отдела ТБ' },
        { value: 'FOREMAN', label: 'Ответственный за зону' },
        { value: 'SUPERVISOR', label: 'Начальник' }
    ];

    const openModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const handleSearch = () => {
        if (!searchValue.trim()) {
            openModal('Введите поисковый запрос');
            return;
        }

        console.log('Поиск пользователей:');
        console.log('Поисковый запрос:', searchValue);
        console.log('Фильтр по роли:', selectedRole);
        
        // Здесь будет реальный запрос к API
        setHasSearched(true);
        setSearchResults([]);
    };

    const getRoleLabel = (roleValue) => {
        const role = roleOptions.find(r => r.value === roleValue);
        return role ? role.label : roleValue;
    };

    return (
        <div className="user-search-area">
            <div className="user-search-section">
                <h2 className="user-search-title">Список сотрудников</h2>
                
                <div className="user-search-filters">
                    <div className="user-search-filter-group">
                        <InlineTextInputField
                            name=""
                            width="100%"
                            placeholder="Поиск по ФИО или email..."
                            value={searchValue}
                            onChange={setSearchValue}
                        />
                    </div>
                    
                    <div className="user-search-filter-group">
                        <select 
                            className="user-search-role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <ActionButton onClick={handleSearch} width="auto">
                        Найти
                    </ActionButton>
                </div>
            </div>

            <div className="user-search-results">
                {isLoading && <ProgressLoader message="Поиск пользователей..." />}
                
                {!isLoading && hasSearched && searchResults.length === 0 && (
                    <div className="user-search-empty">
                        <p>Пользователи не найдены</p>
                    </div>
                )}
                
                {!isLoading && searchResults.length > 0 && (
                    <div className="user-search-results-list">
                        {searchResults.map((user) => (
                            <UserSearchItem
                                key={user.id}
                                id={user.id}
                                username={user.username}
                                firstname={user.firstname}
                                lastname={user.lastname}
                                parentname={user.parentname}
                                role={user.role}
                                status={user.status}
                            />
                        ))}
                    </div>
                )}
                
                {!isLoading && !hasSearched && (
                    <div className="user-search-empty">
                        <p>Введите поисковый запрос для поиска пользователей</p>
                    </div>
                )}
            </div>

            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}