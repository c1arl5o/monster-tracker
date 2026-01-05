import BurgerMenu from './BurgerMenu';
import './Header.css';

function Header({ title, isAdmin, onAdminClick }) {
  return (
    <div className="home-header">
      <h1 className="home-title">{title}</h1>
      <div className="header-actions">
        {isAdmin && (
          <button onClick={onAdminClick} className="admin-header-btn">
            Admin
          </button>
        )}
        <BurgerMenu />
      </div>
    </div>
  );
}

export default Header;
