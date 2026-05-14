import './AreaCreationRegion.css';
import { useState, useRef } from 'react';
import InlineTextInputField from '../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import DropDownMenu from '../../../../../component/common-components/DropDownMenu/DropDownMenu.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';

export default function AreaCreationRegion() {
    const [areaName, setAreaName] = useState('');
    const [selectedForeman, setSelectedForeman] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const openModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const handleForemanSelect = (user) => {
        setSelectedForeman(user);
        console.log('Выбран бригадир:', user);
    };

    const handleSubmit = async () => {
        if (!areaName.trim()) {
            openModal('Введите название зоны');
            return;
        }
        if (!selectedForeman) {
            openModal('Выберите бригадира из списка');
            return;
        }

        const requestData = {
            foremanId: selectedForeman.id,
            name: areaName.trim()
        };

        setIsLoading(true);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch('/api/areas/area', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });

                let data = null;
                try {
                    data = await response.json();
                } catch (e) {
                    data = null;
                }

                return { status: response.status, data: data };
            });

            if (result.status === 201) {
                window.location.reload();
            } else if (result.status === 409) {
                openModal('Зона с данным названием уже существует');
                setIsLoading(false);
            } else {
                openModal('Произошла ошибка при создании зоны');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error creating area:', error);
            openModal('Не удалось подключиться к серверу');
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setAreaName('');
        setSelectedForeman(null);
    };

    return (
        <div className="area-creation-region">
            <div className="area-creation-card">
                <h3 className="area-creation-title">Создание новой зоны</h3>
                <div className="area-creation-form">
                    <div className="form-group">
                        <label htmlFor="area-name">Название зоны</label>
                        <InlineTextInputField
                            id="area-name"
                            name="areaName"
                            width="100%"
                            placeholder="например: Северная площадка"
                            value={areaName}
                            onChange={setAreaName}
                        />
                    </div>

                    <div className="form-group">
                        <label>Бригадир</label>
                        <DropDownMenu
                            type="user"
                            endpoint="/api/users/free-foremans"
                            onSelect={handleForemanSelect}
                            placeholder="Выберите бригадира..."
                        />
                    </div>

                    <div className="area-creation-actions">
                        <ActionButton onClick={handleSubmit} width="auto" disabled={isLoading}>
                            {isLoading ? 'Создание...' : 'Создать'}
                        </ActionButton>
                    </div>
                </div>
            </div>

            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
            
            {isLoading && <ProgressLoader message="Создание зоны..." />}
        </div>
    );
}