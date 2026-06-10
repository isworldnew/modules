import './AccidentsToAssure.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import EventsArea from '../EventsArchive/EventsArea/EventsArea.jsx';

export default function AccidentsToAssure() {
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
            label: 'Уведомления',
            href: '/events-to-document',
            isActive: true,
            showBadge: true,
        },
        {
            label: 'Архив проишествий',
            href: '/archive',
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
        <div className="accidents-to-assure-page">
            <Header />
            <div className="accidents-to-assure-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="accidents-to-assure-page__content">
                    <div className="accidents-to-assure-page__content-inner">
                        <PageName title="Уведомления" />
                        
                        {/* Добавляем EventsArea без пропсов */}
                        <EventsArea />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}