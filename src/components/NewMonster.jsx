import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import './NewMonster.css';

function NewMonster() {
  const navigate = useNavigate();

  return (
    <div className="new-monster-container">
      <BurgerMenu />

      <h1 className="new-monster-title">NEW MONSTER</h1>

      <div className="form-section">
        <p>Create your monster here...</p>
      </div>

      <button className="back-btn" onClick={() => navigate('/')}>
        Back to Feed
      </button>
    </div>
  );
}

export default NewMonster;
