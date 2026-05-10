import './DropDownMenu.css';
import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js';

export default function DropDownMenu({ type, endpoint, onSelect, placeholder = 'Выберите...' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await executeWithTokenRefresh(async (accessToken) => {
                    const fetchResponse = await fetch(endpoint, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    let data = null;
                    try {
                        data = await fetchResponse.json();
                    } catch (e) {
                        data = null;
                    }
                    
                    return {
                        status: fetchResponse.status,
                        data: data
                    };
                });
                
                if (response.status === 200 && response.data) {
                    setItems(response.data);
                }
            } catch (err) {
                console.error('Error fetching dropdown data:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [endpoint]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getDisplayValue = (item) => {
        if (type === 'area') {
            return item.name;
        } else if (type === 'user') {
            const parts = [
                item.lastname,
                item.firstname,
                item.parentname
            ].filter(part => part && part.trim() !== '');
            const fullName = parts.join(' ');
            return `${fullName} (${item.username})`;
        }
        return '';
    };

    const handleSelect = (item) => {
        setSelectedItem(item);
        setIsOpen(false);
        if (onSelect) {
            onSelect(item);
        }
    };

    return (
        <div className="dropdown-menu" ref={dropdownRef}>
            <div 
                className="dropdown-menu__header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="dropdown-menu__selected">
                    {selectedItem ? getDisplayValue(selectedItem) : placeholder}
                </span>
                <span className={`dropdown-menu__arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>
            
            {isOpen && (
                <div className="dropdown-menu__list">
                    {loading && (
                        <div className="dropdown-menu__loading">Загрузка...</div>
                    )}
                    {!loading && items.length === 0 && (
                        <div className="dropdown-menu__empty">Нет данных</div>
                    )}
                    {!loading && items.map((item) => (
                        <div
                            key={item.id}
                            className="dropdown-menu__item"
                            onClick={() => handleSelect(item)}
                        >
                            {getDisplayValue(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}