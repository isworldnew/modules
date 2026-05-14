import './CameraCreationArea.css';
import { useState } from 'react';
import InlineTextInputField from '../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import DropDownMenu from '../../../../../component/common-components/DropDownMenu/DropDownMenu.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';

export default function CameraCreationArea() {
    const [cameraName, setCameraName] = useState('');
    const [selectedArea, setSelectedArea] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const openModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const handleAreaSelect = (area) => {
        setSelectedArea(area);
        console.log('Выбрана зона:', area);
    };

    const handleSubmit = async () => {
        if (!selectedArea) {
            openModal('Выберите зону из списка');
            return;
        }

        const requestData = {
            areaId: selectedArea.areaId,
            name: cameraName.trim() || null
        };

        setIsLoading(true);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch('/api/cameras/camera', {
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
                openModal('Камера с данным названием уже существует в этой зоне');
                setIsLoading(false);
            } else {
                openModal('Произошла ошибка при создании камеры');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error creating camera:', error);
            openModal('Не удалось подключиться к серверу');
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setCameraName('');
        setSelectedArea(null);
    };

    return (
        <div className="camera-creation-area">
            <div className="camera-creation-card">
                <h3 className="camera-creation-title">Добавление новой камеры</h3>
                <div className="camera-creation-form">
                    <div className="form-group">
                        <label htmlFor="camera-name">Название камеры (необязательно)</label>
                        <InlineTextInputField
                            id="camera-name"
                            name="cameraName"
                            width="100%"
                            placeholder="например: Камера 1"
                            value={cameraName}
                            onChange={setCameraName}
                        />
                    </div>

                    <div className="form-group">
                        <label>Зона</label>
                        <DropDownMenu
                            type="area"
                            endpoint="/api/areas"
                            onSelect={handleAreaSelect}
                            placeholder="Выберите зону..."
                        />
                    </div>

                    <div className="camera-creation-actions">
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
            
            {isLoading && <ProgressLoader message="Создание камеры..." />}
        </div>
    );
}