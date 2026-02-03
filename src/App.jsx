import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CountryDetail from './pages/CountryDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1>NationNote</h1>
            <p>Website Informasi Negara Dunia</p>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:name" element={<CountryDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;