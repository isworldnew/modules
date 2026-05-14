import './ResponseFillingArea.css';

import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import BigTextInputField from '../../../../../../component/common-components/BigTextInputField/BigTextInputField.jsx';
import RadioButtonArea from '../../../../../../component/common-components/RadioButtonsArea/RadioButtonsArea.jsx';
import ActionButton from '../../../../../../component/common-components/ActionButton/ActionButton.jsx';
import { executeWithTokenRefresh } from '../../../../../../script/executeWithTokenRefresh.js';

import TrespasserSearchArea from './TrespasserSearchArea/TrespasserSearchArea.jsx';
import TrespasserRegistrationArea from './TrespasserRegistrationArea/TrespasserRegistrationArea.jsx';

import ModalWindow from '../../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
import ProgressLoader from '../../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';

export default function ResponseFillingArea() {
    const [searchParams] = useSearchParams();
    const accidentReportId = searchParams.get('reportId');
    
    console.log('ResponseFillingArea accidentReportId:', accidentReportId);
    
    const descriptionRef = useRef(null);
    const radioAreaRef = useRef(null);
    const searchAreaRef = useRef(null);
    const registrationAreaRef = useRef(null);

    const [activeSection, setActiveSection] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const radioOptions = [
        {
            label: 'Нарушитель пойман с поличным',
            value: 'RED_HANDED_CATCH',
            color: '#4caf50'
        },
        {
            label: 'Не застал нарушителя',
            value: 'NOTED',
            color: '#ef5350'
        }
    ];

    const openModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    const handleSectionToggle = (section) => {
        if (activeSection === section) {
            if (section === 'search') {
                searchAreaRef.current?.handleClear();
            }
            if (section === 'registration') {
                registrationAreaRef.current?.handleClear();
            }
            setActiveSection(null);
            return;
        }
        setActiveSection(section);
    };

    const handleSubmit = async () => {
        const responseType = radioAreaRef.current?.getSelectedValue() || null;
        const responseReport = descriptionRef.current?.getValue()?.trim() || null;
        const searchData = searchAreaRef.current?.getData();
        const registrationData = registrationAreaRef.current?.getData();

        if (!responseType) {
            openModal('Выберите результат разбирательства');
            return;
        }

        const hasSearch = !!searchData?.searchValue?.trim();
        const hasRegistration = !!registrationData?.name?.trim() ||
            !!registrationData?.post?.trim() ||
            !!registrationData?.email?.trim() ||
            !!registrationData?.relation;

        if (hasSearch && hasRegistration) {
            openModal('Можно использовать либо поиск, либо регистрацию');
            return;
        }

        let trespasserId = null;
        let trespasser = null;

        if (hasSearch) {
            if (!searchData?.selectedTrespasser?.id) {
                openModal('Нарушитель не выбран из поиска');
                return;
            }
            trespasserId = searchData.selectedTrespasser.id;
        }

        if (hasRegistration) {
            const { name, post, relation, email } = registrationData;

            if (!name?.trim()) {
                openModal('Введите имя сотрудника');
                return;
            }
            if (!relation) {
                openModal('Выберите тип сотрудника');
                return;
            }
            if (!email?.trim()) {
                openModal('Введите email');
                return;
            }
            if (!registrationAreaRef.current?.validateEmail()) {
                openModal('Введите корректный email');
                return;
            }

            trespasser = {
                name: name.trim(),
                post: post?.trim() || null,
                relation: relation,
                email: email.trim()
            };
        }

        const requestBody = {
            responseType,
            responseReport,
            trespasserId,
            trespasser
        };

        setIsLoading(true);

        try {
            const result = await executeWithTokenRefresh(async (accessToken) => {
                const response = await fetch(`/api/responses/accident/${accidentReportId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                return { status: response.status };
            });

            if (result.status === 201) {
                window.location.href = '/report-notifications';
            } else {
                openModal('Произошла ошибка при отправке данных');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error submitting response:', error);
            openModal('Не удалось подключиться к серверу');
            setIsLoading(false);
        }
    };

    return (
        <div className="response-filling-area">
            <div className="response-filling-label">
                Принятые меры:
            </div>

            <div className="response-filling-content">
                <RadioButtonArea
                    ref={radioAreaRef}
                    name="response-type"
                    label="Результат разбирательства:"
                    options={radioOptions}
                />

                <TrespasserSearchArea
                    ref={searchAreaRef}
                    isExpanded={activeSection === 'search'}
                    onToggle={() => handleSectionToggle('search')}
                />

                <TrespasserRegistrationArea
                    ref={registrationAreaRef}
                    isExpanded={activeSection === 'registration'}
                    onToggle={() => handleSectionToggle('registration')}
                />

                <BigTextInputField
                    ref={descriptionRef}
                    name="Комментарий к разбирательству:"
                    width="100%"
                    height="120px"
                    placeholder="Опишите меры..."
                />

                <div className="response-filling-actions">
                    <ActionButton onClick={handleSubmit} width="auto">
                        Зафиксировать разбирательство
                    </ActionButton>
                </div>
            </div>

            <ModalWindow
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />

            {isLoading && <ProgressLoader message="Отправка данных..." />}
        </div>
    );
}
// import './ResponseFillingArea.css';

// import { useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';

// import BigTextInputField from '../../../../../../component/common-components/BigTextInputField/BigTextInputField.jsx';
// import RadioButtonArea from '../../../../../../component/common-components/RadioButtonsArea/RadioButtonsArea.jsx';
// import ActionButton from '../../../../../../component/common-components/ActionButton/ActionButton.jsx';
// import { executeWithTokenRefresh } from '../../../../../../script/executeWithTokenRefresh.js';

// import TrespasserSearchArea from './TrespasserSearchArea/TrespasserSearchArea.jsx';
// import TrespasserRegistrationArea from './TrespasserRegistrationArea/TrespasserRegistrationArea.jsx';

// import ModalWindow from '../../../../../../component/common-components/ModalWindow/ModalWindow.jsx';
// import ProgressLoader from '../../../../../../component/common-components/ProgressLoader/ProgressLoader.jsx';

// export default function ResponseFillingArea() {
//     const { id } = useParams();
//     const descriptionRef = useRef(null);
//     const radioAreaRef = useRef(null);
//     const searchAreaRef = useRef(null);
//     const registrationAreaRef = useRef(null);

//     const [activeSection, setActiveSection] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [modalMessage, setModalMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const radioOptions = [
//         {
//             label: 'Нарушитель пойман с поличным',
//             value: 'RED_HANDED_CATCH',
//             color: '#4caf50'
//         },
//         {
//             label: 'Не застал нарушителя',
//             value: 'NOTED',
//             color: '#ef5350'
//         }
//     ];

//     const openModal = (message) => {
//         setModalMessage(message);
//         setModalOpen(true);
//     };

//     const handleSectionToggle = (section) => {
//         if (activeSection === section) {
//             if (section === 'search') {
//                 searchAreaRef.current?.handleClear();
//             }
//             if (section === 'registration') {
//                 registrationAreaRef.current?.handleClear();
//             }
//             setActiveSection(null);
//             return;
//         }
//         setActiveSection(section);
//     };

//     const handleSubmit = async () => {
//         const responseType = radioAreaRef.current?.getSelectedValue() || null;
//         const responseReport = descriptionRef.current?.getValue()?.trim() || null;
//         const searchData = searchAreaRef.current?.getData();
//         const registrationData = registrationAreaRef.current?.getData();

//         if (!responseType) {
//             openModal('Выберите результат разбирательства');
//             return;
//         }

//         const hasSearch = !!searchData?.searchValue?.trim();
//         const hasRegistration = !!registrationData?.name?.trim() ||
//             !!registrationData?.post?.trim() ||
//             !!registrationData?.email?.trim() ||
//             !!registrationData?.relation;

//         if (hasSearch && hasRegistration) {
//             openModal('Можно использовать либо поиск, либо регистрацию');
//             return;
//         }

//         let trespasserId = null;
//         let trespasser = null;

//         if (hasSearch) {
//             if (!searchData?.selectedTrespasser?.id) {
//                 openModal('Нарушитель не выбран из поиска');
//                 return;
//             }
//             trespasserId = searchData.selectedTrespasser.id;
//         }

//         if (hasRegistration) {
//             const { name, post, relation, email } = registrationData;

//             if (!name?.trim()) {
//                 openModal('Введите имя сотрудника');
//                 return;
//             }
//             if (!relation) {
//                 openModal('Выберите тип сотрудника');
//                 return;
//             }
//             if (!email?.trim()) {
//                 openModal('Введите email');
//                 return;
//             }
//             if (!registrationAreaRef.current?.validateEmail()) {
//                 openModal('Введите корректный email');
//                 return;
//             }

//             trespasser = {
//                 name: name.trim(),
//                 post: post?.trim() || null,
//                 relation: relation,
//                 email: email.trim()
//             };
//         }

//         const requestBody = {
//             responseType,
//             responseReport,
//             trespasserId,
//             trespasser
//         };

//         setIsLoading(true);

//         try {
//             const result = await executeWithTokenRefresh(async (accessToken) => {
//                 const response = await fetch(`/api/responses/accident/${id}`, {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${accessToken}`,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(requestBody)
//                 });
//                 return { status: response.status };
//             });

//             if (result.status === 201) {
//                 window.location.href = '/report-notifications';
//             } else {
//                 openModal('Произошла ошибка при отправке данных');
//                 setIsLoading(false);
//             }
//         } catch (error) {
//             console.error('Error submitting response:', error);
//             openModal('Не удалось подключиться к серверу');
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="response-filling-area">
//             <div className="response-filling-label">
//                 Принятые меры:
//             </div>

//             <div className="response-filling-content">
//                 <RadioButtonArea
//                     ref={radioAreaRef}
//                     name="response-type"
//                     label="Результат разбирательства:"
//                     options={radioOptions}
//                 />

//                 <TrespasserSearchArea
//                     ref={searchAreaRef}
//                     isExpanded={activeSection === 'search'}
//                     onToggle={() => handleSectionToggle('search')}
//                 />

//                 <TrespasserRegistrationArea
//                     ref={registrationAreaRef}
//                     isExpanded={activeSection === 'registration'}
//                     onToggle={() => handleSectionToggle('registration')}
//                 />

//                 <BigTextInputField
//                     ref={descriptionRef}
//                     name="Комментарий к разбирательству:"
//                     width="100%"
//                     height="120px"
//                     placeholder="Опишите меры..."
//                 />

//                 <div className="response-filling-actions">
//                     <ActionButton onClick={handleSubmit} width="auto">
//                         Зафиксировать разбирательство
//                     </ActionButton>
//                 </div>
//             </div>

//             <ModalWindow
//                 isOpen={modalOpen}
//                 message={modalMessage}
//                 onClose={() => setModalOpen(false)}
//             />

//             {isLoading && <ProgressLoader message="Отправка данных..." />}
//         </div>
//     );
// }