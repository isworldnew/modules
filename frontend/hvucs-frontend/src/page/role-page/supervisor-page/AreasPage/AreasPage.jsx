import './AreasPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

import ExistingAreasRegion from '../../admin-page/AreaManagementPage/ExistingAreasRegion/ExistingAreasRegion.jsx';

export default function AreasPage() {

    const navItems = [
        { 
            label: 'Сотрудники', 
            href: '/employees', 
            isActive: false,
            showBadge: false,
        }, 
        { 
            label: 'Зоны', 
            href: '/areas-page', 
            isActive: true,
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
                {
            label: 'Статистика',
            href: '/stats',
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Личный кабинет',
            href: '/supervisor-user-page',
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
                        <ExistingAreasRegion />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
