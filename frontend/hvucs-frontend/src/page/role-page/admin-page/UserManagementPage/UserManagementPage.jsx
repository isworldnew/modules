import './UserManagementPage.css';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

import UserCreationArea from './UserCreationArea/UserCreationArea.jsx';
import UserSearchArea from './UserSearchArea/UserSearchArea.jsx';

export default function UserManagementPage() {
    const navItems = [
        { 
            label: 'Пользователи', 
            href: '/users', 
            isActive: true,
            showBadge: false,
        }, 
        { 
            label: 'Зоны', 
            href: '/areas', 
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Камеры',
            href: '/cameras',
            isActive: false,
            showBadge: false,
        },
        {
            label: 'Личный кабинет',
            href: '/admin-user-page',
            isActive: false,
            showBadge: false,
        }
    ];

    return (
        <div className="user-management-page">
            <Header />
            <div className="user-management-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="user-management-page__content">
                    <div className="user-management-page__content-inner">
                        <div className="user-management-page__registration-section">
                            <PageName title="Регистрация пользователя" />
                            <UserCreationArea />
                        </div>
                        <div className="user-management-page__search-section">
                            <UserSearchArea />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}