import './PersonalDataCardEnum.css';

export default function PersonalDataCardEnum({ value }) {
    const getEnumClass = () => {
        const enumMap = {
            'ENABLED': 'personal-data-enum--enabled',
            'DISABLED': 'personal-data-enum--disabled',
            'SAFETY_OFFICER': 'personal-data-enum--safety-officer',
            'FOREMAN': 'personal-data-enum--foreman',
            'SUPERVISOR': 'personal-data-enum--supervisor',
            'ADMIN': 'personal-data-enum--admin',
            'SUPERADMIN': 'personal-data-enum--superadmin'
        };
        
        return `personal-data-enum ${enumMap[value] || ''}`;
    };
    
    const getDisplayValue = () => {
        const displayMap = {
            'ENABLED': 'Активен',
            'DISABLED': 'Неактивен',
            'SAFETY_OFFICER': 'Сотрудник отдела ТБ',
            'FOREMAN': 'Бригадир',
            'SUPERVISOR': 'Начальник',
            'ADMIN': 'Администратор',
            'SUPERADMIN': 'Главный администратор'
        };
        
        return displayMap[value] || value;
    };
    
    if (!value) {
        return <span className="personal-data-enum">—</span>;
    }
    
    return (
        <span className={getEnumClass()}>
            {getDisplayValue()}
        </span>
    );
}