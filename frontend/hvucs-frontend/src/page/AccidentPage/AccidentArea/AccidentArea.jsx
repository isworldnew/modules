import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { executeWithTokenRefresh } from '../../../script/executeWithTokenRefresh.js';
import './AccidentArea.css';

import AccidentHeader from '../AccidentHeader/AccidentHeader.jsx';
import AccidentSource from '../AccidentSource/AccidentSource.jsx';
import MetaInfoArea from '../MetaInfoArea/MetaInfoArea.jsx';
import ProcessedReportArea from '../ProcessedReportArea/ProcessedReportArea.jsx';
import UnprocessedReportArea from '../UnprocessedReportArea/UnprocessedReportArea.jsx';
import ProgressLoader from '../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import VideoPlayer from '../VideoPlayer/VideoPlayer.jsx';

export default function AccidentArea() {
    const { id } = useParams();
    const [incidentData, setIncidentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для загрузки данных инцидента
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

            // Обработка успешного ответа (статус 200)
            if (result.status === 200 && result.data) {
                setIncidentData(result.data);
            }
            // Обработка 404 (Not Found)
            else if (result.status === 404) {
                window.location.href = '/not-found';
            }
            // Обработка 403 (Forbidden)
            else if (result.status === 403) {
                window.location.href = '/forbidden';
            }
            else {
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

    // Отображение лоадера
    if (isLoading) {
        return <ProgressLoader message="Загрузка данных инцидента..." />;
    }

    // Отображение ошибки
    if (error) {
        return (
            <div className="accident-area-error">
                <p>{error}</p>
            </div>
        );
    }

    // Если данных нет
    if (!incidentData) {
        return (
            <div className="accident-area-empty">
                <p>Данные инцидента не найдены</p>
            </div>
        );
    }

    // Подготовка данных для MetaInfoArea
    const metaInfoItems = [
        { label: "Уведомление получено:", info: incidentData.uploadDateTime, infoType: "datetime" },
        { label: "Запись от:", info: incidentData.recordDateTime, infoType: "datetime" },
        { label: "Время инцидента:", info: incidentData.accidentDateTime, infoType: "datetime" },
        { label: "Вероятность инцидента:", info: incidentData.supposedAccuracy, infoType: "accuracy" },
        { label: "Статус:", info: incidentData.status, infoType: "status" }
    ];

    // Подготовка данных для ProcessedReportArea (если report существует)
    const reportItems = incidentData.report ? [
        { label: "Описание инцидента:", info: incidentData.report.description || "Нет описания", infoType: "description" },
        { label: "Интерпретация инцидента:", info: incidentData.report.accidentInterpretation, infoType: "interpretation" },
        { label: "Тип инцидента:", info: "Отсутствие световозвращающего жилета", infoType: "type" }
    ] : [];

    return (
        <div className="accident-area">
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
            
            {/* Отображение обработанного отчёта или формы обработки */}
            {incidentData.report ? (
                <ProcessedReportArea items={reportItems} />
            ) : (
                <UnprocessedReportArea label="Обработка инцидента" />
            )}
        </div>
    );
}