import './ReportNotificationsPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx'
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import ReportNotificationArea from './ReportNotificationArea/ReportNotificationArea.jsx';

export default function ReportNotificationsPage() {

    const navItems = [
        { 
            label: 'Нарушители', 
            href: '/trespassers', 
            isActive: false,
            showBadge: false,
        }, 
        { 
            label: 'Уведомления', 
            href: '/report-notifications', 
            isActive: true,
            showBadge: true,
        },
        {
            label: 'Принятые меры',
            href: '/responses',
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Личный кабинет',
            href: '/foreman-user-page',
            isActive: false,
            showBadge: false,
        }
    ];

    return <>
        <div className="report-notifications-page">
            <Header />
            <div className="report-notifications-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="report-notifications-page__content">
                    <div className="report-notifications-page__content-inner">
                        <PageName title="Уведомления о нарушениях в подотчётной зоне" />
                        <ReportNotificationArea />
                    </div>
                </main>
            </div>
            <Footer />
        </div>    
    </>
}