import './RadioButtonsArea.css';
import { useState, forwardRef, useImperativeHandle } from 'react';
import RadioButton from './RadioButton/RadioButton.jsx';

export default forwardRef(function RadioButtonsArea(
    { label, options = [], name },
    ref
) {
    const [selectedValue, setSelectedValue] = useState(null);

    useImperativeHandle(ref, () => ({
        getSelectedValue: () => selectedValue,
        clear: () => setSelectedValue(null)
    }));

    return (
        <div className="radio-buttons-area">

            {label && (
                <div className="radio-area-label">
                    {label}
                </div>
            )}

            <div className="radio-buttons-group">
                {options.map(opt => (
                    <RadioButton
                        key={opt.value}
                        name={name}
                        label={opt.label}
                        value={opt.value}
                        color={opt.color}
                        selected={selectedValue === opt.value}
                        onChange={setSelectedValue}
                    />
                ))}
            </div>

        </div>
    );
});