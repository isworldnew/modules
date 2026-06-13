import './MetaInfoChips.css';
import MetaInfo from './MetaInfo/MetaInfo.jsx';

export default function MetaInfoChips({ label, info, infoType, width = 'auto', customColor }) {
    return (
        <div className="meta-info-chips" style={{ width }}>
            <div className="chips-label">{label}</div>
            {customColor ? (
                <div className="info-value" style={{ color: customColor, fontWeight: 600 }}>
                    {info}
                </div>
            ) : (
                <MetaInfo info={info} infoType={infoType} />
            )}
        </div>
    );
}