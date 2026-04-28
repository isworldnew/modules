import { useEffect, useRef } from 'react';
import './ModalWindow.css';

export default function ModalWindow({ message, isOpen, onClose }) {
    const modalRef = useRef(null);
    
    useEffect(() => {
        if (isOpen) {
            // Блокируем прокрутку body при открытом модальном окне
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        // Очистка при размонтировании
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    
    // Закрытие при клике вне модального окна
    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };
    
    // Закрытие по Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleEsc);
        
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" ref={modalRef}>
                <div className="modal-content">
                    <p className="modal-message">{message}</p>
                    <button 
                        className="modal-button"
                        onClick={onClose}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}