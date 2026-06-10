import './SupervisorUserPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import PersonalDataCard from '../../../../component/common-components/PersonalDataCard/PersonalDataCard.jsx';

export default function SupervisorUserPage() {

    const navItems = [
        { 
            label: 'Сотрудники', 
            href: '/employees', 
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Нарушители', 
            href: '/trespassers', 
            isActive: false,
            showBadge: false,            
        },
        { 
            label: 'Зоны', 
            href: '/areas-page', 
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Камеры',
            href: '/cameras-page',
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Архив проишествий',
            href: '/archive',
            isActive: false,
            showBadge: false,
        },
        // {
        //     label: 'Статистика',
        //     href: '/stats',
        //     isActive: false,
        //     showBadge: false,
        // },
        {
            label: 'Личный кабинет',
            href: '/supervisor-user-page',
            isActive: true,
            showBadge: false,
        }
    ];

    return (
        <div className="supervisor-page">
            <Header />
            <div className="supervisor-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="supervisor-page__content">
                    <div className="supervisor-page__content-inner">
                        <PageName title="Личный кабинет" />
                        <PersonalDataCard />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}