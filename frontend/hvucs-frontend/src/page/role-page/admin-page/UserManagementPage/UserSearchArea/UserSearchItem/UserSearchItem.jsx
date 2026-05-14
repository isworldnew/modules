import './UserSearchItem.css';

export default function UserSearchItem({ id, username, firstname, lastname, parentname, role, status }) {
    
    const getFullName = () => {
        const parts = [lastname, firstname];
        if (parentname) {
            parts.push(parentname);
        }
        return parts.join(' ');
    };

    const getRoleText = () => {
        const roles = {
            'ADMIN': 'Администратор',
            'SUPERADMIN': 'Супер-администратор',
            'SAFETY_OFFICER': 'Сотрудник отдела ТБ',
            'FOREMAN': 'Ответственный за зону',
            'SUPERVISOR': 'Начальник'
        };
        return roles[role] || role;
    };

    const getRoleClass = () => {
        const classes = {
            'ADMIN': 'role-admin',
            'SUPERADMIN': 'role-superadmin',
            'SAFETY_OFFICER': 'role-hse',
            'FOREMAN': 'role-brigadier',
            'SUPERVISOR': 'role-chief'
        };
        return classes[role] || 'role-unknown';
    };

    const getStatusText = () => {
        return status === 'ENABLED' ? 'Активен' : 'Неактивен';
    };

    const getStatusClass = () => {
        return status === 'ENABLED' ? 'status-active' : 'status-inactive';
    };

    const handleClick = () => {
        window.location.href = `/user/${id}`;
    };

    return (
        <div className="user-search-item" onClick={handleClick}>
            <div className="user-search-item-header">
                <div className="user-search-item-name">{getFullName()}</div>
                <div className="user-search-item-id">ID: {id}</div>
            </div>
            <div className="user-search-item-details">
                <div className="user-search-item-detail">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{username}</span>
                </div>
                <div className="user-search-item-detail">
                    <span className="detail-label">Роль:</span>
                    <span className={`role-badge ${getRoleClass()}`}>{getRoleText()}</span>
                </div>
                <div className="user-search-item-detail">
                    <span className="detail-label">Статус:</span>
                    <span className={`status-badge ${getStatusClass()}`}>{getStatusText()}</span>
                </div>
            </div>
        </div>
    );
}