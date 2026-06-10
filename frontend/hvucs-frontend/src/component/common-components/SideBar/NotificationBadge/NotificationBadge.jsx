import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../../script/executeWithTokenRefresh.js';
import { extractRoleFromToken } from '../../../../script/extractRoleTokenUtil.js';
import './NotificationBadge.css';

export default function NotificationBadge() {
    const [unprocessedCount, setUnprocessedCount] = useState(null);
    const [role, setRole] = useState(null);
    const intervalRef = useRef(null);
    const isMounted = useRef(true);

    // Функция для получения эндпоинта в зависимости от роли
    const getEndpointByRole = (userRole) => {
        switch (userRole) {
            case 'SAFETY_OFFICER':
                return '/api/accidents/unprocessed-amount';
            case 'FOREMAN':
                return '/api/reports/unprocessed-amount';
            case 'SUPERVISOR':
                return '/api/reports/event-shortcuts?documented=NON_DOCUMENTED';
            default:
                throw new Error(`Unknown role: ${userRole}`);
        }
    };

    // Функция для извлечения роли из токена
    const fetchUserRole = async () => {
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                return extractRoleFromToken(accessToken);
            });
            
            if (isMounted.current) {
                setRole(result);
                return result;
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            if (isMounted.current) {
                setRole(null);
            }
            return null;
        }
    };

    // Функция для запроса количества необработанных уведомлений
    const fetchUnprocessedAmount = async (userRole) => {
        if (!userRole) return;
        
        try {
            const endpoint = getEndpointByRole(userRole);
            
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                return { status: response.status, data: data };
            });

            // Если запрос успешен (статус 200)
            if (result.status === 200 && isMounted.current) {
                let count = 0;
                
                // Для SUPERVISOR - считаем размер массива
                if (userRole === 'SUPERVISOR') {
                    count = Array.isArray(result.data) ? result.data.length : 0;
                } else {
                    // Для SAFETY_OFFICER и FOREMAN - число
                    count = typeof result.data === 'object' ? result.data.count : result.data;
                }
                
                setUnprocessedCount(count);
            }
        } catch (error) {
            console.error('Error fetching unprocessed amount:', error);
            // При ошибке не меняем состояние, бэйдж либо скроется, либо останется с предыдущим значением
        }
    };

    // Основной эффект для инициализации
    useEffect(() => {
        isMounted.current = true;
        
        const initialize = async () => {
            // Сначала получаем роль пользователя
            const userRole = await fetchUserRole();
            
            if (userRole) {
                // Первоначальный запрос уведомлений
                await fetchUnprocessedAmount(userRole);

                // Настройка интервала для запросов каждые 2 секунды
                intervalRef.current = setInterval(() => {
                    fetchUnprocessedAmount(userRole);
                }, 2000);
            }
        };

        initialize();

        // Очистка интервала при размонтировании компонента
        return () => {
            isMounted.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); // Пустой массив зависимостей - эффект выполняется только при монтировании

    // Не показываем бэйдж, если:
    // 1. Еще не было ни одного запроса (count === null)
    // 2. Количество уведомлений === 0
    // 3. Роль не определена
    if (unprocessedCount === null || unprocessedCount === 0 || role === null) {
        return null;
    }

    // Определяем класс для стилизации в зависимости от количества цифр
    const badgeClassName = unprocessedCount >= 10 ? 'notification-badge wide' : 'notification-badge';

    return (
        <div className={badgeClassName}>
            {unprocessedCount > 99 ? '99+' : unprocessedCount}
        </div>
    );
}