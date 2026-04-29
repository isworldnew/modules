import './NotFoundPage.css';
import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';

export default function NotFoundPage() {
    return (
        <div className="error-page-wrapper">
            <Header />
            <main className="error-main">
                <div className="error-content">
                    <h1 className="error-code">404 :(</h1>
                    <p className="error-message">Страница не найдена</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}