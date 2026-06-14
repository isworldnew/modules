import './DocumentsPage.css';
import { useState, useEffect } from 'react';
import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../component/common-components/PageName/PageName.jsx';
import DocumentsSearchArea from './DocumentsSearchArea/DocumentsSearchArea.jsx';
import { extractRoleFromToken } from '../../script/extractRoleTokenUtil.js';

export default function DocumentsPage() {
    const [userRole, setUserRole] = useState(null);

    const fetchUserRole = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const role = extractRoleFromToken(accessToken);
                setUserRole(role);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    const getNavItems = () => {
        if (userRole === 'SAFETY_OFFICER') {
            return [
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
                    isActive: true,
                    showBadge: false,            
                },
                {
                    label: 'Личный кабинет',
                    href: '/safety-officer-user-page',
                    isActive: false,
                    showBadge: false,
                }
            ];
        }
        
        return [
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
                isActive: true,
                showBadge: false,            
            },
            {
                label: 'Личный кабинет',
                href: '/user-page',
                isActive: false,
                showBadge: false,
            }
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="documents-page">
            <Header />
            <div className="documents-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="documents-page__content">
                    <div className="documents-page__content-inner">
                        <PageName title="Акты о нарушении техники безопасности" />
                        <DocumentsSearchArea />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}