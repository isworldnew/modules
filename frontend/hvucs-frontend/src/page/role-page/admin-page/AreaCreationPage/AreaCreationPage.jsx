import './AreaCreationPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

import AreaCreateUpdateRegion from '../../../../component/common-components/AreaCreateUpdateRegion/AreaCreateUpdateRegion.jsx';
import ExistingAreasRegion from './ExistingAreasRegion/ExistingAreasRegion.jsx';

export default function AreaCreationPage() {

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
        <div className="area-creation-page">
            <Header />
            <div className="area-creation-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="area-creation-page__content">
                    <div className="area-creation-page__content-inner">
                        <PageName title="Создание новой зоны" />
                        <AreaCreateUpdateRegion />
                        <ExistingAreasRegion />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}