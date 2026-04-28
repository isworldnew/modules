import './MetaInfoChips.css';
import MetaInfo from './MetaInfo/MetaInfo.jsx';

export default function MetaInfoChips({ label, info, infoType, width = 'auto' }) {
    return (
        <div className="meta-info-chips" style={{ width }}>
            <div className="chips-label">{label}</div>
            <MetaInfo info={info} infoType={infoType} />
        </div>
    );
}