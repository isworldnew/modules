import './DocumentalCommiting.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

import ActionButton from '../../../../component/common-components/ActionButton/ActionButton.jsx';
import ProgressLoader from '../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';

import Act from '../../../../component/documents/Act/Act.jsx';

export default function DocumentalCommiting() {

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
        {
            label: 'Личный кабинет',
            href: '/supervisor-user-page',
            isActive: false,
            showBadge: false,
        }
    ];

    return (
        <div className="documental-commiting-page">
            <Header />
            <div className="documental-commiting-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="documental-commiting-page__content">
                    <div className="documental-commiting-page__content-inner">
                        <PageName title="Документирование инцидента" />
                        <Act />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
