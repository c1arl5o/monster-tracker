import BurgerMenu from './BurgerMenu';
import './Header.css';

function Header({ title }) {
  return (
    <div className="home-header">
      <h1 className="home-title">{title}</h1>
      <BurgerMenu />
    </div>
  );
}

export default Header;
