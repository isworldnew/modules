import './AreaCreateUpdateRegion.css';
import { useState } from 'react';
import DropDownMenu from '../DropDownMenu/DropDownMenu.jsx';
import ChipsArea from '../Chips/ChipsArea/ChipsArea.jsx';
import ActionButton from '../ActionButton/ActionButton';
import InlineTextInputField from '../InlineTextInputField/InlineTextInputField.jsx';
import ModalWindow from '../../common-components/ModalWindow/ModalWindow.jsx';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js';

export default function AreaCreateUpdateRegion() {
    const [areaName, setAreaName] = useState('');
    const [selectedBoss, setSelectedBoss] = useState([]);
    const [selectedSafetyOfficers, setSelectedSafetyOfficers] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateForm = () => {
        const trimmedName = areaName?.trim();
        const hasName = trimmedName && trimmedName !== '';
        const hasBoss = selectedBoss.length > 0;
        const hasSafetyOfficers = selectedSafetyOfficers.length > 0;

        if (!hasName) {
            setModalMessage('Пожалуйста, заполните название зоны');
            return false;
        }

        if (hasBoss && hasSafetyOfficers) {
            return true;
        }

        if (hasBoss && !hasSafetyOfficers) {
            setModalMessage('Пожалуйста, выберите сотрудников отдела ТБ');
            return false;
        }

        if (!hasBoss && hasSafetyOfficers) {
            setModalMessage('Пожалуйста, выберите бригадира');
            return false;
        }

        if (!hasBoss && !hasSafetyOfficers) {
            return true;
        }

        return true;
    };

    const getSubmitData = () => {
        return {
            name: areaName?.trim() || '',
            foremanId: selectedBoss[0]?.id || null,
            safetyOfficersId: selectedSafetyOfficers.length > 0 
                ? selectedSafetyOfficers.map(officer => officer.id) 
                : null
        };
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setIsModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        const data = getSubmitData();

        try {
            const response = await executeWithTokenRefresh(async (accessToken) => {
                const fetchResponse = await fetch('/api/areas/area', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                let responseData = null;
                try {
                    responseData = await fetchResponse.json();
                } catch (e) {
                    responseData = null;
                }
                
                return {
                    status: fetchResponse.status,
                    data: responseData
                };
            });

            if (response.status === 201) {
                const areaId = response.data;
                window.location.href = `/areas/area/${areaId}`;
            } else if (response.status === 409) {
                setModalMessage('Такое имя зоны уже используется');
                setIsModalOpen(true);
            } else {
                setModalMessage('Произошла ошибка при создании зоны');
                setIsModalOpen(true);
            }
        } catch (err) {
            console.error('Error creating area:', err);
            setModalMessage('Произошла ошибка при создании зоны');
            setIsModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setAreaName('');
        setSelectedBoss([]);
        setSelectedSafetyOfficers([]);
        setBossDropdownKey(prev => prev + 1);
        setOfficerDropdownKey(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
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
                        disabled={isSubmitting}
                    />
                </div>

                <div className="area-create-update-region__section">
                    <label className="area-create-update-region__label">Бригадир</label>
                    <DropDownMenu 
                        key={bossDropdownKey}
                        type="user"
                        endpoint="/api/users?role=FOREMAN"
                        onSelect={handleBossSelect}
                        placeholder="Выберите бригадира (прораба)"
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
                        placeholder="Выберите сотрудника отдела ТБ"
                    />
                    <ChipsArea 
                        type="user"
                        items={selectedSafetyOfficers}
                        onItemsChange={setSelectedSafetyOfficers}
                        maxSelections={1}
                    />
                </div>

                <div className="area-create-update-region__actions">
                    <ActionButton
                        onClick={handleSubmit}
                        backgroundColor="var(--button-yellow)"
                        textColor="var(--button-text-dark)"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Создание...' : 'Создать'}
                    </ActionButton>
                    <ActionButton
                        onClick={handleReset}
                        backgroundColor="var(--background-input)"
                        textColor="var(--text-secondary)"
                        disabled={isSubmitting}
                    >
                        Отмена
                    </ActionButton>
                </div>
            </div>

            <ModalWindow 
                message={modalMessage}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}