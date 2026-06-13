import './ProcessedReportResponse.css';
import MetaInfoChips from '../../../../AccidentPage/MetaInfoChips/MetaInfoChips.jsx';

export default function ProcessedReportResponse({ response, trespasser, foreman }) {
    
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

    const getResponseTypeText = (type) => {
        switch(type) {
            case 'RED_HANDED_CATCH':
                return 'Нарушитель пойман с поличным';
            case 'NOTED':
                return 'Не застал нарушителя';
            default:
                return type || 'Не указано';
        }
    };

    const getResponseTypeColor = (type) => {
        switch(type) {
            case 'RED_HANDED_CATCH':
                return '#1b5e20';
            case 'NOTED':
                return '#b71c1c';
            default:
                return 'var(--text-primary)';
        }
    };

    const getFullName = (user) => {
        if (!user) return '';
        const lastName = user.lastname || '';
        const firstName = user.firstname || '';
        const parentName = user.parentname || '';
        let fullName = `${lastName} ${firstName}`;
        if (parentName) {
            fullName += ` ${parentName}`;
        }
        return fullName.trim();
    };

    const responseItems = [
        { label: "Результат разбирательства:", info: getResponseTypeText(response?.type), infoType: "text", color: getResponseTypeColor(response?.type) },
        { label: "Комментарий ответственного за зону:", info: response?.report || "Не указан", infoType: "text" },
        ...(foreman ? [{ label: "Прораб:", info: `${getFullName(foreman)} (${foreman.username})`, infoType: "text" }] : [])
    ];

    const trespasserItems = trespasser ? [
        { label: "ФИО нарушителя:", info: trespasser.name || "Не указано", infoType: "text" },
        { label: "Должность:", info: trespasser.post || "Не указано", infoType: "text" },
        { label: "Тип сотрудника:", info: getRelationText(trespasser.relation), infoType: "text" },
        { label: "Электронная почта управляющей организации:", info: trespasser.organizationEmail || "Не указана", infoType: "text" }
    ] : [];

    return (
        <div className="processed-report-response">
            <div className="processed-report-response__section">
                <div className="processed-report-response__section-title">
                    Принятые меры:
                </div>
                <div className="processed-report-response__content">
                    {responseItems.map((item, index) => (
                        <MetaInfoChips
                            key={index}
                            label={item.label}
                            info={item.info}
                            infoType={item.infoType}
                            width="100%"
                            customColor={item.color}
                        />
                    ))}
                </div>
            </div>

            {trespasserItems.length > 0 && (
                <div className="processed-report-response__section">
                    <div className="processed-report-response__section-title">
                        Информация о нарушителе:
                    </div>
                    <div className="processed-report-response__content">
                        {trespasserItems.map((item, index) => (
                            <MetaInfoChips
                                key={index}
                                label={item.label}
                                info={item.info}
                                infoType={item.infoType}
                                width="100%"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}