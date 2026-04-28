import './ProcessedReportArea.css';
import MetaInfoChips from '../MetaInfoChips/MetaInfoChips.jsx';

export default function ProcessedReportArea({ items = [] }) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="processed-report-area">
            {items.map((item, index) => (
                <MetaInfoChips
                    key={index}
                    label={item.label}
                    info={item.info}
                    infoType={item.infoType}
                    width="100%"
                />
            ))}
        </div>
    );
}