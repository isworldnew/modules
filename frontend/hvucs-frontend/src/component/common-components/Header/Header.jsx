import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <h1 className="header-logo">СКИЖ</h1>
                    <p className="header-subtitle">
                        Система контроля использования световозвращающих жилетов
                    </p>
                </div>
                <div className="header-right">
                    <button 
                        className={`theme-toggle ${theme === 'dark' ? 'active' : ''}`}
                        onClick={toggleTheme}
                        aria-label="Переключить тему"
                    >
                        <div className="toggle-knob"></div>
                    </button>
                </div>
            </div>
        </header>
    );
}