import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import './BigTextInputField.css';

const BigTextInputField = forwardRef(({ name, width = '100%', height = '120px', placeholder = '' }, ref) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);
    
    useImperativeHandle(ref, () => ({
        getValue: () => value,
        setValue: (newValue) => setValue(newValue),
        clear: () => setValue('')
    }));
    
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    
    return (
        <div className="big-text-input-field" style={{ width }}>
            <label className="input-field-label">{name}</label>
            <textarea
                ref={textareaRef}
                className="input-field-textarea"
                style={{ height }}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
});

BigTextInputField.displayName = 'BigTextInputField';

export default BigTextInputField;