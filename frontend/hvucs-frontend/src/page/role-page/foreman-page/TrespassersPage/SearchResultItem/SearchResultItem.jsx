import './SearchResultItem.css';

export default function SearchResultItem({ id, name, post, relation, organizationEmail, responsesAmount }) {
    
    const getRelationText = (relation) => {
        switch(relation) {
            case 'INNER_EMPLOYEE':
                return 'Внутренний сотрудник';
            case 'OUTER_EMPLOYEE':
                return 'Сотрудник внешней организации';
            default:
                return relation || 'Не указано';
        }
    };

    const handleClick = () => {
        window.location.href = `/trespasser-accidents/${id}`;
    };

    return (
        <div className="search-result-item-card" onClick={handleClick}>
            <div className="search-result-item-header">
                <div className="search-result-item-name">{name}</div>
                <div className="search-result-item-amount">
                    Нарушений: {responsesAmount}
                </div>
            </div>
            <div className="search-result-item-details">
                <div className="search-result-item-detail">
                    <span className="detail-label">Тип сотрудника:</span>
                    <span className="detail-value">{getRelationText(relation)}</span>
                </div>
                <div className="search-result-item-detail">
                    <span className="detail-label">Должность:</span>
                    <span className="detail-value">{post || 'Не указана'}</span>
                </div>
                <div className="search-result-item-detail">
                    <span className="detail-label">email управляющей организации:</span>
                    <span className="detail-value">{organizationEmail || 'Не указан'}</span>
                </div>
            </div>
        </div>
    );
}