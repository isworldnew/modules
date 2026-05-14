import './CameraCreationPage.css';
import ExistingCamerasArea from './ExistingCamerasArea/ExistingCamerasArea.jsx';
import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import CameraCreationArea from './CameraCreationArea/CameraCreationArea.jsx';

export default function CameraCreationPage() {
    const navItems = [
        { 
            label: 'Пользователи', 
            href: '/users', 
            isActive: false,
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
            isActive: true,
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
        <div className="camera-creation-page">
            <Header />
            <div className="camera-creation-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="camera-creation-page__content">
                    <div className="camera-creation-page__content-inner">
                        <PageName title="Создание новой камеры" />
                        <CameraCreationArea />
                        <ExistingCamerasArea />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}