import './MetaInfoArea.css';
import MetaInfoChips from '../MetaInfoChips/MetaInfoChips.jsx';

export default function MetaInfoArea({ items = [] }) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="meta-info-area">
            <div className="meta-info-grid">
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
        </div>
    );
}