import './PageName.css';

export default function PageName({ title, subtitle = null }) {
    return (
        <div className="page-name-container">
            <h1 className="page-name-title">{title}</h1>
            {subtitle && <p className="page-name-subtitle">{subtitle}</p>}
        </div>
    );
}