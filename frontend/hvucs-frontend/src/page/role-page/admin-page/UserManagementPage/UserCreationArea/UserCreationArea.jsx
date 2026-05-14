import './UserCreationArea.css';
import { useState, useRef } from 'react';
import InlineTextInputField from '../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../component/common-components/ActionButton/ActionButton.jsx';
import ModalWindow from '../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import { executeWithTokenRefresh } from '../../../../../script/executeWithTokenRefresh.js';

export default function UserCreationArea() {
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [parentname, setParentname] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(null);
    const [password, setPassword] = useState('0123456789');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const lastnameRef = useRef(null);
    const firstnameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const openModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const copyPassword = () => {
        const passwordInput = document.querySelector('.user-creation-password-field input');
        if (passwordInput) {
            passwordInput.select();
            document.execCommand('copy');
            openModal('Пароль скопирован в буфер обмена');
        }
    };

    const handleSubmit = async () => {
        if (!lastname.trim()) {
            openModal('Введите фамилию');
            return;
        }

        if (!firstname.trim()) {
            openModal('Введите имя');
            return;
        }

        if (!email.trim()) {
            openModal('Введите электронную почту');
            return;
        }

        if (!validateEmail(email.trim())) {
            openModal('Введите корректный адрес электронной почты');
            return;
        }

        if (email.trim().length < 8) {
            openModal('Email должен содержать не менее 8 символов');
            return;
        }

        if (!role) {
            openModal('Выберите роль');
            return;
        }

        if (!password.trim()) {
            openModal('Введите пароль');
            return;
        }

        if (password.trim().length < 8) {
            openModal('Пароль должен содержать не менее 8 символов');
            return;
        }

        const requestData = {
            username: email.trim(),
            password: password.trim(),
            role: role,
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            parentname: parentname.trim() || null
        };

        setIsLoading(true);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch('/api/users/user', {
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
                openModal('Данный логин уже используется');
                setIsLoading(false);
            } else {
                openModal('Произошла ошибка при создании пользователя');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            openModal('Не удалось подключиться к серверу');
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setLastname('');
        setFirstname('');
        setParentname('');
        setEmail('');
        setRole(null);
        setPassword('0123456789');
        
        if (lastnameRef.current?.clear) lastnameRef.current.clear();
        if (firstnameRef.current?.clear) firstnameRef.current.clear();
        if (emailRef.current?.clear) emailRef.current.clear();
        if (passwordRef.current?.clear) passwordRef.current.clear();
    };

    const roleOptions = [
        { value: 'SAFETY_OFFICER', label: 'Сотрудник отдела ТБ' },
        { value: 'FOREMAN', label: 'Бригадир' },
        { value: 'SUPERVISOR', label: 'Начальник' }
    ];

    return (
        <div className="user-creation-area">
            <div className="user-creation-card">
                <h3 className="user-creation-card-title">Новый пользователь</h3>
                
                <div className="user-creation-form">
                    <div className="user-creation-form-row">
                        <div className="user-creation-form-group">
                            <label className="user-creation-label">Фамилия</label>
                            <InlineTextInputField
                                ref={lastnameRef}
                                name=""
                                width="100%"
                                placeholder="Введите фамилию"
                                value={lastname}
                                onChange={setLastname}
                            />
                        </div>
                        <div className="user-creation-form-group">
                            <label className="user-creation-label">Имя</label>
                            <InlineTextInputField
                                ref={firstnameRef}
                                name=""
                                width="100%"
                                placeholder="Введите имя"
                                value={firstname}
                                onChange={setFirstname}
                            />
                        </div>
                        <div className="user-creation-form-group">
                            <label className="user-creation-label">Отчество</label>
                            <InlineTextInputField
                                name=""
                                width="100%"
                                placeholder="Введите отчество (необязательно)"
                                value={parentname}
                                onChange={setParentname}
                            />
                        </div>
                    </div>

                    <div className="user-creation-form-group">
                        <label className="user-creation-label">Электронная почта (логин)</label>
                        <InlineTextInputField
                            ref={emailRef}
                            name=""
                            type="email"
                            width="100%"
                            placeholder="example@company.com"
                            value={email}
                            onChange={setEmail}
                        />
                    </div>

                    <div className="user-creation-form-row">
                        <div className="user-creation-form-group">
                            <label className="user-creation-label">Роль</label>
                            <div className="user-creation-role-buttons">
                                {roleOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`role-btn ${role === option.value ? 'active' : ''}`}
                                        onClick={() => setRole(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="user-creation-form-group">
                        <label className="user-creation-label">Временный пароль</label>
                        <div className="user-creation-password-field">
                            <InlineTextInputField
                                ref={passwordRef}
                                name=""
                                width="100%"
                                placeholder="Пароль"
                                value={password}
                                onChange={setPassword}
                            />
                            <button type="button" className="user-creation-copy-btn" onClick={copyPassword}>
                                Копировать
                            </button>
                        </div>
                    </div>

                    <div className="user-creation-form-actions">
                        <ActionButton onClick={handleSubmit} width="auto">
                            Сохранить
                        </ActionButton>
                        <ActionButton onClick={handleClear} width="auto" variant="secondary">
                            Очистить
                        </ActionButton>
                    </div>
                </div>
            </div>

            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
            {isLoading && <ProgressLoader message="Сохранение пользователя..." />}
        </div>
    );
}