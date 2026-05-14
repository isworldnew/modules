import './RadioButton.css';

export default function RadioButton({
    label,
    value,
    color,
    selected,
    onChange,
    name
}) {
    return (
        <label className="radio-button">

            <input
                type="radio"
                name={name}
                checked={selected}
                onChange={() => onChange(value)}
            />

            <span className="radio-custom" />

            <span
                className="radio-label"
                style={{ color }}
            >
                {label}
            </span>

        </label>
    );
}