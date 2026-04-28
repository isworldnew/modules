import { useState } from 'react';
import './InlineTextInputField.css';

export default function InlineTextInputField({
    label,           // название поля (надпись над input)
    type = 'text',   // тип: 'text', 'email', 'password', 'date'
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
    
    // Функция для применения маски даты
    const applyDateMask = (inputValue) => {
        // Удаляем все нецифровые символы
        let cleaned = inputValue.replace(/\D/g, '');
        
        // Ограничиваем длину 8 символами (ДДММГГГГ)
        if (cleaned.length > 8) {
            cleaned = cleaned.slice(0, 8);
        }
        
        // Применяем маску
        let formatted = '';
        for (let i = 0; i < cleaned.length; i++) {
            if (i === 2 || i === 4) {
                formatted += '/';
            }
            formatted += cleaned[i];
        }
        
        return formatted;
    };
    
    const handleChange = (e) => {
        let newValue = e.target.value;
        
        // Если это поле с типом date, применяем маску
        if (type === 'date') {
            newValue = applyDateMask(newValue);
        }
        
        if (!isControlled) {
            setInternalValue(newValue);
        }
        
        if (onChange) {
            onChange(newValue);
        }
    };
    
    // Для пароля используем password, для всего остального - text
    const getInputType = () => {
        if (type === 'password') {
            return 'password';
        }
        return 'text';
    };
    
    // Проверяем, нужно ли применять маску для даты
    const isDateType = type === 'date';
    
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
                className={`input-field ${isDateType ? 'date-mask' : ''}`}
                placeholder={isDateType ? 'ДД/ММ/ГГГГ' : placeholder}
                value={currentValue}
                onChange={handleChange}
                disabled={disabled}
                autoFocus={autoFocus}
                name={name}
                maxLength={isDateType ? 10 : undefined}
            />
        </div>
    );
}