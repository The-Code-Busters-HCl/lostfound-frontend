import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Items from './pages/Items';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="bg-light min-vh-100">
      <Navigation setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
      {currentPage === 'register' && <Register setCurrentPage={setCurrentPage} />}
      
      {currentPage === 'dashboard' && (
        localStorage.getItem('token') ? (
          <Items />
        ) : (
          <Login setCurrentPage={setCurrentPage} />
        )
      )}
    </div>
  );
}

export default App;
