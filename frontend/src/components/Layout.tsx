import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="container main-content">
        {children}
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 PWA Bulletin Board</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
