import React from 'react';

export const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Basic modal styling (consistent with other modals)
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
  };

  const contentStyle = {
    backgroundColor: '#D2B48C', // Tan background
    padding: '30px 40px',
    borderRadius: '8px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    maxWidth: '550px', // Slightly wider for more text
    width: '90%',
    maxHeight: '90vh', // Ensure it fits on screen
    overflowY: 'auto', // Allow scrolling for content
    position: 'relative',
    fontFamily: "'Arial', sans-serif",
    textAlign: 'left', // Align text to the left for readability
  };
  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    cursor: 'pointer',
    color: '#8B4513', // SaddleBrown for 'X', matches HelpModal
    lineHeight: 1,
    padding: '5px',
    transition: 'color 0.2s ease',
  };
  const titleStyle = {
    fontWeight: 'bold', // Keep bold
    fontSize: '1.6rem', // Slightly larger title
    marginBottom: '25px', // More space below title
    color: '#5D4037', // Darker brown for title, matches HelpModal
    textAlign: 'center', // Center the main title
  };
  
  const textStyle = {
    fontSize: '1rem',
    color: '#4A3B31', // Darker brown text, matches HelpModal
    lineHeight: '1.7', // Slightly increased line height
    marginBottom: '18px', // More space between paragraphs
  };
  
  // Link style removed as no links in the new text
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          style={closeButtonStyle}
          onMouseEnter={(e) => e.target.style.color = '#A0522D'} // Sienna on hover
          onMouseLeave={(e) => e.target.style.color = '#8B4513'} // SaddleBrown back
        >
          &times;
        </button>
        
        <div style={titleStyle}>About Lily Pad</div> 
        
        <p style={textStyle}>
          Lily Pad is a relaxing online game designed to help you slow down, breathe, and find a moment of calm. Built with soft colors, gentle sounds, and soothing animations, it offers a peaceful escape from the noise of everyday life and overstimulating digital spaces.
        </p>
        <p style={textStyle}>
          In Lily Pad, you can feed your frog, dress him in adorable accessories, play, help him rest, or simply enjoy the ambiance, complete with an adjustable music slider for a personalized sound experience. Every interaction is simple, cozy, and focused on mindfulness.
        </p>
        <p style={textStyle}>
          Developed using React, Lily Pad invites players into a low-stimulation environment where the goal isn’t to win but to relax, recharge, and just be.
        </p>
      </div>
    </div>
  );
};