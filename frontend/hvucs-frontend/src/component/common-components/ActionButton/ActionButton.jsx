import './ActionButton.css';

export default function ActionButton({
    children,
    onClick,
    width = 'auto',
    backgroundColor = 'var(--button-yellow)',
    textColor = 'var(--button-text-dark)',
    type = 'button',
    disabled = false,
    className = '',
    onClickParams = null,
    hoverColor = null,
    fontSize = '1rem',
    padding = null
}) {
    
    const handleClick = (e) => {
        if (disabled) return;
        
        if (onClick) {
            if (onClickParams !== null) {
                onClick(onClickParams);
            } else {
                onClick(e);
            }
        }
    };
    
    const buttonStyle = {
        width: width,
        backgroundColor: backgroundColor,
        color: textColor,
        fontSize: fontSize,
        padding: padding || undefined
    };
    
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