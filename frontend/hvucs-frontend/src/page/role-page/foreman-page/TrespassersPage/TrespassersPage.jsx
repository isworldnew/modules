import './TrespassersPage.css';
import { useState, useEffect } from 'react';

import Header from '../../../../component/common-components/Header/Header.jsx'
import Footer from '../../../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../../../component/common-components/PageName/PageName.jsx';
import InlineTextInputField from '../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
import ActionButton from '../../../../component/common-components/ActionButton/ActionButton.jsx';
import ProgressLoader from '../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
import SearchResultItem from './SearchResultItem/SearchResultItem.jsx';
import { executeWithTokenRefresh } from '../../../../script/executeWithTokenRefresh.js';
import { extractRoleFromToken } from '../../../../script/extractRoleTokenUtil.js';

export default function TrespassersPage() {
    const [userRole, setUserRole] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchUserRole = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const role = extractRoleFromToken(accessToken);
                setUserRole(role);
                return role;
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
        return null;
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

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
                    isActive: true,
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
        
        // Для роли FOREMAN и всех остальных
        return [
            { 
                label: 'Нарушители', 
                href: '/trespassers', 
                isActive: true,
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

    const handleSearch = async () => {
        console.log('Поиск нарушителей, запрос:', searchValue);
        
        if (!searchValue || searchValue.trim() === '') {
            console.log('Поисковый запрос пуст');
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(`/api/trespassers/search?searchRequest=${encodeURIComponent(searchValue.trim())}`, {
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
                    console.error('Ошибка парсинга ответа:', e);
                    data = null;
                }

                console.log('Ответ API:', { status: response.status, data });
                return { status: response.status, data: data };
            });

            if (result.status === 200 && result.data) {
                console.log('Найдено нарушителей:', result.data.length);
                console.log('Данные нарушителей:', result.data);
                setSearchResults(result.data);
            } else {
                console.log('Ничего не найдено или ошибка');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Ошибка при поиске нарушителей:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        console.log('Очистка поиска');
        setSearchValue('');
        setSearchResults([]);
        setHasSearched(false);
    };

    console.log('Состояние поиска:', { hasSearched, isSearching, resultsCount: searchResults.length, results: searchResults });

    const navItems = getNavItems();

    return (
        <div className="trespassers-page">
            <Header />
            <div className="trespassers-page__layout">
                <SideBar 
                    navItems={navItems} 
                    showNotificationBadge={true}
                />
                <main className="trespassers-page__content">
                    <div className="trespassers-page__content-inner">
                        <PageName title="Нарушители" />
                        
                        <div className="trespassers-search-section">
                            <div className="trespassers-search-fields">
                                <div className="trespassers-search-input">
                                    <InlineTextInputField
                                        name="ФИО нарушителя"
                                        width="100%"
                                        placeholder="Введите фамилию, имя или отчество"
                                        value={searchValue}
                                        onChange={setSearchValue}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="trespassers-search-actions">
                                    <ActionButton 
                                        onClick={handleSearch}
                                        width="auto"
                                        disabled={isSearching}
                                    >
                                        {isSearching ? 'Поиск...' : 'Найти'}
                                    </ActionButton>
                                    <ActionButton 
                                        onClick={handleClear}
                                        width="auto"
                                        variant="secondary"
                                    >
                                        Очистить
                                    </ActionButton>
                                </div>
                            </div>
                        </div>

                        <div className="trespassers-results">
                            {isSearching && <ProgressLoader message="Поиск нарушителей..." />}
                            
                            {!isSearching && hasSearched && searchResults.length === 0 && (
                                <div className="trespassers-empty">
                                    <p>Нарушители не найдены</p>
                                </div>
                            )}
                            
                            {!isSearching && searchResults.length > 0 && (
                                <div className="trespassers-list">
                                    {searchResults.map((trespasser) => (
                                        <SearchResultItem
                                            key={trespasser.id}
                                            id={trespasser.id}
                                            name={trespasser.name}
                                            post={trespasser.post}
                                            relation={trespasser.relation}
                                            organizationEmail={trespasser.organizationEmail}
                                            responsesAmount={trespasser.responsesAmount}
                                        />
                                    ))}
                                </div>
                            )}
                            
                            {!isSearching && !hasSearched && (
                                <div className="trespassers-empty">
                                    <p>Введите имя нарушителя для поиска</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
// import './TrespassersPage.css';
// import { useState } from 'react';

// import Header from '../../../../component/common-components/Header/Header.jsx'
// import Footer from '../../../../component/common-components/Footer/Footer.jsx';
// import SideBar from '../../../../component/common-components/SideBar/SideBar.jsx';
// import PageName from '../../../../component/common-components/PageName/PageName.jsx';
// import InlineTextInputField from '../../../../component/common-components/InlineTextInputField/InlineTextInputField.jsx';
// import ActionButton from '../../../../component/common-components/ActionButton/ActionButton.jsx';
// import ProgressLoader from '../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';
// import SearchResultItem from './SearchResultItem/SearchResultItem.jsx';
// import { executeWithTokenRefresh } from '../../../../script/executeWithTokenRefresh.js';

// export default function TrespassersPage() {
//     const navItems = [
//         { 
//             label: 'Нарушители', 
//             href: '/trespassers', 
//             isActive: true,
//             showBadge: false,
//         }, 
//         { 
//             label: 'Уведомления', 
//             href: '/report-notifications', 
//             isActive: false,
//             showBadge: true,
//         },
//         {
//             label: 'Принятые меры',
//             href: '/responses',
//             isActive: false,
//             showBadge: false,
//         },
//         {
//             label: 'Личный кабинет',
//             href: '/foreman-user-page',
//             isActive: false,
//             showBadge: false,
//         }
//     ];

//     const [searchValue, setSearchValue] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [isSearching, setIsSearching] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);

//     const getRelationText = (relation) => {
//         switch(relation) {
//             case 'INNER_EMPLOYEE':
//                 return 'Внутренний сотрудник';
//             case 'OUTER_EMPLOYEE':
//                 return 'Сотрудник внешней организации';
//             default:
//                 return relation || 'Не указано';
//         }
//     };

//     const handleSearch = async () => {
//         console.log('Поиск нарушителей, запрос:', searchValue);
        
//         if (!searchValue || searchValue.trim() === '') {
//             console.log('Поисковый запрос пуст');
//             return;
//         }

//         setIsSearching(true);
//         setHasSearched(true);

//         try {
//             const result = await executeWithTokenRefresh(async (accessToken) => {
//                 const response = await fetch(`/api/trespassers/search?searchRequest=${encodeURIComponent(searchValue.trim())}`, {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${accessToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 let data = null;
//                 try {
//                     data = await response.json();
//                 } catch (e) {
//                     console.error('Ошибка парсинга ответа:', e);
//                     data = null;
//                 }

//                 console.log('Ответ API:', { status: response.status, data });
//                 return { status: response.status, data: data };
//             });

//             if (result.status === 200 && result.data) {
//                 console.log('Найдено нарушителей:', result.data.length);
//                 console.log('Данные нарушителей:', result.data);
//                 setSearchResults(result.data);
//             } else {
//                 console.log('Ничего не найдено или ошибка');
//                 setSearchResults([]);
//             }
//         } catch (error) {
//             console.error('Ошибка при поиске нарушителей:', error);
//             setSearchResults([]);
//         } finally {
//             setIsSearching(false);
//         }
//     };

//     const handleClear = () => {
//         console.log('Очистка поиска');
//         setSearchValue('');
//         setSearchResults([]);
//         setHasSearched(false);
//     };

//     console.log('Состояние поиска:', { hasSearched, isSearching, resultsCount: searchResults.length, results: searchResults });

//     return (
//         <div className="trespassers-page">
//             <Header />
//             <div className="trespassers-page__layout">
//                 <SideBar 
//                     navItems={navItems} 
//                     showNotificationBadge={true}
//                 />
//                 <main className="trespassers-page__content">
//                     <div className="trespassers-page__content-inner">
//                         <PageName title="Нарушители" />
                        
//                         <div className="trespassers-search-section">
//                             <div className="trespassers-search-fields">
//                                 <div className="trespassers-search-input">
//                                     <InlineTextInputField
//                                         name="ФИО нарушителя"
//                                         width="100%"
//                                         placeholder="Введите фамилию, имя или отчество"
//                                         value={searchValue}
//                                         onChange={setSearchValue}
//                                         autoComplete="off"
//                                     />
//                                 </div>
//                                 <div className="trespassers-search-actions">
//                                     <ActionButton 
//                                         onClick={handleSearch}
//                                         width="auto"
//                                         disabled={isSearching}
//                                     >
//                                         {isSearching ? 'Поиск...' : 'Найти'}
//                                     </ActionButton>
//                                     <ActionButton 
//                                         onClick={handleClear}
//                                         width="auto"
//                                         variant="secondary"
//                                     >
//                                         Очистить
//                                     </ActionButton>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="trespassers-results">
//                             {isSearching && <ProgressLoader message="Поиск нарушителей..." />}
                            
//                             {!isSearching && hasSearched && searchResults.length === 0 && (
//                                 <div className="trespassers-empty">
//                                     <p>Нарушители не найдены</p>
//                                 </div>
//                             )}
                            
//                             {!isSearching && searchResults.length > 0 && (
//                                 <div className="trespassers-list">
//                                     {searchResults.map((trespasser) => (
//                                         <SearchResultItem
//                                             key={trespasser.id}
//                                             id={trespasser.id}
//                                             name={trespasser.name}
//                                             post={trespasser.post}
//                                             relation={trespasser.relation}
//                                             organizationEmail={trespasser.organizationEmail}
//                                             responsesAmount={trespasser.responsesAmount}
//                                         />
//                                     ))}
//                                 </div>
//                             )}
                            
//                             {!isSearching && !hasSearched && (
//                                 <div className="trespassers-empty">
//                                     <p>Введите имя нарушителя для поиска</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </main>
//             </div>
//             <Footer />
//         </div>
//     );
// }