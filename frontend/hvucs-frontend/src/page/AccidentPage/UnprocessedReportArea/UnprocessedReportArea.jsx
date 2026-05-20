import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './UnprocessedReportArea.css';

import BigTextInputField from '../../../component/common-components/BigTextInputField/BigTextInputField.jsx';
import RadioButtonArea from '../../../component/common-components/RadioButtonsArea/RadioButtonsArea.jsx';
import ActionButton from '../../../component/common-components/ActionButton/ActionButton.jsx';
import ProgressLoader from '../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import ModalWindow from '../../../component/common-components/ModalWindow/ModalWindow.jsx';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js';

export default function UnprocessedReportArea({ label, children }) {
    const { id } = useParams();
    const descriptionRef = useRef(null);
    const radioAreaRef = useRef(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const showErrorModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };
    
    const handleSubmit = async () => {
        // Получаем выбранное значение radio button
        const selectedInterpretation = radioAreaRef.current?.getSelectedValue();
        
        // Валидация: проверяем, выбран ли radio button
        if (!selectedInterpretation) {
            showErrorModal('Пожалуйста, выберите интерпретацию инцидента');
            return;
        }
        
        // Получаем описание из текстового поля
        const description = descriptionRef.current?.getValue() || null;
        
        // Формируем данные для отправки
        const reportData = {
            type: "NO_HI_VIS_VEST_APPLIED",
            interpretation: selectedInterpretation,
            description: description
        };
        
        // Запускаем лоадер
        setIsLoading(true);
        
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(`/api/reports/accident/${id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reportData)
                });
                
                let data = null;
                try {
                    data = await response.json();
                } catch (e) {
                    data = null;
                }
                
                return { status: response.status, data: data };
            });
            
            // Обработка успешного ответа
            if (result.status === 200) {
                window.location.href = '/notifications';
            } else {
                // Отображаем ошибку от сервера
                const errorMessage = result.data?.message || result.data?.error || 'Произошла ошибка при обработке инцидента';
                showErrorModal(errorMessage);
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            showErrorModal('Не удалось подключиться к серверу. Проверьте соединение.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Опции для radio buttons
    const radioOptions = [
        { label: "Предположение модели подтверждено", value: "REAL_ALARM", color: "#ef5350" },
        { label: "Ложное срабатывание", value: "FALSE_ALARM", color: "#4caf50" }
    ];
    
    return (
        <>
            <div className="unprocessed-report-area">
                <div className="unprocessed-report-label">{label}</div>
                
                <div className="unprocessed-report-content">
                    <BigTextInputField
                        ref={descriptionRef}
                        name="Описание инцидента:"
                        width="100%"
                        height="120px"
                        placeholder="Введите отчёт по инциденту..."
                    />
                    
                    <RadioButtonArea
                        ref={radioAreaRef}
                        label="Интерпретация инцидента:"
                        options={radioOptions}
                    />
                    
                    <div className="unprocessed-report-actions">
                        <ActionButton 
                            onClick={handleSubmit}
                            width="auto"
                        >
                            Обработать инцидент
                        </ActionButton>
                    </div>
                </div>
            </div>
            
            {isLoading && <ProgressLoader message="Отправка отчёта..." />}
            
            <ModalWindow 
                message={modalMessage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}