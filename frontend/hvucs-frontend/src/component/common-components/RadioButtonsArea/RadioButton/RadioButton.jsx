import './RadioButton.css';

export default function RadioButton({ label, value, color, selected = false, onChange, name = 'radio-group' }) {
    
    const handleChange = () => {
        if (onChange) {
            onChange(value);
        }
    };
    
    return (
        <label className="radio-button">
            <input
                type="radio"
                name={name}
                value={value}
                checked={selected}
                onChange={handleChange}
                className="radio-input"
            />
            <span className="radio-custom"></span>
            <span className="radio-label" style={{ color: color }}>
                {label}
            </span>
        </label>
    );
}