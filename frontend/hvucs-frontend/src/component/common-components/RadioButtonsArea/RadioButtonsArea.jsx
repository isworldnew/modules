import { useState, useEffect } from 'react';
import './RadioButtonsArea.css';
import RadioButton from './RadioButton/RadioButton.jsx';

export default function RadioButtonsArea({ label, options = [] }) {
    const [selectedValue, setSelectedValue] = useState(null);
    
    const handleRadioChange = (value) => {
        // Если выбран тот же радио-кнопка - снимаем выбор
        if (selectedValue === value) {
            setSelectedValue(null);
        } else {
            setSelectedValue(value);
        }
    };
    
    const getSelectedValue = () => selectedValue;
    
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
}