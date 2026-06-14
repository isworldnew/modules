import './NotificationsPage.css';

import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../component/common-components/PageName/PageName.jsx';
import NotificationArea from './NotificationArea/NotificationArea.jsx';

export default function NotificationsPage() {


    const navItems = [
        { 
            label: 'Уведомления', 
            href: '/notifications', 
            isActive: true,
            showBadge: true 
        },
        { 
            label: 'Инциденты', 
            href: '/accidents', 
            isActive: false,
            showBadge: false 
        },
        {
            label: 'Документы', 
            href: '/documents', 
            isActive: false,
            showBadge: false,            
        },
        {
            label: 'Личный кабинет',
            href: '/safety-officer-user-page',
            isActive: false,
            showBadge: false
        }
    ];

    return (
        <div className="notifications-page-wrapper">
            <Header />
            
            <div className="notifications-layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                
                <main className="notifications-content">
                    <PageName title="Уведомления о новых инцидентах" />
                    <NotificationArea />
                </main>
            </div>
            
            <Footer />
        </div>
    );
}