import React, { useState, useEffect, useRef } from 'react';
import { PondBackground } from './PondBackground';
import { Frog } from './Frog';
import { LilyPad } from './LilyPad';
import { FlyManager } from './FlyManager';
import { MainMenu } from './MainMenu'; // Import the new MainMenu
// Removed direct imports of SettingsMenu/OutfitMenu
export const LilyPadGame = () => {
  // Game state
  const [lilyPads, setLilyPads] = useState([]);
  const [currentPadIndex, setCurrentPadIndex] = useState(0);
  // Initialize score from localStorage or default to 0
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('froggyJumpsScore');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const gameContainerRef = useRef(null);
  const [gameSize, setGameSize] = useState({ width: 900, height: 700 }); // Fixed dimensions
  const [frogColor, setFrogColor] = useState(() => {
    return localStorage.getItem('frogColor') || 'green';
  }); // Initialize from localStorage
  const [ownedItems, setOwnedItems] = useState(() => {
    const savedItems = localStorage.getItem('froggyOwnedItems');
    // Initialize with green color owned by default
    const defaultItems = { color_green: true };
    return savedItems ? { ...defaultItems, ...JSON.parse(savedItems) } : defaultItems;
  });
  
  // Audio State and Management
  const [isMuted, setIsMuted] = useState(() => {
    // Initialize mute state from localStorage or default to false
    return localStorage.getItem('froggyIsMuted') === 'true';
  });
  const audioRef = useRef(null); // Ref to hold the audio object
  
  // Initialize audio only once when the game component mounts
  useEffect(() => {
    const backgroundMusic = new Audio('https://play.rosebud.ai/assets/background-music.mp3?Cq5m');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5; // Set to 50% volume
    audioRef.current = backgroundMusic;
    
    // Try playing audio respecting the initial mute state
    if (!isMuted) {
      backgroundMusic.play().catch(error => {
        console.log("Background music autoplay prevented:", error);
        // Handle cases where autoplay is blocked (e.g., browser policy)
        // We might need a user interaction to start the audio later.
      });
    }
    
    // Cleanup function to pause and release audio source on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Release the source
        audioRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount
  
  // Effect to play/pause audio when isMuted state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        // Only attempt to play if it wasn't already playing or failed initially
        if (audioRef.current.paused) { 
          audioRef.current.play().catch(error => console.log("Error playing audio:", error));
        }
      }
      // Save mute preference to localStorage
      localStorage.setItem('froggyIsMuted', isMuted);
    }
  }, [isMuted]);
  // Function to toggle mute state
  const handleToggleMute = () => {
    setIsMuted(prevMuted => !prevMuted);
  };
  // Handle frog color change
  const handleFrogColorChange = (color) => {
    // Allow changing only to owned colors (green is always owned)
    if (ownedItems[`color_${color}`]) {
      setFrogColor(color);
    } else if (color === 'green') {
       setFrogColor('green'); // Default case
    }
  };
  // Initialize and update lily pads based on gameSize
  useEffect(() => {
    // Recalculate lily pad positions whenever gameSize changes
    const pads = [];
    const numPads = 5;
    const fixedWidth = gameSize.width;
    const fixedHeight = gameSize.height;
    // Define pond boundaries within the fixed container
    const pondMargin = Math.min(fixedWidth, fixedHeight) * 0.1; // 10% margin
    const pondWidth = fixedWidth - (pondMargin * 2);
    const pondHeight = fixedHeight - (pondMargin * 2);
    // Pond center point within the fixed container
    const pondCenterX = fixedWidth / 2;
    // Adjust center Y further downwards to match the pond image (slightly more)
    const pondCenterY = fixedHeight * 0.70; // Increased from 0.65 to move pads further down
    for (let i = 0; i < numPads; i++) {
      let angle = (i / numPads) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
       // Adjust top pad slightly downwards
      if (angle > Math.PI * 1.7 || angle < Math.PI * 0.3) {
         angle += Math.PI * 0.1;
      }
      // Radius based on the smaller dimension of the fixed container
      // Significantly decrease the radius base to bring pads much closer to the center
      const radiusBase = 0.15 + Math.random() * 0.05; // Decreased base from 0.25, smaller random range
      const radius = Math.min(pondWidth, pondHeight) * radiusBase;
      // Calculate position relative to adjusted container center
      let x = pondCenterX + Math.cos(angle) * radius;
      let y = pondCenterY + Math.sin(angle) * radius;
      
      // Check if this pad is near the bottom (angle close to PI/2)
      const bottomAngleThreshold = 0.1 * Math.PI; // Define a small range around PI/2
      if (Math.abs(angle - Math.PI / 2) < bottomAngleThreshold) {
          // Move this pad up slightly by reducing its y-coordinate
          y -= Math.min(fixedWidth, fixedHeight) * 0.03; // Move up by 3% of the smaller dimension
      }
      
      // Pad size relative to fixed container size
      const padSize = Math.min(fixedWidth, fixedHeight) * 0.12; // ~12% of smaller dimension
      pads.push({
        id: i,
        x: Math.max(pondMargin, Math.min(fixedWidth - pondMargin, x)),
        y: Math.max(pondMargin, Math.min(fixedHeight - pondMargin, y)),
        size: padSize,
        // Store relative positions based on the *fixed* game size for consistency
        relativeX: x / fixedWidth,
        relativeY: y / fixedHeight
      });
    }
    setLilyPads(pads);
    // Set initial frog position if pads are generated
    if (pads.length > 0 && currentPadIndex >= 0 && currentPadIndex < pads.length) {
       setCurrentPadIndex(0); // Start on the first generated pad
    } else {
       setCurrentPadIndex(0); // Default to 0 if something goes wrong
    }
  }, [gameSize]); // Rerun only when gameSize changes (should be fixed)
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
    }
};
  // Handle fly being caught and save score
  const handleFlyCaught = () => {
    const newScore = score + 1;
    setScore(newScore);
    // Save the new score to localStorage
    localStorage.setItem('froggyJumpsScore', newScore.toString());
  };
  // Handle purchasing an item
  const handlePurchase = (itemId, cost) => {
    if (score >= cost && !ownedItems[itemId]) {
      const newScore = score - cost;
      const newOwnedItems = { ...ownedItems, [itemId]: true };
      setScore(newScore);
      setOwnedItems(newOwnedItems);
      // Save updated score and owned items
      localStorage.setItem('froggyJumpsScore', newScore.toString());
      localStorage.setItem('froggyOwnedItems', JSON.stringify(newOwnedItems));
      // If a color was purchased, automatically select it
      if (itemId.startsWith('color_')) {
        const colorName = itemId.split('_')[1];
        handleFrogColorChange(colorName);
      }
      // If a hat was purchased, equip it using the just-updated items list
      if (itemId.startsWith('hat_')) {
         handleHatSelection(itemId, newOwnedItems); // Pass the updated items
      }
    }
  };
  // Handle selecting a hat (or null for no hat), accepting current items state
  const handleHatSelection = (hatId, currentItems = ownedItems) => { // Accept currentItems, default to state
      console.log("Selected hat:", hatId);
      // Use the passed currentItems or the component's state
      const newOwnedItems = { ...currentItems };
      // Clear existing equipped hats (assuming only one can be equipped)
      Object.keys(newOwnedItems).forEach(key => {
          if (key.startsWith('hat_') && newOwnedItems[key] === 'equipped') {
              newOwnedItems[key] = true; // Mark as owned, not equipped
          }
      });
      // Mark the selected hat as equipped (if not null and owned)
      // Ensure the hat exists in the *new* items map before equipping
      if (hatId && newOwnedItems[hatId]) {
           newOwnedItems[hatId] = 'equipped'; // Use 'equipped' status temporarily
      }
      // Update the state and localStorage with the final result
      setOwnedItems(newOwnedItems);
      localStorage.setItem('froggyOwnedItems', JSON.stringify(newOwnedItems));
  };
  return (
    <div
      ref={gameContainerRef}
      className="game-container"
      style={{
        width: `${gameSize.width}px`,   // Use fixed width
        height: `${gameSize.height}px`, // Use fixed height
        overflow: 'hidden',
        position: 'relative', // Crucial for absolute positioning of children
        backgroundColor: '#e6f7ff', // Fallback background
        userSelect: 'none',
        borderRadius: '15px', // Match wrapper if needed, ensure overflow hidden works
      }}>
      <PondBackground width={gameSize.width} height={gameSize.height}/>
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
          // onFlyCaught prop removed from Frog
          color={frogColor}
          ownedItems={ownedItems} // Pass ownedItems down
        />
      )}
      
{/* Fly spawning system - Pass game dimensions */}
      <FlyManager
        frogPosition={lilyPads[currentPadIndex] || { x: gameSize.width / 2, y: gameSize.height / 2 }}
        lilyPads={lilyPads}
        gameWidth={gameSize.width}
        gameHeight={gameSize.height}
        onScoreUpdate={handleFlyCaught} // Pass score update function directly
      />
      
      {/* Render the consolidated Main Menu */}
      {/* Render the consolidated Main Menu */}
      <MainMenu
        onSelectColor={handleFrogColorChange}
        onSelectHat={handleHatSelection} // Pass hat selection handler
        score={score}
        ownedItems={ownedItems}
        onPurchase={handlePurchase}
        isMuted={isMuted} // Pass mute state down
        onToggleMute={handleToggleMute} // Pass toggle function down
      />
      {/* Game UI - Moved slightly right to not overlap with MainMenu button */}
      <div className="game-ui" style={{
        position: 'absolute',
        top: 20,
        left: 80, // Adjusted left position
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        zIndex: 90 // Ensure it's below the menu button
      }}>
        Flies Caught: {score}
      </div>
      {/* Old SettingsMenu and OutfitMenu removed from here */}
      {/* Game instructions div removed */}
    </div>
  );
};