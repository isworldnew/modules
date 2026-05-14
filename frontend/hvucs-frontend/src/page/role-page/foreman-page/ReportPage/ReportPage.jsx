import './ReportPage.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { executeWithTokenRefresh } from '../../../../script/executeWithTokenRefresh.js';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import ProgressLoader from '../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import AccidentHeader from '../../../AccidentPage/AccidentHeader/AccidentHeader.jsx';
import AccidentSource from '../../../AccidentPage/AccidentSource/AccidentSource.jsx';
import VideoPlayer from '../../../AccidentPage/VideoPlayer/VideoPlayer.jsx';
import MetaInfoArea from '../../../AccidentPage/MetaInfoArea/MetaInfoArea.jsx';
import ProcessedReportArea from '../../../AccidentPage/ProcessedReportArea/ProcessedReportArea.jsx';

import UnprocessedReportResponse from './UnprocessedReportResponse/UnprocessedReportResponse.jsx';
import ProcessedReportResponse from './ProcessedReportResponse/ProcessedReportResponse.jsx';

export default function ReportPage() {
    const { id } = useParams();
    const [incidentData, setIncidentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchIncidentData = async () => {
        setIsLoading(true);
        setError(null);
        
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchIncidentData();
        }
    }, [id]);

    if (isLoading) {
        return <ProgressLoader message="Загрузка данных инцидента..." />;
    }

    if (error) {
        return (
            <div className="report-page-error">
                <p>{error}</p>
            </div>
        );
    }

    if (!incidentData) {
        return (
            <div className="report-page-empty">
                <p>Данные инцидента не найдены</p>
            </div>
        );
    }

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
            isActive: false,
            showBadge: false,
        }
    ];

    const metaInfoItems = [
        { label: "Уведомление получено:", info: incidentData.uploadDateTime, infoType: "datetime" },
        { label: "Запись от:", info: incidentData.recordDateTime, infoType: "datetime" },
        { label: "Время инцидента:", info: incidentData.accidentDateTime, infoType: "datetime" },
        { label: "Вероятность инцидента:", info: incidentData.supposedAccuracy, infoType: "accuracy" },
        { label: "Статус:", info: incidentData.status, infoType: "status" }
    ];

    const getFullName = (user) => {
        if (!user) return '';
        const lastName = user.lastname || '';
        const firstName = user.firstname || '';
        const parentName = user.parentname || '';
        let fullName = `${lastName} ${firstName}`;
        if (parentName) {
            fullName += ` ${parentName}`;
        }
        return fullName.trim();
    };

    const reportItems = incidentData.report ? [
        { label: "Описание инцидента:", info: incidentData.report.description || "Нет описания", infoType: "description" },
        { label: "Интерпретация инцидента:", info: incidentData.report.accidentInterpretation, infoType: "interpretation" },
        { label: "Тип инцидента:", info: "Отсутствие световозвращающего жилета", infoType: "type" },
        ...(incidentData.safetyOfficer ? [{ label: "Сотрудник отдела ТБ (инициатор):", info: `${getFullName(incidentData.safetyOfficer)} (${incidentData.safetyOfficer.username})`, infoType: "text" }] : [])
    ] : [];

    const renderContent = () => {
        if (incidentData.response === null && incidentData.trespasser === null) {
            return <UnprocessedReportResponse />;
        }
        
        if (incidentData.response !== null) {
            return (
                <ProcessedReportResponse 
                    response={incidentData.response}
                    trespasser={incidentData.trespasser}
                    foreman={incidentData.foreman}
                />
            );
        }
        
        return null;
    };

    return (
        <div className="report-page-wrapper">
            <Header />
            <div className="report-layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="report-content">
                    <PageName title="Просмотр инцидента" />
                    <div className="report-area">
                        <AccidentHeader id={incidentData.id} />
                        
                        <div className="info-row">
                            <AccidentSource label="Зона" value={incidentData.areaName} />
                            <AccidentSource label="Камера" value={incidentData.cameraName} />
                        </div>
                        
                        <VideoPlayer 
                            recordType={incidentData.recordType}
                            record={incidentData.record}
                        />
                        
                        <MetaInfoArea items={metaInfoItems} />
                        
                        {incidentData.report && (
                            <ProcessedReportArea items={reportItems} />
                        )}
                        
                        {renderContent()}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}