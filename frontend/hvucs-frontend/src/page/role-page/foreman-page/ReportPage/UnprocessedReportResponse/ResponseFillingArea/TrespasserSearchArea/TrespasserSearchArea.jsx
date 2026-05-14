import './TrespasserSearchArea.css';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import InlineTextInputField from '../../../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../../../component/common-components/ActionButton/ActionButton.jsx';

const TrespasserSearchArea = forwardRef(({ isExpanded, onToggle }, ref) => {
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef(null);

    const handleSearch = () => {
        console.log('Search:', searchValue);
    };

    const handleClear = () => {
        setSearchValue('');
        if (inputRef.current?.clear) {
            inputRef.current.clear();
        }
    };

    useImperativeHandle(ref, () => ({
        handleClear
    }));

    if (!isExpanded) {
        return (
            <div className="trespasser-search-area collapsed">
                <div className="trespasser-search-header" onClick={onToggle}>
                    <span className="trespasser-search-title">Поиск нарушителя среди существующих</span>
                    <span className="trespasser-search-icon">▼</span>
                </div>
            </div>
        );
    }

    return (
        <div className="trespasser-search-area expanded">
            <div className="trespasser-search-header" onClick={onToggle}>
                <span className="trespasser-search-title">Поиск нарушителя среди существующих</span>
                <span className="trespasser-search-icon">▲</span>
            </div>
            <div className="trespasser-search-content">
                <InlineTextInputField
                    ref={inputRef}
                    name="ФИО нарушителя"
                    width="100%"
                    placeholder="Введите фамилию, имя или отчество"
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)}
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
});

TrespasserSearchArea.displayName = 'TrespasserSearchArea';

export default TrespasserSearchArea;