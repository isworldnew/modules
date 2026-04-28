import './ProgressLoader.css';

export default function ProgressLoader({ message = '' }) {
    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader-spinner"></div>
                {message && <p className="loader-message">{message}</p>}
            </div>
        </div>
    );
}