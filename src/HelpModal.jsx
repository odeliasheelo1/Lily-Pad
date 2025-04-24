import React from 'react';

export const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's above other elements
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '30px 40px', // Keep padding
    borderRadius: '8px', // Match other modals/panels
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)', // Match outfit modal shadow
    maxWidth: '500px', // Slightly wider
    position: 'relative',
    fontFamily: "'Arial', sans-serif", // Consistent font
    lineHeight: '1.7', // Increase line height slightly for readability
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px', // Match outfit modal
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#aaa', // Match outfit modal
    lineHeight: 1,
    padding: '0', // Match outfit modal
    transition: 'color 0.2s ease',
  };

  const titleStyle = {
    textAlign: 'center',
    fontWeight: '600', // Match outfit modal title weight
    fontSize: '1.4rem', // Slightly larger title
    marginBottom: '25px', // More space below title
    color: '#333',
  };

  const instructionStyle = {
    marginBottom: '12px', // Slightly more space between points
    fontSize: '1rem',
    color: '#444', // Slightly darker text for better contrast
  };

  return (
    // Modal Overlay
    <div style={modalStyle}>
      {/* Modal Content */}
      <div style={contentStyle}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={closeButtonStyle}
          onMouseEnter={(e) => e.target.style.color = '#555'} // Darker on hover
          onMouseLeave={(e) => e.target.style.color = '#aaa'}
        >
          &times; {/* Unicode 'X' */}
        </button>
        {/* Help Instructions */}
        <div>
          <div style={titleStyle}>How to Play Froggy Jumps</div>
          <p style={instructionStyle}>
            <strong>Jump:</strong> Click on a lily pad to make the frog jump to it.
          </p>
          <p style={instructionStyle}>
            <strong>Catch Flies:</strong> Double-click the frog when it's near a fly to extend its tongue and catch it!
          </p>
          <p style={instructionStyle}>
            <strong>Goal:</strong> Catch as many flies as you can.
          </p>
          <p style={instructionStyle}>
            <strong>Settings:</strong> Use the menu button (top-left) to change frog color or mute the sound.
          </p>
        </div>
      </div>
    </div>
  );
};