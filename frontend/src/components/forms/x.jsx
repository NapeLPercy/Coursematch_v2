eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNzk0NGY5Ny1mYjExLTRmNWQtOTgzZi03MTdkMzQ5Y2RlZGEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY1MDEyNjMwLCJleHAiOjE3NzI3NzMyMDB9.l3PR9V6XZAP8GYKAegQY434MzNTrUb2vNyk4KdHDALs

import React, { useState } from 'react';




// Main App Component with Navigation
export default function App() {
  // CSS Variables and Styles
  const styles = `
    :root {
      --primary-blue: #1e3a8a;
      --medium-blue: #2563eb;
      --light-blue: #3b82f6;
      --pale-blue: #dbeafe;
      --white: #ffffff;
      --off-white: #f8fafc;
      --text-dark: #1e293b;
      --text-gray: #475569;
      --shadow: rgba(30, 58, 138, 0.1);
    }

   

    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--off-white);
    }

    /* Navigation */
    .navbar {
      background-color: var(--primary-blue);
      color: var(--white);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px var(--shadow);
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    .nav-link {
      background: none;
      border: none;
      color: var(--white);
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-link:hover {
      background-color: var(--medium-blue);
    }

    .nav-link.active {
      background-color: var(--light-blue);
    }

    .main-content {
      flex: 1;
    }

    
    

  

    /* Responsive */
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-brand {
        font-size: 1.3rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.2rem;
      }

      .section-title {
        font-size: 1.5rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .about-title {
        font-size: 2rem;
      }
    }
  `;

  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <style>{styles}</style>
      <div className="app">
      <nav className="navbar">
        <div className="nav-brand">Course Match</div>
        <div className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentPage('about')}
          >
            About
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' ? <Home /> : <About />}
      </main>


    </div>
    </>
  );
}