import './TrespassersPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx'
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';

import PageName from '../../../../component/common-components/PageName/PageName.jsx';

export default function TrespassersPage() {

    const navItems = [
        { 
            label: 'Нарушители', 
            href: '/trespassers', 
            isActive: true,
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
            isActive: false,
            showBadge: false,
        }
    ];

    return <>
        <div className="trespassers-page">
            <Header />
            <div className="trespassers-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="trespassers-page__content">
                    <div className="trespassers-page__content-inner">
                        <PageName title="Нарушители" />
                    </div>
                </main>
            </div>
            <Footer />
        </div>    
    </>
}
