import { useState, forwardRef, useImperativeHandle } from 'react';
import './RadioButtonsArea.css';
import RadioButton from './RadioButton/RadioButton.jsx';

const RadioButtonsArea = forwardRef(({ label, options = [] }, ref) => {
    const [selectedValue, setSelectedValue] = useState(null);
    
    const handleRadioChange = (value) => {
        // Если выбран тот же радио-кнопка - снимаем выбор
        if (selectedValue === value) {
            setSelectedValue(null);
        } else {
            setSelectedValue(value);
        }
    };
    
    useImperativeHandle(ref, () => ({
        getSelectedValue: () => selectedValue,
        setSelectedValue: (value) => setSelectedValue(value),
        clear: () => setSelectedValue(null)
    }));
    
    return (
        <div className="radio-buttons-area">
            <div className="radio-area-label">{label}</div>
            <div className="radio-buttons-group">
                {options.map((option, index) => (
                    <RadioButton
                        key={index}
                        label={option.label}
                        value={option.value}
                        color={option.color}
                        selected={selectedValue === option.value}
                        onChange={handleRadioChange}
                        name="interpretation-group"
                    />
                ))}
            </div>
        </div>
    );
});

RadioButtonsArea.displayName = 'RadioButtonsArea';

export default RadioButtonsArea;