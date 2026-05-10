import './ExistingCamera.css';

export default function ExistingCamera({ id, name, areaName }) {
    const handleClick = () => {
        window.location.href = `/cameras/camera/${id}`;
    };

    return (
        <tr className="existing-camera" onClick={handleClick}>
            <td className="existing-camera__id">{id}</td>
            <td className="existing-camera__name">{name || '—'}</td>
            <td className="existing-camera__area-name">{areaName}</td>
        </tr>
    );
}