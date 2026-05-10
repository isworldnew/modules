import './AreaCreateUpdateRegion.css';
import { useState } from 'react';
import DropDownMenu from '../DropDownMenu/DropDownMenu.jsx';
import ChipsArea from '../Chips/ChipsArea/ChipsArea.jsx';
import ActionButton from '../ActionButton/ActionButton';
import InlineTextInputField from '../InlineTextInputField/InlineTextInputField.jsx';

export default function AreaCreateUpdateRegion() {
    const [areaName, setAreaName] = useState('');
    const [selectedBoss, setSelectedBoss] = useState([]);
    const [selectedSafetyOfficers, setSelectedSafetyOfficers] = useState([]);

    const [bossDropdownKey, setBossDropdownKey] = useState(0);
    const [officerDropdownKey, setOfficerDropdownKey] = useState(0);

    const handleAreaNameChange = (value) => {
        setAreaName(value);
        console.log('Название зоны:', value);
    };

    const handleBossSelect = (user) => {
        setSelectedBoss([user]);
        console.log('Выбран начальник:', user);
    };

    const handleSafetyOfficerSelect = (user) => {
        if (!selectedSafetyOfficers.some(officer => officer.id === user.id)) {
            const newOfficers = [...selectedSafetyOfficers, user];
            setSelectedSafetyOfficers(newOfficers);
            console.log('Выбран сотрудник ТБ:', user);
        }
    };

    const getAllSelectedData = () => {
        return {
            name: areaName,
            foreman: selectedBoss[0] || null,
            safetyOfficers: selectedSafetyOfficers
        };
    };

    const handleSubmit = () => {
        const data = getAllSelectedData();
        console.log('Отправка данных:', data);
        alert('Данные сохранены! Проверьте консоль.');
    };

    const handleReset = () => {
        setAreaName('');
        setSelectedBoss([]);
        setSelectedSafetyOfficers([]);
        setBossDropdownKey(prev => prev + 1);
        setOfficerDropdownKey(prev => prev + 1);
    };

    return (
        <div className="area-create-update-region">
            <div className="area-create-update-region__card">
                <div className="area-create-update-region__section">
                    <InlineTextInputField 
                        label="Название зоны"
                        placeholder="например: Северная площадка"
                        value={areaName}
                        onChange={handleAreaNameChange}
                        width="100%"
                        required={true}
                    />
                </div>

                <div className="area-create-update-region__section">
                    <label className="area-create-update-region__label">Бригадир</label>
                    <DropDownMenu 
                        key={bossDropdownKey}
                        type="user"
                        endpoint="/api/users?role=FOREMAN"
                        onSelect={handleBossSelect}
                        placeholder="Поиск по ФИО или email..."
                    />
                    <ChipsArea 
                        type="user"
                        items={selectedBoss}
                        onItemsChange={setSelectedBoss}
                        maxSelections={1}
                    />
                </div>

                <div className="area-create-update-region__section">
                    <label className="area-create-update-region__label">Сотрудники отдела ТБ</label>
                    <DropDownMenu 
                        key={officerDropdownKey}
                        type="user"
                        endpoint="/api/users?role=SAFETY_OFFICER"
                        onSelect={handleSafetyOfficerSelect}
                        placeholder="Поиск по ФИО или email..."
                    />
                    <ChipsArea 
                        type="user"
                        items={selectedSafetyOfficers}
                        onItemsChange={setSelectedSafetyOfficers}
                        maxSelections={null}
                    />
                </div>

                <div className="area-create-update-region__actions">
                    <ActionButton
                        onClick={handleSubmit}
                        backgroundColor="var(--button-yellow)"
                        textColor="var(--button-text-dark)"
                    >
                        Создать
                    </ActionButton>
                    <ActionButton
                        onClick={handleReset}
                        backgroundColor="var(--background-input)"
                        textColor="var(--text-secondary)"
                    >
                        Отмена
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}