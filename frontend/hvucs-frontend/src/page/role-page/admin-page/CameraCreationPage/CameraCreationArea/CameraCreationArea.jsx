import './CameraCreationArea.css';
import { useState, useEffect } from 'react';
import InlineTextInputField from '../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';

export default function CameraCreationArea() {
    const [cameraName, setCameraName] = useState('');
    const [selectedAreaId, setSelectedAreaId] = useState('');
    const [areas, setAreas] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(true);

    useEffect(() => {
        const fetchAreas = async () => {
            setLoadingAreas(true);
            try {
                const response = await executeWithTokenRefresh(async (accessToken) => {
                    const fetchResponse = await fetch('/api/areas/shortcuts', {
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
                    setAreas(response.data);
                } else {
                    setModalMessage('Не удалось загрузить список зон');
                    setIsModalOpen(true);
                }
            } catch (err) {
                console.error('Error fetching areas:', err);
                setModalMessage('Произошла ошибка при загрузке зон');
                setIsModalOpen(true);
            } finally {
                setLoadingAreas(false);
            }
        };
        
        fetchAreas();
    }, []);

    const handleCameraNameChange = (value) => {
        setCameraName(value);
    };

    const handleAreaChange = (e) => {
        setSelectedAreaId(e.target.value);
    };

    const getSubmitData = () => {
        return {
            areaId: parseInt(selectedAreaId),
            name: cameraName?.trim() || null
        };
    };

    const handleSubmit = async () => {
        if (!selectedAreaId) {
            setModalMessage('Пожалуйста, выберите зону');
            setIsModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        const data = getSubmitData();

        try {
            const response = await executeWithTokenRefresh(async (accessToken) => {
                const fetchResponse = await fetch('/api/cameras/camera', {
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
                window.location.reload();
            } else if (response.status === 409) {
                setModalMessage('Камера с таким названием уже существует в этой зоне');
                setIsModalOpen(true);
            } else {
                setModalMessage('Произошла ошибка при создании камеры');
                setIsModalOpen(true);
            }
        } catch (err) {
            console.error('Error creating camera:', err);
            setModalMessage('Произошла ошибка при создании камеры');
            setIsModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
    };

    return (
        <div className="camera-creation-area">
            <div className="camera-creation-area__card">
                <div className="camera-creation-area__section">
                    <InlineTextInputField 
                        label="Название камеры"
                        placeholder="[опционально]"
                        value={cameraName}
                        onChange={handleCameraNameChange}
                        width="100%"
                        required={false}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="camera-creation-area__section">
                    <label className="camera-creation-area__label">Зона</label>
                    <select 
                        className="camera-creation-area__select"
                        value={selectedAreaId}
                        onChange={handleAreaChange}
                        disabled={isSubmitting || loadingAreas}
                        required
                    >
                        <option value="" disabled>Выберите зону</option>
                        {areas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="camera-creation-area__actions">
                    <ActionButton
                        onClick={handleSubmit}
                        backgroundColor="var(--button-yellow)"
                        textColor="var(--button-text-dark)"
                        disabled={isSubmitting || loadingAreas || !selectedAreaId}
                    >
                        {isSubmitting ? 'Создание...' : 'Создать'}
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