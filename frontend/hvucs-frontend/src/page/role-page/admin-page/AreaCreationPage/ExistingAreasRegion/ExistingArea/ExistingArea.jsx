import './ExistingArea.css';

export default function ExistingArea({ id, name }) {
    const handleClick = () => {
        window.location.href = `/areas/area/${id}`;
    };

    return (
        <tr className="existing-area" onClick={handleClick}>
            <td className="existing-area__id">{id}</td>
            <td className="existing-area__name">{name}</td>
        </tr>
    );
}