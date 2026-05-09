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

import ForbiddenPage from './page/ForbiddenPage/ForbiddenPage.jsx';
import NotFoundPage from './page/NotFoundPage/NotFoundPage.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<InitPage />}/>
        <Route path='/login' element={<LoginPage />}/>

        {/* страницы для роли SAFETY_OFFICER */}

        <Route path='/safety-officer-user-page' element={<SafetyOfficerUserPage />}/>
        <Route path='/notifications' element={<NotificationsPage />}/>
        <Route path='/accidents' element={<AccidentsPage />}/>
        <Route path='/accident/:id' element={<AccidentPage />}/>

        <Route path='/not-found' element={<NotFoundPage />}/>
        <Route path='/forbidden' element={<ForbiddenPage />}/>

        
        {/* <Route path="/" element={<Navigate to="/analysis" replace />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>,
)
