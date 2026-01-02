import React, { useState } from 'react';
import './Tutorial.css';

import image1 from '../assets/tutorial/IMG_2027.jpg';
import image2 from '../assets/tutorial/IMG_2028.jpg';
import image3 from '../assets/tutorial/IMG_2029.jpg';
import image4 from '../assets/tutorial/IMG_2030.jpg';
import image5 from '../assets/tutorial/IMG_2031.jpg';

const tutorialImages = [image1, image2, image3, image4, image5];

const Tutorial = ({ onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % tutorialImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + tutorialImages.length) % tutorialImages.length);
  };

  const handleClose = () => {
    localStorage.setItem('tutorialSeen', 'true');
    onClose();
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <div className="tutorial-text">
          <p>Weil ich zu broke bin für eine Apple Developer Lizenz ist das hier eine Web App. Aber so könnt ihr die Seite auf euren Home-Bildschirm bringen, das kommt einer App relativ nah.</p>
        </div>
        <img src={tutorialImages[currentImageIndex]} alt={`Tutorial step ${currentImageIndex + 1}`} />
        <div className="tutorial-navigation">
          <button className="tutorial-nav-button" onClick={handlePrev} disabled={currentImageIndex === 0}>Previous</button>
          <span>{`${currentImageIndex + 1} / ${tutorialImages.length}`}</span>
          <button className="tutorial-nav-button" onClick={handleNext} disabled={currentImageIndex === tutorialImages.length - 1}>Next</button>
        </div>
        <button className="understand-button" onClick={handleClose}>
          Understand, don't show again
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
