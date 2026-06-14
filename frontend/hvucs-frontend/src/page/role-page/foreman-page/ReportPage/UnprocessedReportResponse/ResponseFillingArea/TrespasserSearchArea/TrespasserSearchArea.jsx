import './TrespasserSearchArea.css';

import {
    useState,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react';

import InlineTextInputField from '../../../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../../../component/common-components/ActionButton/ActionButton.jsx';
import { executeWithTokenRefresh } from '../../../../../../../script/executeWithTokenRefresh.js';

const TrespasserSearchArea = forwardRef(
    ({ isExpanded, onToggle }, ref) => {

        const inputRef = useRef(null);

        const [searchValue, setSearchValue] = useState('');
        const [selectedTrespasser, setSelectedTrespasser] = useState(null);
        const [searchResults, setSearchResults] = useState([]);
        const [isSearching, setIsSearching] = useState(false);

        const getRelationText = (relation) => {
            switch(relation) {
                case 'INNER_EMPLOYEE':
                    return 'Внутренний сотрудник';
                case 'OUTER_EMPLOYEE':
                    return 'Сотрудник внешней организации';
                default:
                    return relation || 'Не указано';
            }
        };

        const handleSearch = async () => {
            if (!searchValue || searchValue.trim() === '') {
                console.log('Поисковый запрос пуст');
                return;
            }

            console.log('Поиск нарушителя:', searchValue);
            setIsSearching(true);

            try {
                const result = await executeWithTokenRefresh(async (accessToken) => {
                    const response = await fetch(`/api/trespassers/search?searchRequest=${encodeURIComponent(searchValue.trim())}`, {
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
                        console.error('Ошибка парсинга ответа:', e);
                        data = null;
                    }

                    return { status: response.status, data: data };
                });

                console.log('Результат поиска:', result);

                if (result.status === 200 && result.data) {
                    setSearchResults(result.data);
                    setSelectedTrespasser(null);
                    console.log('Найдено нарушителей:', result.data.length);
                } else {
                    setSearchResults([]);
                    console.log('Ничего не найдено');
                }
            } catch (error) {
                console.error('Ошибка при поиске нарушителей:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const handleSelectTrespasser = (trespasser) => {
            console.log('Выбран нарушитель:', trespasser);
            setSelectedTrespasser(trespasser);
        };

        const handleClear = () => {
            setSearchValue('');
            setSelectedTrespasser(null);
            setSearchResults([]);
            inputRef.current?.clear();
            console.log('Очистка поиска');
        };

        useImperativeHandle(ref, () => ({
            handleClear,
            getData() {
                return {
                    searchValue,
                    selectedTrespasser
                };
            }
        }));

        if (!isExpanded) {
            return (
                <div className="trespasser-search-area collapsed">
                    <div
                        className="trespasser-search-header"
                        onClick={onToggle}
                    >
                        <span className="trespasser-search-title">
                            Поиск нарушителя среди существующих
                        </span>
                        <span className="trespasser-search-icon">
                            ▼
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <div className="trespasser-search-area expanded">
                <div
                    className="trespasser-search-header"
                    onClick={onToggle}
                >
                    <span className="trespasser-search-title">
                        Поиск нарушителя среди существующих
                    </span>
                    <span className="trespasser-search-icon">
                        ▲
                    </span>
                </div>

                <div className="trespasser-search-content">
                    <InlineTextInputField
                        ref={inputRef}
                        name="ФИО нарушителя"
                        width="100%"
                        placeholder="Введите фамилию, имя или отчество"
                        value={searchValue}
                        onChange={setSearchValue}
                    />

                    <div className="trespasser-search-actions">
                        <ActionButton
                            onClick={handleSearch}
                            width="auto"
                            disabled={isSearching}
                        >
                            {isSearching ? 'Поиск...' : 'Поиск'}
                        </ActionButton>

                        <ActionButton
                            onClick={handleClear}
                            width="auto"
                            variant="secondary"
                        >
                            Очистить
                        </ActionButton>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="trespasser-search-results">
                            <div className="search-results-label">Результаты поиска:</div>
                            <div className="search-results-list">
                                {searchResults.map((trespasser) => (
                                    <div 
                                        key={trespasser.id}
                                        className={`search-result-item ${selectedTrespasser?.id === trespasser.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectTrespasser(trespasser)}
                                    >
                                        <div className="result-name">{trespasser.name}</div>
                                        <div className="result-details">
                                            <span>{getRelationText(trespasser.relation)}</span>
                                            <span>{trespasser.post}</span>
                                        </div>
                                        <div className="result-email">
                                            Email: {trespasser.organizationEmail}
                                        </div>
                                        <div className="result-amount">
                                            Количество нарушений: {trespasser.responsesAmount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTrespasser && (
                        <div className="selected-trespasser">
                            <div className="selected-label">Выбран нарушитель:</div>
                            <div className="selected-info">{selectedTrespasser.name}</div>
                            <div className="selected-details">
                                {getRelationText(selectedTrespasser.relation)}, {selectedTrespasser.post}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

TrespasserSearchArea.displayName = 'TrespasserSearchArea';

export default TrespasserSearchArea;