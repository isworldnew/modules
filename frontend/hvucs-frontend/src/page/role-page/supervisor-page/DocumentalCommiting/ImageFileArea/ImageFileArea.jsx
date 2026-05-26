import './ImageFileArea.css';
import { useState, useRef } from 'react';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';

export default function ImageFileArea({ responseId }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

    const showErrorModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const validateFile = (file) => {
        if (!allowedTypes.includes(file.type)) {
            showErrorModal('Неподдерживаемый формат файла. Пожалуйста, загрузите изображение в формате JPEG, PNG, GIF, WEBP или BMP.');
            return false;
        }
        return true;
    };

    const handleFileSelect = (file) => {
        if (file && validateFile(file)) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleClearImage = () => {
        setSelectedImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadDocument = async () => {
        if (!selectedFile) {
            showErrorModal('Пожалуйста, выберите изображение для загрузки');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('responseId', responseId);
        formData.append('document', selectedFile);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch('/api/documents/document', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData
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
                window.location.href = '/archive';
            } else {
                const errorMessage = result.data?.message || result.data?.error || 'Произошла ошибка при загрузке документа';
                showErrorModal(errorMessage);
                setIsUploading(false);
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            showErrorModal('Не удалось подключиться к серверу');
            setIsUploading(false);
        }
    };

    return (
        <div className="image-file-area">
            <div className="image-file-area__label">Приложить фото нарушения (необязательно)</div>
            
            {!selectedImage ? (
                <div 
                    className="image-file-area__dropzone"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleButtonClick}
                >
                    <div className="dropzone__text">Перетащите изображение сюда или нажмите для выбора</div>
                    <div className="dropzone__hint">Поддерживаются форматы: JPEG, PNG, GIF, WEBP, BMP</div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : (
                <div className="image-file-area__preview">
                    <div className="preview__container">
                        <img src={selectedImage} alt="Предпросмотр" className="preview__image" />
                        <button className="preview__clear" onClick={handleClearImage} title="Удалить изображение">
                            ✕
                        </button>
                    </div>
                </div>
            )}
            
            <div className="image-file-area__upload">
                <ActionButton 
                    onClick={handleUploadDocument} 
                    width="auto"
                    disabled={isUploading}
                >
                    {isUploading ? 'Загрузка...' : 'Загрузить документ'}
                </ActionButton>
            </div>
            
            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
            
            {isUploading && <ProgressLoader message="Загрузка документа..." />}
        </div>
    );
}