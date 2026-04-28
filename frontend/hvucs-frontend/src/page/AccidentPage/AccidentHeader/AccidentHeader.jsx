import './AccidentHeader.css';

export default function AccidentHeader({ id }) {
    return (
        <h2 className="accident-header">
            Инцидент #{id}
        </h2>
    );
}