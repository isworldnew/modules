import './StatsPage.css';
import { useState } from 'react';

import Header from '../../../../component/common-components/Header/Header.jsx';
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';

export default function StatsPage() {
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
        // {
        //     label: 'Статистика',
        //     href: '/stats',
        //     isActive: true,
        //     showBadge: false,
        // },
        {
            label: 'Личный кабинет',
            href: '/supervisor-user-page',
            isActive: false,
            showBadge: false,
        }
    ];

    const statsData = {
        totalIncidents: 847,
        realIncidents: 623,
        falseIncidents: 224,
        caughtCount: 189,
        areas: [
            { name: 'Северная площадка', total: 156, real: 112, false: 44, responses: 98, caught: 76 },
            { name: 'Южная площадка', total: 143, real: 98, false: 45, responses: 87, caught: 68 },
            { name: 'Западный склад', total: 128, real: 89, false: 39, responses: 76, caught: 59 },
            { name: 'Восточный цех', total: 112, real: 87, false: 25, responses: 72, caught: 56 },
            { name: 'Центральный вход', total: 98, real: 76, false: 22, responses: 64, caught: 48 },
            { name: 'Склад готовой продукции', total: 87, real: 69, false: 18, responses: 58, caught: 45 },
            { name: 'Административное здание', total: 65, real: 52, false: 13, responses: 42, caught: 33 },
            { name: 'Ремонтный цех', total: 58, real: 40, false: 18, responses: 35, caught: 27 }
        ],
        cameras: [
            { area: 'Северная площадка', camera: 'Камера 1', total: 78, real: 52, false: 26, accuracy: 66.7 },
            { area: 'Северная площадка', camera: 'Камера 2', total: 78, real: 60, false: 18, accuracy: 76.9 },
            { area: 'Южная площадка', camera: 'Камера 1', total: 72, real: 48, false: 24, accuracy: 66.7 },
            { area: 'Южная площадка', camera: 'Камера 2', total: 71, real: 50, false: 21, accuracy: 70.4 },
            { area: 'Западный склад', camera: 'Камера 1', total: 65, real: 44, false: 21, accuracy: 67.7 },
            { area: 'Западный склад', camera: 'Камера 2', total: 63, real: 45, false: 18, accuracy: 71.4 },
            { area: 'Восточный цех', camera: 'Камера 1', total: 56, real: 44, false: 12, accuracy: 78.6 },
            { area: 'Восточный цех', camera: 'Камера 2', total: 56, real: 43, false: 13, accuracy: 76.8 },
            { area: 'Центральный вход', camera: 'Камера 1', total: 98, real: 76, false: 22, accuracy: 77.6 },
            { area: 'Склад готовой продукции', camera: 'Камера 1', total: 87, real: 69, false: 18, accuracy: 79.3 },
            { area: 'Административное здание', camera: 'Камера 1', total: 65, real: 52, false: 13, accuracy: 80.0 },
            { area: 'Ремонтный цех', camera: 'Камера 1', total: 58, real: 40, false: 18, accuracy: 69.0 }
        ]
    };

    const topAreas = [...statsData.areas].sort((a, b) => b.total - a.total).slice(0, 5);
    const falseCameras = [...statsData.cameras].sort((a, b) => b.false - a.false).slice(0, 5);
    const maxAreaTotal = Math.max(...topAreas.map(a => a.total));
    const maxCameraFalse = Math.max(...falseCameras.map(c => c.false));

    return (
        <div className="stats-page">
            <Header />
            <div className="stats-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="stats-page__content">
                    <div className="stats-page__content-inner">
                        <PageName title="Статистика" />

                        <div className="stats-grid">
                            <div className="stats-card">
                                <div className="stats-card__label">Всего инцидентов</div>
                                <div className="stats-card__value">{statsData.totalIncidents}</div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-card__label">Реальные инциденты</div>
                                <div className="stats-card__value">{statsData.realIncidents}</div>
                                <div className="stats-card__sub">{((statsData.realIncidents / statsData.totalIncidents) * 100).toFixed(1)}% от всех</div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-card__label">Ложные срабатывания</div>
                                <div className="stats-card__value">{statsData.falseIncidents}</div>
                                <div className="stats-card__sub">{((statsData.falseIncidents / statsData.totalIncidents) * 100).toFixed(1)}% от всех</div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-card__label">Поймано нарушителей</div>
                                <div className="stats-card__value">{statsData.caughtCount}</div>
                                <div className="stats-card__sub">пойман с поличным</div>
                            </div>
                        </div>

                        <div className="stats-charts-row">
                            <div className="stats-chart-card">
                                <h3 className="stats-chart-title">Зоны с наибольшим числом нарушений</h3>
                                <div className="stats-chart-bars">
                                    {topAreas.map(area => (
                                        <div key={area.name} className="stats-chart-bar-item">
                                            <div className="stats-chart-bar-label">{area.name}</div>
                                            <div className="stats-chart-bar-container">
                                                <div 
                                                    className="stats-chart-bar" 
                                                    style={{ height: `${(area.total / maxAreaTotal) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="stats-chart-bar-value">{area.total}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="stats-chart-card">
                                <h3 className="stats-chart-title">Камеры с частыми ложными срабатываниями</h3>
                                <div className="stats-chart-bars">
                                    {falseCameras.map(camera => (
                                        <div key={camera.camera} className="stats-chart-bar-item">
                                            <div className="stats-chart-bar-label">{camera.camera}</div>
                                            <div className="stats-chart-bar-container">
                                                <div 
                                                    className="stats-chart-bar stats-chart-bar--danger" 
                                                    style={{ height: `${(camera.false / maxCameraFalse) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="stats-chart-bar-value">{camera.false}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="stats-table-card">
                            <h3 className="stats-table-title">Детализация по зонам</h3>
                            <div className="stats-table-wrapper">
                                <table className="stats-table">
                                    <thead>
                                        <tr>
                                            <th>Зона</th>
                                            <th>Всего</th>
                                            <th>Реальные</th>
                                            <th>Ложные</th>
                                            <th>Реакций</th>
                                            <th>Поймано</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statsData.areas.map(area => (
                                            <tr key={area.name}>
                                                <td>{area.name}</td>
                                                <td>{area.total}</td>
                                                <td>{area.real}</td>
                                                <td>{area.false}</td>
                                                <td>{area.responses}</td>
                                                <td>{area.caught}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="stats-table-card">
                            <h3 className="stats-table-title">Детализация по камерам</h3>
                            <div className="stats-table-wrapper">
                                <table className="stats-table">
                                    <thead>
                                        <tr>
                                            <th>Зона</th>
                                            <th>Камера</th>
                                            <th>Всего</th>
                                            <th>Реальные</th>
                                            <th>Ложные</th>
                                            <th>Точность</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statsData.cameras.map((camera, idx) => (
                                            <tr key={idx}>
                                                <td>{camera.area}</td>
                                                <td>{camera.camera}</td>
                                                <td>{camera.total}</td>
                                                <td>{camera.real}</td>
                                                <td>{camera.false}</td>
                                                <td>{camera.accuracy}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="stats-insights">
                            <div className="stats-insight stats-insight--safe">
                                <div className="stats-insight__label">Самый безопасный период</div>
                                <div className="stats-insight__value">Май 2026</div>
                                <div className="stats-insight__detail">23 инцидента</div>
                            </div>
                            <div className="stats-insight stats-insight--danger">
                                <div className="stats-insight__label">Самый опасный период</div>
                                <div className="stats-insight__value">Август 2025</div>
                                <div className="stats-insight__detail">156 инцидентов</div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}