import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './BurgerMenu.css';
import { FaGithub } from 'react-icons/fa';

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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
    navigate(`/${page}`); // Use navigate for routing
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
            Feed
          </button>
          <button className="menu-item" onClick={() => handleNavigation('leaderboard')}>
            Rangliste
          </button>
          <button className="menu-item" onClick={() => handleNavigation('profile')}>
            Meine Stats
          </button>
          
          <div className="menu-divider"></div>
          
          <button className="menu-item sign-out" onClick={handleSignOut}>
            Abmelden
          </button>
          <div className="menu-divider"></div>
          <div className="menu-item" disabled>Made with 💟 by Carlo</div>
        </div>
      </nav>
    </>
  );
}

export default BurgerMenu;
