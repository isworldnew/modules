import './SafetyOfficerUserPage.css';

import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../component/common-components/SideBar/SideBar.jsx';

export default function SafetyOfficerUserPage() {

    const navItems = [
        { 
            label: 'Уведомления', 
            href: '/notifications', 
            isActive: false,
            showBadge: true 
        },
        { 
            label: 'Инциденты', 
            href: '/accidents', 
            isActive: false,
            showBadge: false 
        },
        {
            label: 'Личный кабинет',
            href: '/safety-officer-user-page',
            isActive: true,
            showBadge: false
        }
    ];

    return <>
        <Header />
        <SideBar 
            navItems={navItems} 
            showNotificationBadge={true}
        />
        <Footer />
    </>
}