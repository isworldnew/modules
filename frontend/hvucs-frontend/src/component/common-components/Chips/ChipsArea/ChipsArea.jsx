import './ChipsArea.css';
import ChipsTile from '../ChipsTile/ChipsTile.jsx';
import { useState, useEffect } from 'react';

export default function ChipsArea({ 
    type, 
    items = [], 
    onItemsChange,
    maxSelections = null 
}) {
    const [chips, setChips] = useState(items);

    useEffect(() => {
        setChips(items);
    }, [items]);

    useEffect(() => {
        if (onItemsChange) {
            onItemsChange(chips);
        }
    }, [chips, onItemsChange]);

    const removeChip = (itemId) => {
        if (maxSelections === 1) {
            setChips([]);
        } else {
            setChips(chips.filter(chip => chip.id !== itemId));
        }
    };

    return (
        <div className="chips-area">
            <div className="chips-area__container">
                {chips.length === 0 && (
                    <div className="chips-area__empty">
                        Нет выбранных элементов
                    </div>
                )}
                {chips.map((chip) => (
                    <ChipsTile
                        key={chip.id}
                        type={type}
                        data={chip}
                        onRemove={removeChip}
                    />
                ))}
            </div>
        </div>
    );
}