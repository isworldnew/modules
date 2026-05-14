import './TrespasserRegistrationArea.css';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import InlineTextInputField from '../../../../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../../../../component/common-components/ActionButton/ActionButton.jsx';
import RadioButtonsArea from '../../../../../../../component/common-components/RadioButtonsArea/RadioButtonsArea.jsx';

const TrespasserRegistrationArea = forwardRef(({ isExpanded, onToggle }, ref) => {
    const [fullName, setFullName] = useState('');
    const [position, setPosition] = useState('');
    const [email, setEmail] = useState('');
    const fullNameRef = useRef(null);
    const positionRef = useRef(null);
    const emailRef = useRef(null);
    const radioAreaRef = useRef(null);

    const radioOptions = [
        { label: "Внутренний сотрудник", value: "INTERNAL", color: "#ef5350" },
        { label: "Сотрудник внешней организации", value: "EXTERNAL", color: "#ef5350" }
    ];

    const handleClear = () => {
        setFullName('');
        setPosition('');
        setEmail('');
        if (fullNameRef.current?.clear) fullNameRef.current.clear();
        if (positionRef.current?.clear) positionRef.current.clear();
        if (emailRef.current?.clear) emailRef.current.clear();
        if (radioAreaRef.current?.clear) radioAreaRef.current.clear();
    };

    useImperativeHandle(ref, () => ({
        handleClear
    }));

    if (!isExpanded) {
        return (
            <div className="trespasser-registration-area collapsed">
                <div className="trespasser-registration-header" onClick={onToggle}>
                    <span className="trespasser-registration-title">Регистрация нарушителя</span>
                    <span className="trespasser-registration-icon">▼</span>
                </div>
            </div>
        );
    }

    return (
        <div className="trespasser-registration-area expanded">
            <div className="trespasser-registration-header" onClick={onToggle}>
                <span className="trespasser-registration-title">Регистрация нарушителя</span>
                <span className="trespasser-registration-icon">▲</span>
            </div>
            <div className="trespasser-registration-content">
                <div className="trespasser-registration-field">
                    <label className="trespasser-registration-field-label">Имя сотрудника</label>
                    <InlineTextInputField
                        ref={fullNameRef}
                        name=""
                        width="100%"
                        placeholder="Введите фамилию, имя, отчество"
                        value={fullName}
                        onChange={(value) => setFullName(value)}
                    />
                </div>
                <div className="trespasser-registration-field">
                    <label className="trespasser-registration-field-label">Должность сотрудника</label>
                    <InlineTextInputField
                        ref={positionRef}
                        name=""
                        width="100%"
                        placeholder="Введите должность"
                        value={position}
                        onChange={(value) => setPosition(value)}
                    />
                </div>
                <RadioButtonsArea
                    ref={radioAreaRef}
                    label="Тип сотрудника"
                    options={radioOptions}
                />
                <div className="trespasser-registration-field">
                    <label className="trespasser-registration-field-label">Электронная почта организации сотрудника</label>
                    <InlineTextInputField
                        ref={emailRef}
                        name=""
                        width="100%"
                        placeholder="example@company.com"
                        value={email}
                        onChange={(value) => setEmail(value)}
                    />
                </div>
                <div className="trespasser-registration-actions">
                    <ActionButton 
                        onClick={handleClear}
                        width="auto"
                        variant="secondary"
                    >
                        Очистить
                    </ActionButton>
                </div>
            </div>
        </div>
    );
});

TrespasserRegistrationArea.displayName = 'TrespasserRegistrationArea';

export default TrespasserRegistrationArea;