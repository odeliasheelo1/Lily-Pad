import React, { useState } from 'react';
import { TitleScreen } from './TitleScreen';
import { LilyPadGame } from './LilyPadGame';


export const App = () => {
  const [gameState, setGameState] = useState('title'); // 'title' or 'game'

  const startGame = () => {
    setGameState('game');
  };

return (
    <div className="app-container" style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #a1c4fd, #c2e9fb)', // Light blue gradient background
    }}>
      {gameState === 'title' && <TitleScreen onStartGame={startGame} />}
      {gameState === 'game' && (
        <div className="game-wrapper" style={{
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          borderRadius: '15px',
          overflow: 'hidden', // Ensure game stays within bounds
        }}>
          <LilyPadGame />
        </div>
      )}
    </div>
  );
};

export default App;