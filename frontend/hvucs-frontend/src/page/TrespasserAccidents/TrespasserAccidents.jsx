import './TrespasserAccidents.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../../component/common-components/Header/Header';
import Footer from '../../component/common-components/Footer/Footer';
import SideBar from '../../component/common-components/SideBar/SideBar';
import PageName from '../../component/common-components/PageName/PageName';
import TrespasserAccidentsArea from './TrespasserAccidentsArea/TrespasserAccidentsArea';
import { executeWithTokenRefresh } from '../../script/executeWithTokenRefresh';
import { extractRoleFromToken } from '../../script/extractRoleTokenUtil';

export default function TrespasserAccidents() {
    const { id } = useParams();
    const [userRole, setUserRole] = useState(null);
    const [trespasserName, setTrespasserName] = useState('');

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

    const fetchTrespasserName = async () => {
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(`/api/trespassers/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                let data = null;
                try {
                    data = await response.json();
                } catch (e) {
                    data = null;
                }
                return { status: response.status, data: data };
            });

            if (result.status === 200 && result.data) {
                setTrespasserName(result.data.name);
            }
        } catch (error) {
            console.error('Error fetching trespasser name:', error);
        }
    };

    useEffect(() => {
        fetchUserRole();
        fetchTrespasserName();
    }, [id]);

    const getNavItems = () => {
        if (userRole === 'SUPERVISOR') {
            return [
                { 
                    label: 'Сотрудники', 
                    href: '/employees', 
                    isActive: false,
                    showBadge: false,
                },
                {
                    label: 'Нарушители', 
                    href: '/trespassers', 
                    isActive: false,
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
                    label: 'Уведомления',
                    href: '/events-to-document',
                    isActive: false,
                    showBadge: true,
                },
                {
                    label: 'Архив проишествий',
                    href: '/archive',
                    isActive: false,
                    showBadge: false,
                },
                {
                    label: 'Личный кабинет',
                    href: '/supervisor-user-page',
                    isActive: false,
                    showBadge: false,
                }
            ];
        }
        
        return [
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
                isActive: false,
                showBadge: false,
            }
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="trespasser-accidents-page">
            <Header />
            <div className="trespasser-accidents-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="trespasser-accidents-page__content">
                    <div className="trespasser-accidents-page__content-inner">
                        <PageName title={`${trespasserName}: Список нарушений`} />
                        <TrespasserAccidentsArea trespasserId={id} />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}