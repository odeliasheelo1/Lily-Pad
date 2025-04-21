import React, { useState, useEffect } from 'react';
import { PondBackground } from './PondBackground';
import { Frog } from './Frog';
import { LilyPad } from './LilyPad';
import { FlyManager } from './FlyManager';
import { SettingsMenu } from './SettingsMenu';
import { OutfitMenu } from './OutfitMenu';
import {SaveP, SaveF, GetKeys} from './back/backend';

export const LilyPadGame = () => {
  // Game state
  const [lilyPads, setLilyPads] = useState([]);
  const [currentPadIndex, setCurrentPadIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [frogColor, setFrogColor] = useState(() => {
    return localStorage.getItem('frogColor') || 'green';
  }); // Initialize from localStorage

  useEffect(() => { //setting all prev states
    const key = async() => {
      let keys = await GetKeys(); //getting array of keys
      setCurrentPadIndex(keys[0]); //setting position
      setScore(keys[1]) //setting score
    }
    key(); //calling key function
  },[])

  // Handle frog color change
  const handleFrogColorChange = (color) => {
    setFrogColor(color);
  };


  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initialize lily pads
  useEffect(() => {
    // Create 5 lily pads in different positions within pond boundaries
    const pads = [];
    
    // Define pond boundaries with a better alignment to the pond image
    // The pond image is centered, so create a more defined circle
    const pondMargin = 150; // increased margin for better visibility
    const pondWidth = windowSize.width - (pondMargin * 2);
    const pondHeight = windowSize.height - (pondMargin * 2);
    
    // Pond center point
    const pondCenterX = windowSize.width / 2;
    const pondCenterY = windowSize.height / 2 + 150; // Move the center point down by 150px
    
    // Create more natural lily pad placement - with wider spacing
    for (let i = 0; i < 5; i++) {
      // Calculate angle for circular distribution with a slight offset for natural look
      // For the top pad (typically at index 0 with angle near 0/2π), add an offset to bring it down
      let angle = (i / 5) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      
      // If this is the top lily pad (angle near top of circle), adjust it downward
      if (angle < Math.PI * 0.5 || angle > Math.PI * 1.5) {
        angle += Math.PI * 0.15; // Move down by adding a positive angle
      }
      
      // Larger radius range to spread lily pads out more
      // Adjust the radius to be properly sized on mobile devices
      const isSmallScreen = windowSize.width < 768;
      const radiusBase = isSmallScreen ? 0.4 : 0.5; // Increased radius base value
      const radius = (Math.min(pondWidth, pondHeight) / 2.5) * (radiusBase + Math.random() * 0.15);
      
      // Calculate position with less randomness for better alignment
      const x = pondCenterX + Math.cos(angle) * radius;
      const y = pondCenterY + Math.sin(angle) * radius;
      
      // Consistent pad size based on screen size
      const padSize = isSmallScreen ? 70 : 100;
      
      pads.push({
        id: i,
        x: Math.max(pondMargin, Math.min(windowSize.width - pondMargin, x)), // constrain to pond
        y: Math.max(pondMargin, Math.min(windowSize.height - pondMargin, y)), // constrain to pond
        size: padSize,
        // Store relative positions (0-1) for responsive positioning
        relativeX: (x / windowSize.width),
        relativeY: (y / windowSize.height)
      });
    }
    setLilyPads(pads);
  }, [windowSize]);
  
  // Update lily pad positions when window is resized
  useEffect(() => {
    if (lilyPads.length > 0) {
      // Only update positions of existing lily pads when window size changes
      setLilyPads(prevPads => 
        prevPads.map(pad => {
          // Calculate new absolute position from stored relative position
          const newX = pad.relativeX * windowSize.width;
          const newY = pad.relativeY * windowSize.height;
          
          // Constrain to pond boundaries
          const pondMargin = 150;
          const x = Math.max(pondMargin, Math.min(windowSize.width - pondMargin, newX));
          const y = Math.max(pondMargin, Math.min(windowSize.height - pondMargin, newY));
          
          // Consistent pad size based on screen size
          const isSmallScreen = windowSize.width < 768;
          const padSize = isSmallScreen ? 70 : 100;
          
          return {
            ...pad,
            x,
            y,
            size: padSize
          };
        })
      );
    }
  }, [windowSize, lilyPads.length]);

  // Handle frog jumping to a new lily pad
  const handleJumpToLilyPad = (index) => {
    // Get the target lily pad
    const targetPad = lilyPads[index];
    const currentPad = lilyPads[currentPadIndex];
    
    if (targetPad && currentPad) {
      // Immediately trigger the jump animation via the global function
      // This starts the animation before the state updates
      if (window.triggerFrogJump) {
        window.triggerFrogJump(targetPad.x, targetPad.y);
      }
      
      // Update the current pad index (this will move the frog)
      setCurrentPadIndex(index);
      SaveP(index); //saving new pad index

    }
    
  };

  // Handle fly being caught
  const handleFlyCaught = () => {
    setScore(score + 1);
    SaveF(score); //saving flies caught
  };

  return (
    <div className="game-container" style={{ 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#e6f7ff',
      userSelect: 'none',
    }}>
      <PondBackground />
      
      {/* Lily pads */}
      {lilyPads.map((pad, index) => (
        <LilyPad 
          key={pad.id}
          x={pad.x}
          y={pad.y}
          size={pad.size}
          isActive={index === currentPadIndex}
          onClick={() => handleJumpToLilyPad(index)}
        />
      ))}
      
      {/* Frog character */}
      {lilyPads.length > 0 && (
        <Frog 
          x={lilyPads[currentPadIndex]?.x}
          y={lilyPads[currentPadIndex]?.y}
          onFlyCaught={handleFlyCaught}
          color={frogColor}
        />
      )}
      
      {/* Fly spawning system */}
      <FlyManager
        frogPosition={lilyPads[currentPadIndex] || { x: 0, y: 0 }}
        lilyPads={lilyPads}
      />
      
      {/* Outfit Menu */}
      <OutfitMenu onSelectColor={handleFrogColorChange} />
      
      {/* Game UI */}
      <div className="game-ui" style={{
        position: 'absolute',
        top: 20,
        left: 20,
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
      }}>
        Flies Caught: {score}
      </div>
      
      {/* Settings Menu */}
      <SettingsMenu />
      
      <div className="game-instructions" style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
      }}>
        Click on lily pads to jump | Catch flies with your tongue
      </div>
    </div>
  );
};

export default LilyPadGame;