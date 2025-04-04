import React, { useState, useEffect } from 'react';
import { Notification } from './Notification';

export const OutfitMenu = ({ onSelectColor }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem('frogColor') || 'green';
  });
  const [buttonHovered, setButtonHovered] = useState(false);
  const [notification, setNotification] = useState(null);
  // Load saved color preference on component mount
  useEffect(() => {
    onSelectColor(selectedColor);
  }, []);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    localStorage.setItem('frogColor', color);
    onSelectColor(color);
    setIsMenuOpen(false);
    // Clear any existing notification first
    setNotification(null);
    
    // Set a timeout before showing the new notification to ensure state update
    setTimeout(() => {
      setNotification(`Frog color changed to ${color}!`);
    }, 10);
  };

  return (
    <div className="outfit-container" style={{ 
      position: 'absolute', 
      top: 20, 
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Outfit button */}
      <div 
        className="outfit-button"
        onClick={toggleMenu}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        style={{ 
          cursor: 'pointer', 
          transition: 'transform 0.2s ease',
          transform: buttonHovered ? 'scale(1.05)' : 'scale(1)',
          width: 100,
          height: 'auto'
        }}
      >
        <img 
          src="https://play.rosebud.ai/assets/8 bit button thats says outfit.png?AgSQ"
          alt="Outfit"
          style={{ 
            width: '100%', 
            height: 'auto',
            filter: buttonHovered ? 'brightness(1.1)' : 'brightness(1)'
          }}
        />
      </div>

      {/* Color selection menu */}
      {isMenuOpen && (
        <div className="color-menu" style={{
          position: 'absolute',
          top: 60,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 10,
          padding: 15,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          minWidth: 150,
        }}>
          <div className="color-option-title" style={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 5,
            fontFamily: 'Arial, sans-serif'
          }}>
            Choose Color
          </div>
          
          {/* Green option */}
          <div 
            className={`color-option ${selectedColor === 'green' ? 'selected' : ''}`}
            onClick={() => handleColorSelect('green')}
            style={{ 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '5px 10px',
              borderRadius: 5,
              backgroundColor: selectedColor === 'green' ? 'rgba(144, 238, 144, 0.3)' : 'transparent',
              border: selectedColor === 'green' ? '2px solid #4CAF50' : '2px solid transparent'
            }}
          >
            <img 
              src="https://play.rosebud.ai/assets/Frog1.png?kssR"
              alt="Green Frog"
              style={{ width: 40, height: 40 }}
            />
            <span>Green</span>
          </div>
          
          {/* Red option */}
          <div 
            className={`color-option ${selectedColor === 'red' ? 'selected' : ''}`}
            onClick={() => handleColorSelect('red')}
            style={{ 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '5px 10px',
              borderRadius: 5,
              backgroundColor: selectedColor === 'red' ? 'rgba(255, 200, 200, 0.3)' : 'transparent',
              border: selectedColor === 'red' ? '2px solid #F44336' : '2px solid transparent'
            }}
          >
            <img 
              src="https://play.rosebud.ai/assets/Red Frog 1.PNG?9ocr"
              alt="Red Frog"
              style={{ width: 40, height: 40 }}
            />
            <span>Red</span>
          </div>
          
          {/* Yellow option */}
          <div 
            className={`color-option ${selectedColor === 'yellow' ? 'selected' : ''}`}
            onClick={() => handleColorSelect('yellow')}
            style={{ 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '5px 10px',
              borderRadius: 5,
              backgroundColor: selectedColor === 'yellow' ? 'rgba(255, 255, 200, 0.3)' : 'transparent',
              border: selectedColor === 'yellow' ? '2px solid #FFC107' : '2px solid transparent'
            }}
          >
            <img 
              src="https://play.rosebud.ai/assets/Yellow Frog 1.png?OXP4"
              alt="Yellow Frog"
              style={{ width: 40, height: 40 }}
            />
            <span>Yellow</span>
          </div>
        </div>
      )}
      {notification && (
        <Notification 
          message={notification} 
          duration={2000}
        />
      )}
    </div>
  );
};

export default OutfitMenu;