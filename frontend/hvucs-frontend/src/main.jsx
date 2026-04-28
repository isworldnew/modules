import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './App.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/analysis" replace />} /> */}
        {/* <Route path='/analysis' element={<AnalysisPage />}/> */}
      </Routes>
    </Router>
  </React.StrictMode>,
)
