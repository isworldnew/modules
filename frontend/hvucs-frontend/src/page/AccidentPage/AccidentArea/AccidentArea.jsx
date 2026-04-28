import './AccidentArea.css';

import AccidentHeader from '../AccidentHeader/AccidentHeader.jsx';
import AccidentSource from '../AccidentSource/AccidentSource.jsx';

import MetaInfoArea from '../MetaInfoArea/MetaInfoArea.jsx';
import ProcessedReportArea from '../ProcessedReportArea/ProcessedReportArea.jsx';

export default function AccidentArea() {

    const metaInfoItems = [
        { label: "Уведомление получено:", info: "2026-04-28T20:59:48.923766Z", infoType: "datetime" },
        { label: "Запись от:", info: "2026-04-25T21:50:14Z", infoType: "datetime" },
        { label: "Время инцидента:", info: "2026-04-25T21:50:14Z", infoType: "datetime" },
        { label: "Вероятность инцидента:", info: 0.999621903896332, infoType: "accuracy" },
        { label: "Статус:", info: "PROCESSED", infoType: "status" }
    ];

    // В компоненте AccidentArea для обработанного инцидента
    const reportItems = [
        { label: "Описание инцидента:", info: "Сотрудник без жилета в рабочей зоне", infoType: "description" },
        { label: "Интерпретация инцидента:", info: "FALSE_ALARM", infoType: "interpretation" },
        { label: "Тип инцидента:", info: "Отсутствие световозвращающего жилета", infoType: "type" }
    ];


    return (
        <div className="accident-area">
            {/* Контент будет добавлен позже */}
            <MetaInfoArea items={metaInfoItems} />
            <ProcessedReportArea items={reportItems} />
        </div>
    );
}