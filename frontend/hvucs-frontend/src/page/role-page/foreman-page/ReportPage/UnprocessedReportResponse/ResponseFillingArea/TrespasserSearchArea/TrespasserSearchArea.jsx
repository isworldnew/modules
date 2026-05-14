import './TrespasserSearchArea.css';

import {
    useState,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react';

import InlineTextInputField from '../../../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';

import ActionButton from '../../../../../../../component/common-components/ActionButton/ActionButton.jsx';

const TrespasserSearchArea = forwardRef(
    ({ isExpanded, onToggle }, ref) => {

        const inputRef = useRef(null);

        const [searchValue, setSearchValue] =
            useState('');

        const [selectedTrespasser, setSelectedTrespasser] =
            useState(null);

        const handleSearch = () => {
            console.log(searchValue);

            const mockedResponse = {
                id: 15,
                name: 'Иванов Иван Иванович',
                post: 'Инженер',
                relation: 'INNER_EMPLOYEE',
                organizationEmail: 'ivanov@test.com',
                responsesAmount: 4
            };

            setSelectedTrespasser(mockedResponse);
        };

        const handleClear = () => {
            setSearchValue('');
            setSelectedTrespasser(null);

            inputRef.current?.clear();
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
                        >
                            Поиск
                        </ActionButton>

                        <ActionButton
                            onClick={handleClear}
                            width="auto"
                            variant="secondary"
                        >
                            Очистить
                        </ActionButton>
                    </div>
                </div>
            </div>
        );
    }
);

TrespasserSearchArea.displayName =
    'TrespasserSearchArea';

export default TrespasserSearchArea;