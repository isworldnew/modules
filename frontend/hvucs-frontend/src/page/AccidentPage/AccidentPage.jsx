import './AccidentPage.css';

import Header from '../../component/common-components/Header/Header.jsx';
import Footer from '../../component/common-components/Footer/Footer.jsx';
import SideBar from '../../component/common-components/SideBar/SideBar.jsx';
import PageName from '../../component/common-components/PageName/PageName.jsx';

import AccidentArea from './AccidentArea/AccidentArea.jsx';

export default function AccidentPage() {
    return <>
        <div className="accident-page-wrapper">
            <Header />
            
            <div className="accident-layout">
                <SideBar activePage="NULL" />
                
                <main className="accident-content">
                    <PageName title="Просмотр инцидента" />
                    <AccidentArea />
                </main>
            </div>
            
            <Footer />
        </div>
    </>
}