import './ForemanUserPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx'
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';

import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import PersonalDataCard from '../../../../component/common-components/PersonalDataCard/PersonalDataCard.jsx';

export default function ForemanUserPage() {

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
            isActive: false,
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
            isActive: true,
            showBadge: false,
        }
    ];

    return <>
        <div className="foreman-page">
            <Header />
            <div className="foreman-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="foreman-page__content">
                    <div className="foreman-page__content-inner">
                        <PageName title="Личный кабинет" />
                        <PersonalDataCard />
                    </div>
                </main>
            </div>
            <Footer />
        </div>    
    </>
}
