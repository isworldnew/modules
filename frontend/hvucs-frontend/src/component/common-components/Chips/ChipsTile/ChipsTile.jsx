import './ChipsTile.css';

export default function ChipsTile({ type, data, onRemove }) {
    const getDisplayValue = () => {
        if (type === 'area') {
            return data.name;
        } else if (type === 'user') {
            const parts = [
                data.lastname,
                data.firstname,
                data.parentname
            ].filter(part => part && part.trim() !== '');
            const fullName = parts.join(' ');
            return `${fullName} (${data.username})`;
        }
        return '';
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(data.id);
        }
    };

    return (
        <div className="chips-tile">
            <span className="chips-tile__text">{getDisplayValue()}</span>
            <button 
                type="button" 
                className="chips-tile__remove"
                onClick={handleRemove}
            >
                ×
            </button>
        </div>
    );
}