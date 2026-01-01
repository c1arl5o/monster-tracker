import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './BurgerMenu.css';

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  };

  const handleNavigation = (page) => {
    // Placeholder for navigation - implement routing later
    console.log(`Navigate to ${page}`);
    setIsOpen(false);
  };

  return (
    <>
      <button className="burger-button" onClick={toggleMenu}>
        <div className={`burger-icon ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {isOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <nav className={`burger-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-items">
          <button className="menu-item" onClick={() => handleNavigation('home')}>
            Home
          </button>
          <button className="menu-item" onClick={() => handleNavigation('stats')}>
            Stats
          </button>
          <button className="menu-item" onClick={() => handleNavigation('leaderboard')}>
            Leaderboard
          </button>
          
          <div className="menu-divider"></div>
          
          <button className="menu-item sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>
    </>
  );
}

export default BurgerMenu;
