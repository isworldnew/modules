import './UserSearchArea.css';
import { useState } from 'react';
import UserSearchItem from './UserSearchItem/UserSearchItem.jsx';
import InlineTextInputField from '../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';

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

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            openModal('Введите поисковый запрос');
            return;
        }

        setIsLoading(true);
        setHasSearched(true);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(`/api/users/search?searchRequest=${encodeURIComponent(searchValue.trim())}&role=${selectedRole}`, {
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

                return { status: response.status, data: data };
            });

            if (result.status === 200 && result.data) {
                setSearchResults(result.data);
            } else if (result.status === 403) {
                window.location.href = '/forbidden';
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
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
                    
                    <ActionButton onClick={handleSearch} width="auto" disabled={isLoading}>
                        {isLoading ? 'Поиск...' : 'Найти'}
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