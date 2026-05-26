import { useState } from 'react';
import './Act.css';
import DocLine from '../document-components/DocLine/DocLine.jsx';

export default function Act() {
  const [form, setForm] = useState({
    org: '',
    number: '',
    city: '',
    day: '',
    month: '',
    year: '',
    date2: '',
    time: '',
    zone: '',
    chair: '',
    member1: '',
    member2: '',
    eventDesc: '',
    norm1: '',
    norm2: '',
    explanation: '',
    conclusion: '',
    measures: '',
  });

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
                » 20
                <DocLine
                  value={form.year}
                  onChange={setField('year')}
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