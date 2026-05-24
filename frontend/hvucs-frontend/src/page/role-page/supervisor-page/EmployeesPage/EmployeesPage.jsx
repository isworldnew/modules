import './EmployeesPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

import UserSearchArea from '../../admin-page/UserManagementPage/UserSearchArea/UserSearchArea.jsx';

export default function EmployeesPage() {

    const navItems = [
        { 
            label: 'Сотрудники', 
            href: '/employees', 
            isActive: true,
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
        // {
        //     label: 'Статистика',
        //     href: '/stats',
        //     isActive: false,
        //     showBadge: false,
        // },
        {
            label: 'Личный кабинет',
            href: '/supervisor-user-page',
            isActive: false,
            showBadge: false,
        }
    ];

    return (
        <div className="employee-page">
            <Header />
            <div className="employee-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="employee-page__content">
                    <div className="employee-page__content-inner">
                        <PageName title="Сотрудники" />
                        <UserSearchArea />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
