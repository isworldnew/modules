import { useState, useEffect, useRef } from 'react';
import NotificationItem from './NotificationItem/NotificationItem.jsx';
import './SideBar.css';

export default function SideBar({ activePage = 'notifications' }) {
    
    const handleNavigation = (href) => {
        window.location.href = href;
    };
    
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <div 
                    className={`nav-link ${activePage === 'notifications' ? 'active' : ''}`}
                    onClick={() => handleNavigation('/notifications')}
                >
                    <span className="nav-link-text">Уведомления</span>
                    <NotificationItem />
                </div>
                
                <div 
                    className={`nav-link ${activePage === 'accidents' ? 'active' : ''}`}
                    onClick={() => handleNavigation('/accidents')}
                >
                    <span className="nav-link-text">Инциденты</span>
                </div>
            </nav>
        </aside>
    );
}