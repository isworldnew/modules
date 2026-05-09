import './AdminUserPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import PersonalDataCard from '../../../../component/common-components/PersonalDataCard/PersonalDataCard.jsx';

export default function AdminUserPage() {

    const navItems = [
        { 
            label: 'Пользователи', 
            href: '/users', 
            isActive: false,
            showBadge: false,
        }, 
        { 
            label: 'Зоны', 
            href: '/areas', 
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Камеры',
            href: '/cameras',
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Личный кабинет',
            href: '/admin-user-page',
            isActive: true,
            showBadge: false,
        }
    ];

    return (
        <div className="admin-page">
            <Header />
            <div className="admin-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="admin-page__content">
                    <div className="admin-page__content-inner">
                        <PageName title="Личный кабинет" />
                        <PersonalDataCard />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}