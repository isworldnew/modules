import './ActionButton.css';

export default function ActionButton({
    children,           // текст или содержимое кнопки
    onClick,           // функция при нажатии
    width = 'auto',    // ширина кнопки
    backgroundColor = 'var(--button-yellow)',  // цвет фона
    textColor = 'var(--button-text-dark)',     // цвет текста
    type = 'button',   // type: 'button', 'submit', 'reset'
    disabled = false,
    className = '',
    // Опциональные параметры для функции onClick
    onClickParams = null,
    // Дополнительные параметры
    hoverColor = null,  // цвет при наведении (опционально)
    fontSize = '1rem',
    padding = null      // можно переопределить отступы
}) {
    
    const handleClick = (e) => {
        if (disabled) return;
        
        if (onClick) {
            // Если есть параметры, передаём их, иначе передаём событие
            if (onClickParams !== null) {
                onClick(onClickParams);
            } else {
                onClick(e);
            }
        }
    };
    
    // Стили кнопки
    const buttonStyle = {
        width: width,
        backgroundColor: backgroundColor,
        color: textColor,
        fontSize: fontSize,
        padding: padding || undefined
    };
    
    // Классы для кнопки
    const buttonClasses = ['btn', className].filter(Boolean).join(' ');
    
    return (
        <button
            type={type}
            className={buttonClasses}
            style={buttonStyle}
            onClick={handleClick}
            disabled={disabled}
            data-hover-color={hoverColor}
        >
            {children}
        </button>
    );
}