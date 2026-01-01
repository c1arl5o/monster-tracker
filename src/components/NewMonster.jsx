import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import { monsters } from '../data/monsters';
import './NewMonster.css';
import { supabase } from '../supabaseClient';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';

function NewMonster() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const filteredMonsters = monsters.filter(monster =>
    monster.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMonsterSelect = (monster) => {
    setSelectedMonster(monster.name);
    setExpandedSection(null);
    setSearchQuery('');
  };

  const handleUseCurrentDateTime = () => {
    const now = new Date();
    setSelectedDateTime(now);
    setCustomDate('');
    setCustomTime('');
    setExpandedSection(null);
  };

  const handleCustomDateTime = () => {
    if (customDate && customTime) {
      const dateTime = new Date(`${customDate}T${customTime}`);
      setSelectedDateTime(dateTime);
      setExpandedSection(null);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setUploading(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const fileName = `${uuidv4()}-${compressedFile.name}`;
      
      const { data, error } = await supabase.storage
        .from('feed-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('feed-images')
        .getPublicUrl(fileName);

      setPhotoUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error.message);
    } finally {
      setUploading(false);
      setExpandedSection(null);
    }
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
                  {monster.image && (
                    <img 
                      src={monster.image} 
                      alt={monster.name}
                      className="monster-image"
                    />
                  )}
                  <span className="monster-name">{monster.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-section" onClick={() => toggleSection('when')}>
        <h2 className="section-header">
          2. When {selectedDateTime && <span className="selected-value">({formatDateTime(selectedDateTime)})</span>}
          <span className="expand-icon">{expandedSection === 'when' ? '−' : '+'}</span>
        </h2>
        {expandedSection === 'when' && (
          <div className="section-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="current-datetime-btn"
              onClick={handleUseCurrentDateTime}
            >
              Use Current Date & Time
            </button>
            
            <div className="custom-datetime-divider">OR</div>
            
            <div className="custom-datetime">
              <label className="datetime-label">Custom Date & Time:</label>
              <div className="datetime-inputs">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="datetime-input"
                />
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="datetime-input"
                />
              </div>
              <button 
                className="set-datetime-btn"
                onClick={handleCustomDateTime}
                disabled={!customDate || !customTime}
              >
                Set Custom Date & Time
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="form-section" onClick={() => toggleSection('photo')}>
        <h2 className="section-header">
          3. Photo {photoUrl && <span className="selected-value">(✓)</span>}
          <span className="expand-icon">{expandedSection === 'photo' ? '−' : '+'}</span>
        </h2>
        {expandedSection === 'photo' && (
          <div className="section-content" onClick={(e) => e.stopPropagation()}>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="photo-upload" className="upload-btn">
              {uploading ? 'Uploading...' : 'Choose or Take Photo'}
            </label>
            {photoUrl && (
              <div className="image-preview">
                <img src={photoUrl} alt="Monster preview" />
              </div>
            )}
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
