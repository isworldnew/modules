import { useState } from 'react';
import './InlineTextInputField.css';

export default function InlineTextInputField({
    label,           // название поля (надпись над input)
    type = 'text',   // тип: 'text', 'email', 'password'
    placeholder = '', // фоновый текст-подсказка
    value = '',      // значение извне (controlled component)
    onChange,        // колбэк при изменении значения
    width = '100%',  // ширина поля
    required = false, // только для отображения звездочки
    disabled = false,
    autoFocus = false,
    name = ''
}) {
    const [internalValue, setInternalValue] = useState(value);
    
    // Используем либо внешнее управление (controlled), либо внутреннее (uncontrolled)
    const isControlled = onChange !== undefined;
    const currentValue = isControlled ? value : internalValue;
    
    const handleChange = (e) => {
        const newValue = e.target.value;
        
        if (!isControlled) {
            setInternalValue(newValue);
        }
        
        if (onChange) {
            onChange(newValue);
        }
    };
    
    // Для пароля используем password, для всего остального - text (чтобы не было браузерной валидации)
    const getInputType = () => {
        if (type === 'password') {
            return 'password';
        }
        return 'text';
    };
    
    return (
        <div className="inline-text-input-field" style={{ width }}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="required-star"> *</span>}
                </label>
            )}
            <input
                type={getInputType()}
                className="input-field"
                placeholder={placeholder}
                value={currentValue}
                onChange={handleChange}
                disabled={disabled}
                autoFocus={autoFocus}
                name={name}
            />
        </div>
    );
}