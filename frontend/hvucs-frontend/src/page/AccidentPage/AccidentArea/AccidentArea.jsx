import './AccidentArea.css';

import '../AccidentHeader/AccidentHeader.jsx';
import '../AccidentSource/AccidentSource.jsx';

import AccidentHeader from '../AccidentHeader/AccidentHeader.jsx';
import AccidentSource from '../AccidentSource/AccidentSource.jsx';


export default function AccidentArea() {
    return <>
        <AccidentHeader id={1} />
        <AccidentSource label={"Зона"} value={"Северная площадка"} />
    </>
}