import { useState, useEffect, useRef } from 'react';
import { executeWithTokenRefresh } from '../../../../script/executeWithTokenRefresh.js';
import './NotificationBadge.css';

export default function NotificationBadge() {
    const [unprocessedCount, setUnprocessedCount] = useState(null);
    const intervalRef = useRef(null);
    const isMounted = useRef(true);

    // Функция для запроса количества необработанных уведомлений
    const fetchUnprocessedAmount = async () => {
        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch('/api/accidents/unprocessed-amount', {
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
                // result.data - это само число (количество уведомлений)
                const count = typeof result.data === 'object' ? result.data.count : result.data;
                setUnprocessedCount(count);
            }
        } catch (error) {
            console.error('Error fetching unprocessed amount:', error);
            // При ошибке не меняем состояние, бэйдж либо скроется, либо останется с предыдущим значением
        }
    };

    useEffect(() => {
        isMounted.current = true;
        
        // Первоначальный запрос при монтировании компонента
        fetchUnprocessedAmount();

        // Настройка интервала для запросов каждые 2 секунды
        intervalRef.current = setInterval(() => {
            fetchUnprocessedAmount();
        }, 2000);

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
    if (unprocessedCount === null || unprocessedCount === 0) {
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