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

        let container = null;

        try {
            container = document.createElement('div');

            container.style.position = 'fixed';
            container.style.left = '-10000px';
            container.style.top = '0';
            container.style.zIndex = '-1';
            container.style.background = '#fff';

            document.body.appendChild(container);

            const clone = actRef.current.cloneNode(true);

            clone.classList.add('pdf-export');

            clone.style.width = '210mm';
            clone.style.maxWidth = '210mm';
            clone.style.margin = '0';
            clone.style.padding = '0';
            clone.style.background = '#fff';

            clone.querySelectorAll('textarea').forEach((textarea) => {
                const wrapper = document.createElement('div');

                const styles = window.getComputedStyle(textarea);

                const value = textarea.value || '';

                const lineHeight =
                    parseFloat(styles.lineHeight) || 22;

                wrapper.style.width = '100%';

                wrapper.style.font = styles.font;
                wrapper.style.fontFamily = styles.fontFamily;
                wrapper.style.fontSize = styles.fontSize;
                wrapper.style.fontWeight = styles.fontWeight;

                wrapper.style.lineHeight = `${lineHeight}px`;

                wrapper.style.color = styles.color;

                wrapper.style.margin = styles.margin;
                wrapper.style.padding = '0';

                const textBlock = document.createElement('div');

                textBlock.textContent = value;

                textBlock.style.whiteSpace = 'pre-wrap';
                textBlock.style.wordBreak = 'break-word';
                textBlock.style.overflowWrap = 'break-word';

                wrapper.appendChild(textBlock);

                const extraLines = 3;

                for (let i = 0; i < extraLines; i++) {
                    const line = document.createElement('div');

                    line.style.height = `${lineHeight}px`;

                    line.style.borderBottom =
                        '1px solid #111';

                    wrapper.appendChild(line);
                }

                textarea.replaceWith(wrapper);
            });
            
            const actPage = clone.querySelector('.act-page');

            if (actPage) {
                actPage.style.transform = 'none';
                actPage.style.aspectRatio = 'unset';
                actPage.style.width = '210mm';
                actPage.style.height = 'auto';
            }

            const actShell = clone.querySelector('.act-shell');

            if (actShell) {
                actShell.style.padding = '0';
                actShell.style.overflow = 'visible';
            }

            const actPaper = clone.querySelector('.act-paper');

            if (actPaper) {
                actPaper.style.width = '210mm';
                actPaper.style.height = 'auto';
                actPaper.style.minHeight = '297mm';

                actPaper.style.background = '#fff';

                actPaper.style.boxShadow = 'none';
                actPaper.style.border = 'none';

                actPaper.style.overflow = 'visible';
            }

            container.appendChild(clone);

            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );

            const canvas = await html2canvas(clone, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                scrollX: 0,
                scrollY: 0
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = 210;
            const pageHeight = 297;

            const imgWidth = pageWidth;
            const imgHeight =
                (canvas.height * imgWidth) / canvas.width;

            const imgData = canvas.toDataURL(
                'image/png',
                1.0
            );

            if (imgHeight <= pageHeight + 1) {
                pdf.addImage(
                    imgData,
                    'PNG',
                    0,
                    0,
                    imgWidth,
                    imgHeight
                );
            } else {
                let heightLeft = imgHeight;
                let position = 0;
                let firstPage = true;

                while (heightLeft > 1) {
                    if (!firstPage) {
                        pdf.addPage();
                    }

                    pdf.addImage(
                        imgData,
                        'PNG',
                        0,
                        position,
                        imgWidth,
                        imgHeight
                    );

                    heightLeft -= pageHeight;
                    position -= pageHeight;

                    firstPage = false;
                }
            }

            pdf.save(
                `${incidentData?.responseId || 'akt'}.pdf`
            );
        } catch (error) {
            console.error(
                'Error generating PDF:',
                error
            );

            setModalMessage(
                'Ошибка при создании PDF файла'
            );

            setModalOpen(true);
        } finally {
            if (container?.parentNode) {
                container.parentNode.removeChild(
                    container
                );
            }

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