import './SafetyOfficerUserPage.css';

import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../component/common-components/PageName/PageName.jsx';
import PersonalDataCard from '../../component/common-components/PersonalDataCard/PersonalDataCard.jsx';

export default function SafetyOfficerUserPage() {

    const navItems = [
        { 
            label: 'Уведомления', 
            href: '/notifications', 
            isActive: false,
            showBadge: true,
        }, 
        { 
            label: 'Инциденты', 
            href: '/accidents', 
            isActive: false,
            showBadge: false,
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
            isActive: true,
            showBadge: false,
        }
    ];

    return (
        <div className="safety-officer-page">
            <Header />
            <div className="safety-officer-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="safety-officer-page__content">
                    <div className="safety-officer-page__content-inner">
                        <PageName title="Личный кабинет" />
                        <PersonalDataCard />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}