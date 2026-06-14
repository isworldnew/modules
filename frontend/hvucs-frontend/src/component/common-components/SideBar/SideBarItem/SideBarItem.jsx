import './SideBarItem.css';

export default function SideBarItem({ 
    title,
    href,
    isActive = false,
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