import React, { useState, useEffect } from 'react';
export const HelpModal = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);
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
    zIndex: 1000,
    padding: '20px', // Add padding for smaller screens
  };
  const contentStyle = {
    backgroundColor: '#D2B48C', // Tan background
    padding: '20px 30px', // Increased padding
    borderRadius: '8px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px', // Max width for text content
    width: '100%', // Ensure it's responsive
    maxHeight: '90vh',
    overflowY: 'auto', // Allow scrolling for content
    position: 'relative',
    fontFamily: "'Arial', sans-serif",
    color: '#4A3B31', // Darker brown text for readability
  };
  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#8B4513', // SaddleBrown for 'X'
    lineHeight: 1,
    padding: '5px',
    transition: 'color 0.2s ease',
  };
  const titleStyle = {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#5D4037', // Darker brown for title
  };
  const paragraphStyle = {
    marginBottom: '12px',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  };
  const questionStyle = {
    fontWeight: 'bold',
    marginTop: '15px',
    marginBottom: '5px',
  };
  const navigationButtonStyle = {
    background: '#8B4513', // SaddleBrown color for buttons
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '15px',
    margin: '15px 5px 0', // Margin top for spacing
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
  };
  
  const disabledNavigationButtonStyle = {
      ...navigationButtonStyle,
      backgroundColor: '#A0522D', // Sienna - a lighter brown for disabled
      cursor: 'not-allowed',
  };
  const handleNextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const Page1Content = () => (
    <>
      <h2 style={titleStyle}>Help/FAQ</h2>
      <p style={paragraphStyle}>
        Lily Pad is designed to be simple and calming. Here’s how to use the features in the game:
      </p>
      <p style={paragraphStyle}>
        <strong>Main Menu:</strong> Click the main menu icon to access all interactive features. This is your hub to navigate everything.
      </p>
      <p style={paragraphStyle}>
        <strong>Feeding:</strong> Insects will automatically spawn around you. Hold click on the frog to charge up how far your tongue goes to catch the bugs and earn points.
      </p>
      <p style={paragraphStyle}>
        <strong>Sleep:</strong> Click on the log to make the frog go to sleep. Click on the frog to wake it back up.
      </p>
      <p style={paragraphStyle}>
        <strong>Dress-Up:</strong> Use the accessories icon to change your frog’s outfit and try on different looks.
      </p>
      <p style={paragraphStyle}>
        <strong>Music:</strong> Tap the music icon to turn background sounds on or off. Use the music slider to adjust the volume to your liking.
      </p>
      <p style={paragraphStyle}>
        <strong>Save:</strong> Your game state, including score, owned items, and frog color, is automatically saved to your browser's local storage.
      </p>
      <p style={paragraphStyle}>
        If you ever feel unsure, just return to the main menu. Everything is just one click away.
      </p>
    </>
  );
  const Page2Content = () => (
    <>
      <h2 style={titleStyle}>Help/FAQ</h2>
      <p style={questionStyle}>Q: What is Lily Pad?</p>
      <p style={paragraphStyle}>A: Lily Pad is a relaxing online game where you care for a frog in a peaceful environment. It’s meant to help you unwind and destress.</p>
      
      <p style={questionStyle}>Q: Do I need to download anything?</p>
      <p style={paragraphStyle}>A: No, it runs right in your web browser without any downloads.</p>
      
      <p style={questionStyle}>Q: Is there music in the game?</p>
      <p style={paragraphStyle}>A: Yes, soft background music plays as you interact. You can mute/unmute.</p>
      
      <p style={questionStyle}>Q: Can I save my progress?</p>
      <p style={paragraphStyle}>A: Not yet. A login-based save feature is coming soon.</p>
      
      <p style={questionStyle}>Q: Can I buy items for the frog?</p>
      <p style={paragraphStyle}>A: Yes, after collecting bugs, you can buy accessories and items using the shop icon.</p>
      
      <p style={questionStyle}>Q: What can I do in the game?</p>
      <p style={paragraphStyle}>A: Feed your frog, dress him up, and help him rest. The goal is to relax and enjoy simple, cozy moments.</p>
      
      <p style={questionStyle}>Q: Who made this game?</p>
      <p style={paragraphStyle}>A: Lily Pad was created by COMP 380 students: Austen, Brandon, Hector, Leo, Odelia, and Ricardo.</p>
    </>
  );
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {currentPage === 1 ? <Page1Content /> : <Page2Content />}
        
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
          <button 
            onClick={handlePrevPage} 
            style={currentPage === 1 ? disabledNavigationButtonStyle : navigationButtonStyle}
            disabled={currentPage === 1}
            onMouseEnter={(e) => { if (currentPage !== 1 && e.target.style.backgroundColor !== '#A0522D') e.target.style.backgroundColor = '#A0522D';}} // Sienna on hover for active
            onMouseLeave={(e) => { if (currentPage !== 1 && e.target.style.backgroundColor !== '#A0522D') e.target.style.backgroundColor = '#8B4513';}} // SaddleBrown back
          >
            Previous
          </button>
          <button 
            onClick={handleNextPage} 
            style={currentPage === 2 ? disabledNavigationButtonStyle : navigationButtonStyle}
            disabled={currentPage === 2}
            onMouseEnter={(e) => { if (currentPage !== 2 && e.target.style.backgroundColor !== '#A0522D') e.target.style.backgroundColor = '#A0522D';}}
            onMouseLeave={(e) => { if (currentPage !== 2 && e.target.style.backgroundColor !== '#A0522D') e.target.style.backgroundColor = '#8B4513';}}
          >
            Next
          </button>
        </div>
        <button 
          onClick={onClose} 
          style={closeButtonStyle}
          onMouseEnter={(e) => e.target.style.color = '#A0522D'} // Sienna on hover
          onMouseLeave={(e) => e.target.style.color = '#8B4513'} // SaddleBrown back
        >
          &times;
        </button>
      </div>
    </div>
  );
};