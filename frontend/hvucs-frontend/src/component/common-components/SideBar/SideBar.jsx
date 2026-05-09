import { useState, useEffect, useRef } from 'react';
import NotificationBadge from './NotificationBadge/NotificationBadge.jsx';
import './SideBar.css';

export default function SideBar({ navItems = [], showNotificationBadge = false }) {
    
    const handleNavigation = (href) => {
        window.location.href = href;
    };
    
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {navItems.map((item, index) => (
                    <div 
                        key={index}
                        className={`nav-link ${item.isActive ? 'active' : ''}`}
                        onClick={() => handleNavigation(item.href)}
                    >
                        <span className="nav-link-text">{item.label}</span>
                        {showNotificationBadge && item.showBadge && <NotificationBadge />}
                    </div>
                ))}
            </nav>
        </aside>
    );
}