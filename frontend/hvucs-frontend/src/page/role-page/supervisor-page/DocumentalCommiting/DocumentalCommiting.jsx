import './DocumentalCommiting.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

import { executeWithTokenRefresh } from '../../../../script/executeWithTokenRefresh.js';

import ActionButton from '../../../../component/common-components/ActionButton/ActionButton.jsx';
import ProgressLoader from '../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import ModalWindow from '../../../../component/common-components/ModalWindow/ModalWindow.jsx';

import Act from '../../../../component/documents/Act/Act.jsx';
import ImageFileArea from './ImageFileArea/ImageFileArea.jsx';

export default function DocumentalCommiting() {
    const { id } = useParams();
    const actRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [incidentData, setIncidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const navItems = [
        { 
            label: 'Сотрудники', 
            href: '/employees', 
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

    const fetchUserData = async () => {
        try {
            const response = await executeWithTokenRefresh(async (accessToken) => {
                const fetchResponse = await fetch('/api/users/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                let data = null;
                try {
                    data = await fetchResponse.json();
                } catch (e) {
                    data = null;
                }
                
                return {
                    status: fetchResponse.status,
                    data: data
                };
            });
            
            if (response.status === 200 && response.data) {
                setUserData(response.data);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    const fetchIncidentData = async () => {
        if (!id) {
            setError('Не указан ID инцидента');
            return;
        }
        
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(`/api/accidents/${id}`, {
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
                setIncidentData(result.data);
            } else if (result.status === 404) {
                window.location.href = '/not-found';
            } else if (result.status === 403) {
                window.location.href = '/forbidden';
            } else {
                setError('Не удалось загрузить данные инцидента');
            }
        } catch (error) {
            console.error('Error fetching incident data:', error);
            setError('Не удалось подключиться к серверу. Проверьте соединение.');
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchUserData(), fetchIncidentData()]);
            setLoading(false);
        };
        init();
    }, [id]);

    const handleDownloadPDF = async () => {
        if (!actRef.current) return;
        
        setIsDownloading(true);
        
        const element = actRef.current;
        const responseId = incidentData?.responseId || 'akt';
        
        try {
            const originalOverflow = element.style.overflow;
            const originalPadding = element.style.padding;
            element.style.overflow = 'visible';
            element.style.padding = '0';
            element.style.margin = '0';
            
            const canvas = await html2canvas(element, {
                scale: 3,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            });
            
            element.style.overflow = originalOverflow;
            element.style.padding = originalPadding;
            element.style.margin = '0';
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            });
            
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${responseId}.pdf`);
        } catch (err) {
            console.error('Error generating PDF:', err);
            setModalMessage('Ошибка при создании PDF файла');
            setModalOpen(true);
        } finally {
            setIsDownloading(false);
        }
    };

    const getFullName = () => {
        const parts = [
            userData?.lastname,
            userData?.firstname,
            userData?.parentname
        ].filter(part => part && part.trim() !== '');
        
        return parts.length > 0 ? parts.join(' ') : '—';
    };

    const getRoleDisplay = () => {
        const roleMap = {
            'SAFETY_OFFICER': 'Сотрудник отдела ТБ',
            'FOREMAN': 'Ответственный за зону',
            'SUPERVISOR': 'Начальник',
            'ADMIN': 'Администратор',
            'SUPERADMIN': 'Главный администратор'
        };
        return roleMap[userData?.role] || userData?.role || '—';
    };

    const getDayMonthFromDate = (dateTimeString) => {
        if (!dateTimeString) return { day: '', month: '' };
        
        const date = new Date(dateTimeString);
        const day = date.getUTCDate().toString();
        const monthNames = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        const month = monthNames[date.getUTCMonth()];
        
        return { day, month };
    };

    const getFormattedDateTime = (dateTimeString) => {
        if (!dateTimeString) return { time: '', year: '' };
        
        const date = new Date(dateTimeString);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        const year = date.getUTCFullYear().toString().slice(-2);
        
        return { time, year };
    };

    const chairpersonValue = userData ? `${getFullName()} (${getRoleDisplay()})` : '';
    const responseId = incidentData?.responseId || '';
    const accidentDate = getDayMonthFromDate(incidentData?.accidentDateTime);
    const accidentDateTimeFormatted = getFormattedDateTime(incidentData?.accidentDateTime);
    const zoneValue = incidentData?.areaName || '';
    const cameraValue = incidentData?.cameraName || '';
    const reportDescription = incidentData?.report?.description || '';
    const responseType = incidentData?.response?.type || '';
    const responseReport = incidentData?.response?.report || '';
    const trespasser = incidentData?.trespasser || null;

    if (loading) {
        return <ProgressLoader message="Загрузка данных..." />;
    }

    if (error) {
        return (
            <div className="documental-commiting-page">
                <Header />
                <div className="documental-commiting-page__layout">
                    <SideBar 
                        navItems={navItems} 
                        showNotificationBadge={true}
                    />
                    <main className="documental-commiting-page__content">
                        <div className="documental-commiting-page__content-inner">
                            <PageName title="Документирование инцидента" />
                            <div className="error-container">
                                <p>{error}</p>
                                <ActionButton onClick={() => window.location.reload()}>
                                    Повторить
                                </ActionButton>
                            </div>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="documental-commiting-page">
            <Header />
            <div className="documental-commiting-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="documental-commiting-page__content">
                    <div className="documental-commiting-page__content-inner">
                        <div className="act-wrapper" ref={actRef}>
                            <Act 
                                chairpersonValue={chairpersonValue}
                                responseId={responseId}
                                accidentDay={accidentDate.day}
                                accidentMonth={accidentDate.month}
                                accidentTime={accidentDateTimeFormatted.time}
                                accidentYear={accidentDateTimeFormatted.year}
                                zoneName={zoneValue}
                                cameraName={cameraValue}
                                reportDescription={reportDescription}
                                responseType={responseType}
                                responseReport={responseReport}
                                trespasser={trespasser}
                            />
                        </div>
                        <div className="download-button-container">
                            <ActionButton 
                                onClick={handleDownloadPDF} 
                                width="auto"
                                disabled={isDownloading}
                            >
                                {isDownloading ? 'Подготовка PDF...' : 'Скачать для подписи'}
                            </ActionButton>
                        </div>
                        <ImageFileArea responseId={responseId} />
                    </div>
                </main>
            </div>
            <Footer />
            
            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}