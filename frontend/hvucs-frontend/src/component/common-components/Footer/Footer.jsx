import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <p className="footer-copyright">
                        © {currentYear} СКИЖ | Система контроля использования световозвращающих жилетов
                    </p>
                    <p className="footer-info">
                        Версия 1.0.0 | Авторы: 
                        <a href="mailto:isworldnew@mail.ru" className="footer-link">
                            isworldnew@mail.ru
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}