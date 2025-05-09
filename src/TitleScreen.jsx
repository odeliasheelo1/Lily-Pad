import React from 'react';


export const TitleScreen = ({ onStartGame }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url("https://play.rosebud.ai/assets/LoadScreen1.PNG?0sVz")', // Updated image
        backgroundSize: 'contain', // Changed from 'contain'
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // ✅ Vertically center the button
        position: 'relative',
      }}
    >
      <button
        onClick={onStartGame}
        style={{
          padding: '12px 24px',
          fontSize: '1.4rem',
          backgroundColor: '#556B2F',
          color: '#FFFFFF',
          border: '2px solid #3B4B21',
          borderRadius: '20px',
          cursor: 'pointer',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
          transition: 'transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
          fontWeight: 'bold',
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.backgroundColor = '#6B8E23';
          e.target.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.backgroundColor = '#556B2F';
          e.target.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.4)';
        }}
        onMouseDown={(e) => {
          e.target.style.transform = 'scale(0.98)';
          e.target.style.boxShadow = '1px 1px 2px rgba(0,0,0,0.3)';
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.5)';
        }}
      >
        Start Game
      </button>
    </div>
  );
};
