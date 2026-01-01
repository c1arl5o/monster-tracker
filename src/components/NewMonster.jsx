import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import './NewMonster.css';

function NewMonster() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const monsters = [
    'Monster 1', 'Monster 2', 'Monster 3', 'Monster 4', 'Monster 5',
    'Monster 6', 'Monster 7', 'Monster 8', 'Monster 9', 'Monster 10'
  ];

  const filteredMonsters = monsters.filter(monster =>
    monster.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleMonsterSelect = (monster) => {
    setSelectedMonster(monster);
    setExpandedSection(null);
    setSearchQuery('');
  };

  return (
    <div className="new-monster-container">
      <BurgerMenu />

      <h1 className="new-monster-title">NEW MONSTER</h1>

      <div className="form-section" onClick={() => toggleSection('which')}>
        <h2 className="section-header">
          1. Which {selectedMonster && <span className="selected-value">({selectedMonster})</span>}
          <span className="expand-icon">{expandedSection === 'which' ? '−' : '+'}</span>
        </h2>
        {expandedSection === 'which' && (
          <div className="section-content" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Search monsters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="monster-search"
            />
            <div className="monster-list">
              {filteredMonsters.map((monster, index) => (
                <div
                  key={index}
                  className="monster-item"
                  onClick={() => handleMonsterSelect(monster)}
                >
                  {monster}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-section" onClick={() => toggleSection('when')}>
        <h2 className="section-header">
          2. When
          <span className="expand-icon">{expandedSection === 'when' ? '−' : '+'}</span>
        </h2>
        {expandedSection === 'when' && (
          <div className="section-content">
            {/* Content coming up */}
          </div>
        )}
      </div>

      <div className="form-section" onClick={() => toggleSection('photo')}>
        <h2 className="section-header">
          3. Photo
          <span className="expand-icon">{expandedSection === 'photo' ? '−' : '+'}</span>
        </h2>
        {expandedSection === 'photo' && (
          <div className="section-content">
            {/* Content coming up */}
          </div>
        )}
      </div>

      <div className="form-section" onClick={() => toggleSection('notes')}>
        <h2 className="section-header">
          4. Additional Notes
          <span className="expand-icon">{expandedSection === 'notes' ? '−' : '+'}</span>
        </h2>
        {expandedSection === 'notes' && (
          <div className="section-content">
            {/* Content coming up */}
          </div>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate('/')}>
        Back to Feed
      </button>
    </div>
  );
}

export default NewMonster;
