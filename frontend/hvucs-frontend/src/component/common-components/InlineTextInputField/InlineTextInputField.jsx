import { useState } from 'react';
import './InlineTextInputField.css';

export default function InlineTextInputField({
    label,
    type = 'text',
    placeholder = '',
    value = '',
    onChange,
    width = '100%',
    required = false,
    disabled = false,
    autoFocus = false,
    name = ''
}) {
    const [internalValue, setInternalValue] = useState(value);
    
    const isControlled = onChange !== undefined;
    const currentValue = isControlled ? value : internalValue;
    
    const applyDateMask = (inputValue) => {
        let cleaned = inputValue.replace(/\D/g, '');
        
        if (cleaned.length > 8) {
            cleaned = cleaned.slice(0, 8);
        }
        
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
    
    const getInputType = () => {
        if (type === 'password') {
            return 'password';
        }
        return 'text';
    };
    
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