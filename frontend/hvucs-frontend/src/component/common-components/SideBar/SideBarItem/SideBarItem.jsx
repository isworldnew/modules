import './SideBarItem.css';

export default function SideBarItem({ 
    title,           // название пункта меню
    href,            // адрес страницы для перехода
    isActive = false, // активный ли пункт
}) {
    
    const handleClick = (e) => {
        e.preventDefault();
        if (href) {
            window.location.href = href;
        }
    };
    
    return (
        <a 
            href={href}
            className={`nav-link ${isActive ? 'active' : ''}`}
            onClick={handleClick}
        >
        </a>
    );
}