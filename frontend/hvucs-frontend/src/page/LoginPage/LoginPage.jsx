import './LoginPage.css';

import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';

import LoginForm from './LoginForm/LoginForm.jsx';

export default function LoginPage() {
    return <>
        <Header />
        <LoginForm />
        <Footer />
    </>
}