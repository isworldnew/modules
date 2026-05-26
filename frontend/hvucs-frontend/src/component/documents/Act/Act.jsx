import { useState, useEffect } from 'react';
import './Act.css';
import DocLine from '../document-components/DocLine/DocLine.jsx';

export default function Act({ 
    chairpersonValue = '', 
    responseId = '',
    accidentDay = '',
    accidentMonth = '',
    accidentTime = '',
    accidentYear = '',
    zoneName = '',
    cameraName = '',
    reportDescription = '',
    responseType = '',
    responseReport = '',
    trespasser = null
}) {
    const getCurrentDate = () => {
        const today = new Date();
        const day = today.getDate().toString();
        const monthNames = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear().toString().slice(-2);
        return { day, month, year };
    };

    const getRelationText = (relation) => {
        switch(relation) {
            case 'INNER_EMPLOYEE':
                return 'Внутренний сотрудник';
            case 'OUTER_EMPLOYEE':
                return 'Сотрудник внешней организации';
            default:
                return relation || 'Не указано';
        }
    };

    const getResponseTypeText = (type) => {
        switch(type) {
            case 'RED_HANDED_CATCH':
                return 'Нарушитель пойман с поличным';
            case 'NOTED':
                return 'Не застал нарушителя';
            default:
                return type || 'Не указано';
        }
    };

    const buildEventDescription = () => {
        const parts = [];
        
        if (reportDescription) {
            parts.push(reportDescription);
        }
        
        if (responseType) {
            parts.push(`Результат разбирательства: ${getResponseTypeText(responseType)}`);
        }
        
        if (responseReport) {
            parts.push(`Комментарий прораба: ${responseReport}`);
        }
        
        if (trespasser) {
            const trespasserParts = [];
            if (trespasser.name) {
                trespasserParts.push(trespasser.name);
            }
            if (trespasser.post) {
                trespasserParts.push(trespasser.post);
            }
            if (trespasser.relation) {
                trespasserParts.push(getRelationText(trespasser.relation));
            }
            if (trespasser.organizationEmail) {
                trespasserParts.push(trespasser.organizationEmail);
            }
            if (trespasserParts.length > 0) {
                parts.push(`Нарушитель: ${trespasserParts.join(', ')}`);
            }
        }
        
        return parts.join('. ');
    };

    const currentDate = getCurrentDate();

    const [form, setForm] = useState({
        org: 'АО "Транснефть-Приволга" Саратовское районное нефтепроводное управление',
        number: responseId,
        city: 'Саратов',
        day: currentDate.day,
        month: currentDate.month,
        year: currentDate.year,
        date2: accidentDay,
        date2Month: accidentMonth,
        time: accidentTime,
        year2: accidentYear,
        zone: zoneName && cameraName ? `${zoneName} (${cameraName})` : zoneName,
        chair: chairpersonValue,
        member1: '',
        member2: '',
        eventDesc: buildEventDescription(),
        norm1: '',
        norm2: '',
        explanation: '',
        conclusion: '',
        measures: '',
    });

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            number: responseId,
            date2: accidentDay,
            date2Month: accidentMonth,
            time: accidentTime,
            year2: accidentYear,
            zone: zoneName && cameraName ? `${zoneName} (${cameraName})` : zoneName,
            eventDesc: buildEventDescription(),
            chair: chairpersonValue
        }));
    }, [responseId, accidentDay, accidentMonth, accidentTime, accidentYear, zoneName, cameraName, reportDescription, responseType, responseReport, trespasser, chairpersonValue]);

    const setField = (key) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="act-root">
            <div className="act-shell">
                <section className="act-page">
                    <div className="act-paper">
                        <header className="act-header">
                            <div className="act-org">
                                <DocLine
                                    value={form.org}
                                    onChange={setField('org')}
                                    placeholder="[Наименование организации]"
                                    className="doc-line--center doc-line--strong"
                                />
                            </div>

                            <div className="act-title-row">
                                <div className="act-title-no">
                                    АКТ №{' '}
                                    <DocLine
                                        value={form.number}
                                        onChange={setField('number')}
                                        width="38mm"
                                        className="doc-line--center"
                                    />
                                </div>
                                <div className="act-title">
                                    об установлении нарушения требований охраны труда
                                </div>
                            </div>

                            <div className="act-meta">
                                <div className="act-meta-left">
                                    <DocLine
                                        value={form.city}
                                        onChange={setField('city')}
                                        placeholder="[город]"
                                        width="44mm"
                                        className="doc-line--center"
                                    />
                                </div>

                                <div className="act-meta-right">
                                    «
                                    <DocLine
                                        value={form.day}
                                        onChange={setField('day')}
                                        width="10mm"
                                        className="doc-line--center"
                                    />
                                    »{' '}
                                    <DocLine
                                        value={form.month}
                                        onChange={setField('month')}
                                        width="30mm"
                                        className="doc-line--center"
                                    />{' '}
                                    20
                                    <DocLine
                                        value={form.year}
                                        onChange={setField('year')}
                                        width="10mm"
                                        className="doc-line--center"
                                    />{' '}
                                    г.
                                </div>
                            </div>
                        </header>

                        <div className="act-body">
                            <p className="act-p">Мы, нижеподписавшиеся:</p>

                            <div className="commission">
                                <div className="commission-row">
                                    <span>1.</span>
                                    <DocLine
                                        value={form.chair}
                                        onChange={setField('chair')}
                                        placeholder="[должность, ФИО]"
                                    />
                                    <span>— председатель комиссии</span>
                                </div>
                                <div className="commission-row">
                                    <span>2.</span>
                                    <DocLine
                                        value={form.member1}
                                        onChange={setField('member1')}
                                        placeholder="[должность, ФИО]"
                                    />
                                    <span>— член комиссии</span>
                                </div>
                                <div className="commission-row">
                                    <span>3.</span>
                                    <DocLine
                                        value={form.member2}
                                        onChange={setField('member2')}
                                        placeholder="[должность, ФИО]"
                                    />
                                    <span>— член комиссии</span>
                                </div>
                            </div>

                            <p className="act-p">
                                составили настоящий акт о том, что «
                                <DocLine
                                    value={form.date2}
                                    onChange={setField('date2')}
                                    width="10mm"
                                    className="doc-line--center"
                                />
                                »{' '}
                                <DocLine
                                    value={form.date2Month}
                                    onChange={setField('date2Month')}
                                    width="30mm"
                                    className="doc-line--center"
                                />{' '}
                                20
                                <DocLine
                                    value={form.year2}
                                    onChange={setField('year2')}
                                    width="10mm"
                                    className="doc-line--center"
                                />{' '}
                                г. в{' '}
                                <DocLine
                                    value={form.time}
                                    onChange={setField('time')}
                                    width="18mm"
                                    className="doc-line--center"
                                />{' '}
                                в{' '}
                                <DocLine
                                    value={form.zone}
                                    onChange={setField('zone')}
                                    width="74mm"
                                    placeholder="[зона / участок / объект]"
                                />{' '}
                                было выявлено нарушение требований охраны труда, выразившееся в следующем:
                            </p>

                            <div className="act-box">
                                <DocLine
                                    value={form.eventDesc}
                                    onChange={setField('eventDesc')}
                                    placeholder="Отсутствие световозвращающего жилета у работника ..."
                                    multiline
                                    rows={3}
                                />
                            </div>

                            <div className="norms-block">
                                <div className="norms-title">Нарушены:</div>
                                <DocLine
                                    value={form.norm1}
                                    onChange={setField('norm1')}
                                    placeholder="[локальный нормативный акт / инструкция / приказ]"
                                />
                                <DocLine
                                    value={form.norm2}
                                    onChange={setField('norm2')}
                                    placeholder="[дополнительная норма при необходимости]"
                                />
                            </div>

                            <div className="triad">
                                <div className="triad-item">
                                    <div className="triad-label">Объяснение:</div>
                                    <DocLine
                                        value={form.explanation}
                                        onChange={setField('explanation')}
                                        placeholder="Текст объяснения"
                                        multiline
                                        rows={2}
                                    />
                                </div>

                                <div className="triad-item">
                                    <div className="triad-label">Вывод комиссии:</div>
                                    <DocLine
                                        value={form.conclusion}
                                        onChange={setField('conclusion')}
                                        placeholder="Текст вывода"
                                        multiline
                                        rows={2}
                                    />
                                </div>

                                <div className="triad-item">
                                    <div className="triad-label">Меры:</div>
                                    <DocLine
                                        value={form.measures}
                                        onChange={setField('measures')}
                                        placeholder="Текст мер"
                                        multiline
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="sign-block">
                                <div className="sign-row">
                                    <span>Председатель комиссии</span>
                                    <span className="sign-line"></span>
                                    <span>/ФИО/</span>
                                </div>
                                <div className="sign-row">
                                    <span>Члены комиссии</span>
                                    <span className="sign-line"></span>
                                    <span>/ФИО/</span>
                                </div>
                                <div className="sign-row">
                                    <span>Работник ознакомлен</span>
                                    <span className="sign-line"></span>
                                    <span>/ФИО/</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}