import React, { useState, useEffect } from 'react';
import { Notification } from './Notification';
// This component now primarily handles the button/trigger logic if not embedded.
// The color selection itself happens in the OutfitModal.
export const OutfitMenu = ({ onSelectColor, isEmbedded = false, onOpenModal }) => {
  // State for the *button* interaction (if not embedded)
  const [buttonHovered, setButtonHovered] = useState(false);
  const [notification, setNotification] = useState(null); // Keep notification for standalone use if needed
  // Effect to load initial color (still useful for App state)
  useEffect(() => {
    const savedColor = localStorage.getItem('frogColor') || 'green';
    onSelectColor(savedColor);
  }, []); // Run only once on mount
  // This function is called when the modal successfully selects a color
  // It allows showing a notification if the menu is standalone.
  const handleColorSelectedByModal = (color) => {
      // Clear any existing notification first
      setNotification(null);
      // Set a timeout before showing the new notification
      setTimeout(() => {
          setNotification(`Frog color changed to ${color}!`);
      }, 10);
  };
  // If embedded, simply render a button/placeholder that triggers the modal
  if (isEmbedded) {
    return (
        <button
            onClick={onOpenModal} // Trigger the modal opening function passed from parent
            style={{
              cursor: 'pointer',
              padding: '8px 15px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f0f0f0',
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
        >
            Change Color...
        </button>
    );
  }
  // --- Standalone Mode ---
  // This part is less relevant now but kept for potential future use
  // It renders the original outfit button that *would have* opened a dropdown.
  // Now, it should probably trigger the modal as well if used standalone.
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
      {/* Outfit button - Triggers the Modal */}
      <div
        className="outfit-button"
        onClick={onOpenModal} // Make the standalone button also open the modal
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
      {/* Notification for standalone mode */}
      {notification && !isEmbedded && (
        <Notification
          message={notification}
          duration={2000}
        />
      )}
      {/* We need to potentially pass handleColorSelectedByModal up if used standalone */}
      {/* Or handle notification differently */}
    </div>
  );
};