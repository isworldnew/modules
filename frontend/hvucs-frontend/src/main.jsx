import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './App.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './page/LoginPage/LoginPage.jsx';
import InitPage from "./page/InitPage/InitPage.jsx";

import SafetyOfficerUserPage from './page/SafetyOfficerUserPage/SafetyOfficerUserPage.jsx';
import NotificationsPage from "./page/NotificationsPage/NotificationsPage.jsx";
import AccidentsPage from './page/AccidentsPage/AccidentsPage.jsx';
import AccidentPage from './page/AccidentPage/AccidentPage.jsx';

import AdminUserPage from './page/role-page/admin-page/AdminUserPage/AdminUserPage.jsx';
import UserManagementPage from './page/role-page/admin-page/UserManagementPage/UserManagementPage.jsx';
import AreaManagementPage from './page/role-page/admin-page/AreaManagementPage/AreaManagementPage.jsx';
import CameraManagementPage from './page/role-page/admin-page/CameraManagementPage/CameraManagementPage.jsx';

import ForemanUserPage from './page/role-page/foreman-page/ForemanUserPage/ForemanUserPage.jsx';
import TrespassersPage from './page/role-page/foreman-page/TrespassersPage/TrespassersPage.jsx';
import ReportNotificationsPage from './page/role-page/foreman-page/ReportNotificationsPage/ReportNotificationsPage.jsx';
import ReportPage from './page/role-page/foreman-page/ReportPage/ReportPage.jsx';
import ResponsesPage from './page/role-page/foreman-page/ResponsesPage/ResponsesPage.jsx';

import SupervisorUserPage from './page/role-page/supervisor-page/SupervisorUserPage/SupervisorUserPage.jsx';
import EmployeesPage from './page/role-page/supervisor-page/EmployeesPage/EmployeesPage.jsx';
import AreasPage from './page/role-page/supervisor-page/AreasPage/AreasPage.jsx';
import CamerasPage from './page/role-page/supervisor-page/CamerasPage/CamerasPage.jsx';
import EventsArchive from './page/role-page/supervisor-page/EventsArchive/EventsArchive.jsx';
import StatsPage from './page/role-page/supervisor-page/StatsPage/StatsPage.jsx';
import AccidentsToAssure from './page/role-page/supervisor-page/AccidentsToAssure/AccidentsToAssure.jsx';
import DocumentalCommiting from './page/role-page/supervisor-page/DocumentalCommiting/DocumentalCommiting.jsx';

import ForbiddenPage from './page/ForbiddenPage/ForbiddenPage.jsx';
import NotFoundPage from './page/NotFoundPage/NotFoundPage.jsx';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<InitPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/forbidden' element={<ForbiddenPage />}/>
        <Route path='/not-found' element={<NotFoundPage />}/>

        {/* страницы для роли SAFETY_OFFICER */}
        <Route path='/safety-officer-user-page' element={<SafetyOfficerUserPage />}/>
        <Route path='/notifications' element={<NotificationsPage />}/>
        <Route path='/accidents' element={<AccidentsPage />}/>
        <Route path='/accident/:id' element={<AccidentPage />}/>

        {/* страницы для роли ADMIN */}
        <Route path='/admin-user-page' element={<AdminUserPage />}/>
        <Route path='/users' element={<UserManagementPage />}/>
        <Route path='/areas' element={<AreaManagementPage />}/>
        <Route path='/cameras' element={<CameraManagementPage />}/>

        {/* страницы для роли FOREMAN */}
        <Route path='/foreman-user-page' element={<ForemanUserPage />}/>
        <Route path='/trespassers' element={<TrespassersPage />}/>
        <Route path='/report-notifications' element={<ReportNotificationsPage />}/>
        <Route path='/report/:id' element={<ReportPage />}/>
        <Route path='/responses' element={<ResponsesPage />}/>

        {/* страницы для роли SUPERVISOR */}
        <Route path='/supervisor-user-page' element={<SupervisorUserPage />}/>
        <Route path='/employees' element={<EmployeesPage />}/>
        <Route path='/areas-page' element={<AreasPage />}/>
        <Route path='/cameras-page' element={<CamerasPage />}/>
        <Route path='/archive' element={<EventsArchive />}/>
        <Route path='/events-to-document' element={<AccidentsToAssure />}/>
        <Route path='/stats' element={<StatsPage />}/>
        <Route path='/documental-commiting/:id' element={<DocumentalCommiting />}/>
        

      </Routes>
    </Router>
  </React.StrictMode>,
)
