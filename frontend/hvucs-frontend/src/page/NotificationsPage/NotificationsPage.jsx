import './NotificationsPage.css';

import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../component/common-components/PageName/PageName.jsx';
import NotificationArea from './NotificationArea/NotificationArea.jsx';

export default function NotificationsPage() {
    return (
        <div className="notifications-page-wrapper">
            <Header />
            
            <div className="notifications-layout">
                <SideBar activePage="notifications" />
                
                <main className="notifications-content">
                    <PageName title="Уведомления о новых инцидентах" />
                    <NotificationArea />
                </main>
            </div>
            
            <Footer />
        </div>
    );
}