import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!controlled) {
      setInnerValue(defaultValue);
    }
  }, [defaultValue, controlled]);

  const currentValue = controlled ? value : innerValue;
  const Comp = multiline ? 'textarea' : 'input';

  const handleChange = (e) => {
    const next = e.target.value;
    if (!controlled) setInnerValue(next);
    onChange?.(e);
  };

  return (
    <Comp
      className={`doc-line ${multiline ? 'doc-line--textarea' : ''} ${className}`.trim()}
      value={currentValue}
      onChange={handleChange}
      placeholder={placeholder}
      style={{ width }}
      rows={multiline ? rows : undefined}
      readOnly={readOnly}
      spellCheck={false}
    />
  );
}