import { useEffect, useState, useRef } from 'react';
import './DocLine.css';

export default function DocLine({
  value,
  defaultValue = '',
  onChange,
  placeholder = '',
  className = '',
  width = '100%',
  multiline = false,
  rows = 2,
  readOnly = false,
}) {
  const controlled = value !== undefined;

  const [innerValue, setInnerValue] = useState(defaultValue);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (!controlled) {
      setInnerValue(defaultValue);
    }
  }, [defaultValue, controlled]);

  const currentValue = controlled ? value : innerValue;

  useEffect(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentValue, multiline]);

  const handleChange = (e) => {
    const next = e.target.value;

    if (multiline) {
      e.target.style.height = 'auto';
      e.target.style.height =
        `${e.target.scrollHeight}px`;
    }

    if (!controlled) {
      setInnerValue(next);
    }

    onChange?.(e);
  };

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        className={`doc-line doc-line--textarea ${className}`.trim()}
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ width }}
        rows={rows}
        readOnly={readOnly}
        spellCheck={false}
      />
    );
  }

  return (
    <input
      className={`doc-line ${className}`.trim()}
      value={currentValue}
      onChange={handleChange}
      placeholder={placeholder}
      style={{ width }}
      readOnly={readOnly}
      spellCheck={false}
    />
  );
}