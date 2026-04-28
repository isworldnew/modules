import './AccidentSource.css';

export default function AccidentSource({ label, value }) {
    return (
        <div className="accident-source">
            <span className="source-label">{label}:</span>
            <span className="source-value">{value}</span>
        </div>
    );
}