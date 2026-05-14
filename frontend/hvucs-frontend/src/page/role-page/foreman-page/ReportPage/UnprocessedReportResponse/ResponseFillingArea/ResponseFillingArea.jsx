import './ResponseFillingArea.css';
import { useRef } from 'react';
import BigTextInputField from '../../../../../../component/common-components/BigTextInputField/BigTextInputField.jsx';
import RadioButtonArea from '../../../../../../component/common-components/RadioButtonsArea/RadioButtonsArea.jsx';
import ActionButton from '../../../../../../component/common-components/ActionButton/ActionButton.jsx';

export default function ResponseFillingArea() {
    const descriptionRef = useRef(null);
    const radioAreaRef = useRef(null);

    const radioOptions = [
        { label: "Нарушитель пойман с поличным", value: "CAUGHT", color: "#4caf50" },
        { label: "Не застал нарушителя", value: "NOT_CAUGHT", color: "#ef5350" }
    ];

    const handleSubmit = () => {
        const selectedValue = radioAreaRef.current?.getSelectedValue();
        const description = descriptionRef.current?.getValue() || null;
        
        console.log('Selected:', selectedValue);
        console.log('Description:', description);
    };

    return (
        <div className="response-filling-area">
            <div className="response-filling-label">Реакция на инцидент:</div>
            
            <div className="response-filling-content">
                <RadioButtonArea
                    ref={radioAreaRef}
                    label="Результат разбирательства:"
                    options={radioOptions}
                />
                
                <BigTextInputField
                    ref={descriptionRef}
                    name="Комментарий к разбирательству:"
                    width="100%"
                    height="120px"
                    placeholder="Опишите принятые меры или комментарий..."
                />
                
                <div className="response-filling-actions">
                    <ActionButton 
                        onClick={handleSubmit}
                        width="auto"
                    >
                        Зафиксировать разбирательство
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}