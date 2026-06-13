import './TrespasserRegistrationArea.css';

import {
    useState,
    useRef,
    forwardRef,
    useImperativeHandle
} from 'react';

import InlineTextInputField from '../../../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../../../component/common-components/ActionButton/ActionButton.jsx';
import RadioButtonsArea from '../../../../../../../component/common-components/RadioButtonsArea/RadioButtonsArea.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TrespasserRegistrationArea = forwardRef(
    ({ isExpanded, onToggle }, ref) => {

        const [name, setName] = useState('');
        const [post, setPost] = useState('');
        const [email, setEmail] = useState('');

        const nameRef = useRef(null);
        const postRef = useRef(null);
        const emailRef = useRef(null);
        const radioRef = useRef(null);

        const radioOptions = [
            {
                label: 'Внутренний сотрудник',
                value: 'INNER_EMPLOYEE',
                color: '#b71c1c'
            },
            {
                label: 'Сотрудник внешней организации',
                value: 'OUTER_EMPLOYEE',
                color: '#b71c1c'
            }
        ];

        const handleClear = () => {
            setName('');
            setPost('');
            setEmail('');

            nameRef.current?.clear();
            postRef.current?.clear();
            emailRef.current?.clear();
            radioRef.current?.clear();
        };

        const validateEmail = () => {
            return EMAIL_REGEX.test(email?.trim());
        };

        useImperativeHandle(ref, () => ({
            handleClear,

            getData() {
                return {
                    name,
                    post,
                    email,
                    relation: radioRef.current?.getSelectedValue() || null
                };
            },

            validateEmail
        }));

        if (!isExpanded) {
            return (
                <div className="trespasser-registration-area collapsed">
                    <div className="trespasser-registration-header" onClick={onToggle}>
                        <span className="trespasser-registration-title">
                            Регистрация нарушителя
                        </span>
                        <span className="trespasser-registration-icon">▼</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="trespasser-registration-area expanded">

                <div className="trespasser-registration-header" onClick={onToggle}>
                    <span className="trespasser-registration-title">
                        Регистрация нарушителя
                    </span>
                    <span className="trespasser-registration-icon">▲</span>
                </div>

                <div className="trespasser-registration-content">

                    <div className="trespasser-registration-field">
                        <label className="trespasser-registration-field-label">
                            Имя сотрудника
                        </label>
                        <InlineTextInputField
                            ref={nameRef}
                            width="100%"
                            value={name}
                            onChange={setName}
                            placeholder="ФИО"
                        />
                    </div>

                    <div className="trespasser-registration-field">
                        <label className="trespasser-registration-field-label">
                            Должность
                        </label>
                        <InlineTextInputField
                            ref={postRef}
                            width="100%"
                            value={post}
                            onChange={setPost}
                            placeholder="Должность"
                        />
                    </div>

                    <RadioButtonsArea
                        ref={radioRef}
                        name="employee-relation"
                        label="Тип сотрудника"
                        options={radioOptions}
                    />

                    <div className="trespasser-registration-field">
                        <label className="trespasser-registration-field-label">
                            Email
                        </label>

                        <InlineTextInputField
                            ref={emailRef}
                            type="email"
                            width="100%"
                            value={email}
                            onChange={setEmail}
                            placeholder="example@company.com"
                        />
                    </div>

                    <div className="trespasser-registration-actions">
                        <ActionButton onClick={handleClear} variant="secondary">
                            Очистить
                        </ActionButton>
                    </div>

                </div>
            </div>
        );
    }
);

TrespasserRegistrationArea.displayName = 'TrespasserRegistrationArea';

export default TrespasserRegistrationArea;