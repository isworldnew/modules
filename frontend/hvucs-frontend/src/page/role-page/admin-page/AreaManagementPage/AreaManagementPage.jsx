import './AreaManagementPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

import AreaCreationRegion from './AreaCreationRegion/AreaCreationRegion.jsx';
import ExistingAreasRegion from './ExistingAreasRegion/ExistingAreasRegion.jsx';

export default function AreaManagementPage() {
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
            isActive: true,
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
            isActive: false,
            showBadge: false,
        }
    ];

    return (
        <div className="area-page">
            <Header />
            <div className="area-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="area-page__content">
                    <div className="area-page__content-inner">
                        <PageName title="Зоны" />
                        <AreaCreationRegion />
                        <ExistingAreasRegion />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}