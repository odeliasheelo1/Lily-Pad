import React from 'react';

export const TitleScreen = ({ onStartGame }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #87CEEB, #4682B4)', // Sky blue to steel blue gradient
      fontFamily: '"Comic Sans MS", cursive, sans-serif', // Fun font
      color: 'white',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Froggy Jumps</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>Help the frog catch flies!</p>
      <button 
        onClick={onStartGame}
        style={{
          padding: '15px 30px',
          fontSize: '1.8rem',
          backgroundColor: '#32CD32', // Lime green
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '3px 3px 5px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s ease, background-color 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Start Game
      </button>
    </div>
  );
};