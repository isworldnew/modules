import { useState } from 'react';
import './LoginForm.css';

import InlineTextInputField from '../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../component/common-components/ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../../component/common-components/ProgressLoader/ProgressLoader.jsx';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const validatePassword = (password) => {
        return password.length >= 8;
    };
    
    const showErrorModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            showErrorModal('Пожалуйста, введите электронную почту');
            return;
        }
        
        if (!validateEmail(email)) {
            showErrorModal('Пожалуйста, введите корректный адрес электронной почты\nПример: user@example.com');
            return;
        }
        
        if (!password.trim()) {
            showErrorModal('Пожалуйста, введите пароль');
            return;
        }
        
        if (!validatePassword(password)) {
            showErrorModal('Пароль должен содержать не менее 8 символов');
            return;
        }
        
        setIsLoading(true);
        
        const loginData = {
            username: email,
            password: password
        };
        
        try {
            const response = await fetch('http://localhost:8888/authentication/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });
            
            if (response.status === 201) {
                const data = await response.json();
                
                if (data.accessToken && data.refreshToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    console.log('Токены успешно сохранены в localStorage');
                } else {
                    console.error('Токены не найдены в ответе сервера');
                    showErrorModal('Ошибка при получении токенов доступа');
                    setIsLoading(false);
                    return;
                }
                
                window.location.href = '/';
            } else if (response.status === 403) {
                showErrorModal('Неправильно введён логин или пароль');
            } else {
                showErrorModal('Произошла ошибка при входе. Пожалуйста, попробуйте позже.');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            showErrorModal('Не удалось подключиться к серверу. Проверьте соединение.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLoginClick = () => {
        const form = document.getElementById('login-form');
        if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };
    
    return (
        <>
            <div className="login-card">
                <h2 className="login-title">Вход в систему</h2>
                
                <form id="login-form" className="login-form" onSubmit={handleSubmit}>
                    <div className="form-fields">
                        <InlineTextInputField
                            label="Электронная почта"
                            type="email"
                            placeholder="ivanov@example.com"
                            value={email}
                            onChange={setEmail}
                            width="100%"
                            required
                            autoFocus
                        />
                        
                        <InlineTextInputField
                            label="Пароль"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={setPassword}
                            width="100%"
                            required
                        />
                    </div>
                    
                    <div className="form-actions">
                        <ActionButton 
                            onClick={handleLoginClick}
                            width="100%"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </ActionButton>
                    </div>
                </form>
            </div>
            
            <ModalWindow 
                message={modalMessage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            
            {isLoading && <ProgressLoader message="Выполняется вход..." />}
        </>
    );
}