import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  // Removed currentLevel state
  // Initialize score from localStorage or default to 0
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('froggyJumpsScore');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [flies, setFlies] = useState([]);
  // const [moths, setMoths] = useState([]); // State for moths - ALREADY REMOVED, ensuring it stays removed
  const gameContainerRef = useRef(null);
  const logCanvasRef = useRef(null); // Ref for the log canvas
  const [gameOffset, setGameOffset] = useState({ top: 0, left: 0 }); // State for game container offset
  const [gameSize, setGameSize] = useState({ width: 900, height: 700 }); // Fixed dimensions
  const [logPosition, setLogPosition] = useState({ x: 0, y: 0 });
  const [logSize, setLogSize] = useState({ width: 0, height: 0 });
  const [isFrogSleeping, setIsFrogSleeping] = useState(false); // Frog's logical state: on log & asleep
  const [isZzzVisible, setIsZzzVisible] = useState(false); // Controls visibility of Zzz animation
  const isFrogSleepingRef = useRef(isFrogSleeping); // Ref to track current isFrogSleeping state
  const [isFrogOnTrampoline, setIsFrogOnTrampoline] = useState(false); // Track if frog is on trampoline
  const isFrogOnTrampolineRef = useRef(isFrogOnTrampoline); // Ref for isFrogOnTrampoline
  const zzzTimerRef = useRef(null); // Ref for the Zzz visibility timer
  const [frogColor, setFrogColor] = useState(() => {
    return localStorage.getItem('frogColor') || 'green';
  }); // Initialize from localStorage
  const [ownedItems, setOwnedItems] = useState(() => {
    const savedItems = localStorage.getItem('froggyOwnedItems');
    // Initialize with green color owned by default
    const defaultItems = { color_green: true }; 
    return savedItems ? { ...defaultItems, ...JSON.parse(savedItems) } : defaultItems;
  });
  const [frogKey, setFrogKey] = useState(0); // Key to force Frog re-mount
  const [initialSetupComplete, setInitialSetupComplete] = useState(false); // Track initial setup
// Audio State and Management
// const [bounceState, setBounceState] = useState('idle'); // 'idle', 'ascending', 'descending' // REMOVED
// const [currentBounceTargetY, setCurrentBounceTargetY] = useState(null); // REMOVED
const FROG_JUMP_ANIM_DURATION = 800; // ms, should match Frog.jsx's CSS transition for top/left
const BOUNCE_HEIGHT_OFFSET = 250; // pixels frog bounces above trampoline - Increased for a higher jump // This might be used by Frog.jsx later
const [isMuted, setIsMuted] = useState(() => {
    // Initialize mute state from localStorage or default to false
    return localStorage.getItem('froggyIsMuted') === 'true';
  });
  const audioRef = useRef(null); // Ref to hold the audio object
  // Define trampoline position and active state early
  const trampolinePosition = useMemo(() => ({
    x: gameSize.width * 0.2,
    y: gameSize.height * 0.6 // Moved up further from 0.7
  }), [gameSize.width, gameSize.height]);
  const isTrampolineActive = !!ownedItems.trampoline_main;
  
  // Initialize audio only once when the game component mounts
  useEffect(() => {
    const backgroundMusic = new Audio('https://play.rosebud.ai/assets/Music temp.mp3?TWPV'); // Updated music track
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
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Release the source
        audioRef.current = null;
      }
      clearTimeout(zzzTimerRef.current); // Clear Zzz timer on unmount
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
  // Keep isFrogSleepingRef updated with the latest state
  useEffect(() => {
    isFrogSleepingRef.current = isFrogSleeping;
  }, [isFrogSleeping]);
  // Keep isFrogOnTrampolineRef updated
  useEffect(() => {
    isFrogOnTrampolineRef.current = isFrogOnTrampoline;
  }, [isFrogOnTrampoline]);
  // Initialize and update lily pads and log based on gameSize
  useEffect(() => {
    const fixedWidth = gameSize.width;
    const fixedHeight = gameSize.height;
    // Log setup
    const newLogWidth = fixedWidth * 0.35; // Log is 35% of game width
    const newLogHeight = fixedHeight * 0.2; // Log is 20% of game height
    const newLogX = fixedWidth / 2;
    const newLogY = fixedHeight * 0.65; // Position log slightly lower than true center
    setLogSize({ width: newLogWidth, height: newLogHeight });
    setLogPosition({ x: newLogX, y: newLogY });
    // Recalculate lily pad positions whenever gameSize changes
    const pads = [];
    const numPads = 5; // Fixed number of lily pads
    const pondMargin = Math.min(fixedWidth, fixedHeight) * 0.05; // Reduced margin for pads
    // Define area around the log where pads should not be too close
    const logSafeZoneRadius = Math.max(newLogWidth, newLogHeight) * 0.6; // A bit larger than half the log's largest dimension
    const createLilyPad = (i, total) => {
      let angle = (i / total) * Math.PI * 2 + (Math.random() * 0.3 - 0.15); // Increased randomness for spread
      
      // Adjust radius to place pads further out, around the log
      // Minimum radius is the log's safe zone, max is near pond edge
      const minRadius = logSafeZoneRadius + (Math.min(fixedWidth, fixedHeight) * 0.08); // Ensure pads are beyond log + a bit
      const maxRadiusVariation = Math.min(fixedWidth, fixedHeight) * 0.15; // How much further out they can go
      const radius = minRadius + Math.random() * maxRadiusVariation;
      let x = newLogX + Math.cos(angle) * radius;
      let y = newLogY + Math.sin(angle) * radius * 0.8; // Elliptical distribution, less vertical spread
      // Ensure pads are within pond boundaries
      const padSize = Math.min(fixedWidth, fixedHeight) * 0.1; // Slightly smaller pads
      // Clamp positions to be within pond margins
      // For y-coordinate, ensure it's not too close to the top: increase the minimum y
      const minY = pondMargin + padSize / 2 + (fixedHeight * 0.25); // Add 25% of game height as additional top margin
      x = Math.max(pondMargin + padSize / 2, Math.min(fixedWidth - pondMargin - padSize / 2, x));
      y = Math.max(minY, Math.min(fixedHeight - pondMargin - padSize / 2, y)); // Use minY for the lower bound
      
      // Ensure pads don't overlap significantly with the log's central area
      // This is a simplified check, more robust collision detection could be added
      const dx = x - newLogX;
      const dy = y - newLogY;
      const distanceFromLogCenter = Math.sqrt(dx*dx + dy*dy);
      
      if (distanceFromLogCenter < logSafeZoneRadius * 0.8) { // If too close to log center, try to push it out
          const pushFactor = (logSafeZoneRadius * 0.8 - distanceFromLogCenter) / distanceFromLogCenter;
          x += dx * pushFactor * 0.5; // Push gently
          y += dy * pushFactor * 0.5;
          // Re-clamp
          x = Math.max(pondMargin + padSize / 2, Math.min(fixedWidth - pondMargin - padSize / 2, x));
          y = Math.max(pondMargin + padSize / 2, Math.min(fixedHeight - pondMargin - padSize / 2, y));
      }
      return {
        id: pads.length,
        x: x,
        y: y,
        size: padSize,
        relativeX: x / fixedWidth,
        relativeY: y / fixedHeight
      };
    };
    for (let i = 0; i < numPads; i++) {
      pads.push(createLilyPad(i, numPads));
    }
    setLilyPads(pads);
    // Set initial frog logical state based on pads and trampoline availability
    if (pads.length > 0) {
      setCurrentPadIndex(0); // Always start/reset to the first lily pad if pads exist
      setIsFrogOnTrampoline(false);
      setIsFrogSleeping(false); // Explicitly not sleeping if on a pad
    } else { // No lily pads
      setCurrentPadIndex(null);
      if (isTrampolineActive) { // If no pads but has trampoline
        setIsFrogOnTrampoline(true);
        setIsFrogSleeping(false);
      } else { // No pads, no trampoline
        setIsFrogOnTrampoline(false);
        setIsFrogSleeping(true); // Default to sleeping on log
      }
    }
    setInitialSetupComplete(true); // Signal that initial setup is done
  }, [gameSize, isTrampolineActive]); // Rerun if gameSize or trampoline availability changes
  // Effect to re-key the Frog component after initial setup to ensure animation reset
  useEffect(() => {
    if (initialSetupComplete) {
      const timerId = setTimeout(() => {
        setFrogKey(prevKey => prevKey + 1);
      }, 50); // Short delay (e.g., 50ms)
      return () => clearTimeout(timerId);
    }
  }, [initialSetupComplete]);
  // Removed useEffect that cleared flies based on currentLevel
  // Calculate and update game container offset
  useEffect(() => {
      const updateOffset = () => {
          if (gameContainerRef.current) {
              const rect = gameContainerRef.current.getBoundingClientRect();
              setGameOffset({ top: rect.top, left: rect.left });
          }
      };
      updateOffset(); // Initial calculation
      // Add listeners if needed for dynamic environments, but likely not needed here
      // window.addEventListener('resize', updateOffset);
      // window.addEventListener('scroll', updateOffset, true); // Capture scroll events
      return () => {
         // window.removeEventListener('resize', updateOffset);
         // window.removeEventListener('scroll', updateOffset, true);
      };
  }, []); // Run once on mount
  // Handle frog jumping to a new lily pad
  const handleJumpToLilyPad = (index) => {
    if (isFrogSleeping) return; // Don't jump if frog is sleeping
    const targetPad = lilyPads[index];
    
    if (targetPad) { // Check if targetPad exists
      if (window.triggerFrogJump) {
        window.triggerFrogJump(targetPad.x, targetPad.y);
      }
      setCurrentPadIndex(index);
      setIsFrogOnTrampoline(false); // No longer on trampoline
      setIsFrogSleeping(false);     // Ensure frog is not considered sleeping
    }
  };
  // Effect to draw the log image onto the canvas
  useEffect(() => {
    const canvas = logCanvasRef.current;
    if (!canvas || !logSize.width || !logSize.height) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle potential CORS if image source changes later
    img.src = "https://play.rosebud.ai/assets/Log.PNG?YJEI";
    img.onload = () => {
      // Set canvas physical dimensions
      canvas.width = logSize.width;
      canvas.height = logSize.height;
      // Calculate dimensions to draw image maintaining aspect ratio (like object-fit: contain)
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const canvasAspectRatio = canvas.width / canvas.height;
      let renderWidth, renderHeight, xOffset, yOffset;
      if (imgAspectRatio > canvasAspectRatio) { // Image is wider than canvas relative to height
        renderWidth = canvas.width;
        renderHeight = renderWidth / imgAspectRatio;
        xOffset = 0;
        yOffset = (canvas.height - renderHeight) / 2;
      } else { // Image is taller than canvas relative to width, or same aspect ratio
        renderHeight = canvas.height;
        renderWidth = renderHeight * imgAspectRatio;
        yOffset = 0;
        xOffset = (canvas.width - renderWidth) / 2;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
      ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
    };
    img.onerror = () => {
      console.error("Failed to load log image for canvas.");
    };
  }, [logSize.width, logSize.height]); // Redraw if log size changes
  // Handle click on the log canvas
  const handleLogClick = (event) => {
    const canvas = logCanvasRef.current;
    if (!canvas || isFrogSleeping) return; // Block if already sleeping
    const ctx = canvas.getContext('2d');
    const clickX = event.nativeEvent.offsetX;
    const clickY = event.nativeEvent.offsetY;
    const pixelData = ctx.getImageData(clickX, clickY, 1, 1).data;
    const alpha = pixelData[3];
    if (alpha > 10) { // Clicked on the visible part of the log
      if (logPosition.x && logPosition.y) { // Ensure log position is valid
        if (window.triggerFrogJump) {
          window.triggerFrogJump(logPosition.x, logPosition.y); // Trigger visual jump to log
        }
        // Delay setting frog to sleep until after jump animation (FROG_JUMP_ANIM_DURATION)
        setTimeout(() => {
          setIsFrogSleeping(true);    // Frog is now sleeping on the log
          setIsFrogOnTrampoline(false); // No longer on trampoline
          setCurrentPadIndex(null);   // No longer on a lily pad
          
          // Zzz timer logic, starts after frog is logically sleeping
          setIsZzzVisible(false);
          clearTimeout(zzzTimerRef.current);
          zzzTimerRef.current = setTimeout(() => {
            // Check the ref here as state might not be updated yet in this specific closure
            if (isFrogSleepingRef.current) { 
               setIsZzzVisible(true);
            }
          }, 800); // Zzz appears 800ms after landing and becoming logically asleep
        }, FROG_JUMP_ANIM_DURATION); // Wait for jump to complete
      }
    }
  };
  // Handle fly being caught: Update score and remove fly from state
  const handleFlyCaught = useCallback((flyId) => {
      setScore(prevScore => {
        const newScore = prevScore + 1;
        localStorage.setItem('froggyJumpsScore', newScore.toString());
        return newScore;
      });
      setFlies(prevFlies => prevFlies.filter(fly => fly.id !== flyId));
  }, [/* setScore and setFlies are stable */]);
  const handleTrampolineClick = () => {
    if (isFrogSleeping || !isTrampolineActive) return; // Don't interact if sleeping or trampoline not active
    console.log("Trampoline clicked!");
    if (window.triggerFrogJump && trampolinePosition.x && trampolinePosition.y) {
      window.triggerFrogJump(trampolinePosition.x, trampolinePosition.y);
      setIsFrogOnTrampoline(true); // Set state that frog is targeting/on trampoline
      setCurrentPadIndex(null);    // Not on a lily pad
      setIsFrogSleeping(false);    // Ensure frog is not considered sleeping
    }
  };
  const handleWakeUpFrog = useCallback(() => {
    if (isFrogSleepingRef.current) { // Use ref for current state without adding isFrogSleeping to deps
      setIsFrogSleeping(false);
      setIsZzzVisible(false);
      clearTimeout(zzzTimerRef.current);
      setIsFrogOnTrampoline(false); 
      if (lilyPads.length > 0) {
        const targetPadIndex = Math.floor(Math.random() * lilyPads.length);
        const targetPad = lilyPads[targetPadIndex];
        if (targetPad && window.triggerFrogJump) {
            window.triggerFrogJump(targetPad.x, targetPad.y);
        }
        setCurrentPadIndex(targetPadIndex);
      } else if (isTrampolineActive && trampolinePosition.x && trampolinePosition.y) {
        if (window.triggerFrogJump) {
           window.triggerFrogJump(trampolinePosition.x, trampolinePosition.y);
           setIsFrogOnTrampoline(true);
           setCurrentPadIndex(null);
        }
      }
    }
  }, [lilyPads, isTrampolineActive, trampolinePosition, setIsFrogSleeping, setIsZzzVisible, setIsFrogOnTrampoline, setCurrentPadIndex /* zzzTimerRef is stable */]);
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
  // Called by Frog.jsx when its jump animation completes and it lands on the trampoline
  const handleTrampolineImpact = useCallback(() => {
    // This function is called by Frog.jsx when its jump animation (the CSS transition)
    // completes AND its target coordinates match the trampoline's position.
    // Now, it primarily ensures the game state reflects the frog is on the trampoline.
    // The Frog component itself will manage its continuous bounce animation.
    if (isFrogOnTrampolineRef.current && isTrampolineActive) {
      // console.log("LilyPadGame: Frog landed on trampoline. Frog component will handle bounce animation.");
      // No need to set bounceState or currentBounceTargetY here anymore.
      // The Frog component will know it's on the trampoline via props.
    }
  }, [isTrampolineActive, trampolinePosition]); // BOUNCE_HEIGHT_OFFSET removed as it's not used here anymore
  // REMOVED: Effect to manage the sequence of the bounce (ascending -> descending -> idle)
  // This logic will now be handled within Frog.jsx for its internal animation.
  // // Handle moth being caught: Update score and remove moth - ALREADY REMOVED
  // const handleMothCaught = (mothId) => { ... };
  // // Handle moth position updates - ALREADY REMOVED
  // const handleMothPositionUpdate = useCallback((mothId, newPosition) => { ... });
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
  // Determine frog's display position
  let frogDisplayX, frogDisplayY;
  const frogVisualSize = gameSize.height * 0.08;
  // Determine frog's X position (less affected by bounce mechanics)
  if (isFrogOnTrampoline && isTrampolineActive && trampolinePosition.x) {
    frogDisplayX = trampolinePosition.x;
  } else if (isFrogSleeping && logPosition.x) {
    frogDisplayX = logPosition.x;
  } else if (lilyPads.length > 0 && currentPadIndex !== null && currentPadIndex >= 0 && currentPadIndex < lilyPads.length) {
    frogDisplayX = lilyPads[currentPadIndex]?.x;
  } else if (lilyPads.length > 0) {
    frogDisplayX = lilyPads[0]?.x;
  } else if (isTrampolineActive && trampolinePosition.x) {
    frogDisplayX = trampolinePosition.x;
  } else if (logPosition.x) {
    frogDisplayX = logPosition.x;
  }
  // Determine frog's Y position
  // currentBounceTargetY is removed. If on trampoline, Y is trampoline's Y.
  // Visual bounce (up/down movement) will be handled inside Frog.jsx relative to this Y.
  if (isFrogOnTrampoline && isTrampolineActive && trampolinePosition.y) {
    frogDisplayY = trampolinePosition.y;
  } else if (isFrogSleeping && logPosition.y && logSize.height) { // Ensure logSize.height is available
    frogDisplayY = logPosition.y - (logSize.height * 0.3); // Move frog to the top part of the log
  } else if (lilyPads.length > 0 && currentPadIndex !== null && currentPadIndex >= 0 && currentPadIndex < lilyPads.length) {
    frogDisplayY = lilyPads[currentPadIndex]?.y;
  } else if (lilyPads.length > 0) { // Default to first lily pad if index is invalid but pads exist
    frogDisplayY = lilyPads[0]?.y;
  } else if (isTrampolineActive && trampolinePosition.y) { // Fallback if no pads but trampoline exists
    frogDisplayY = trampolinePosition.y;
  } else if (logPosition.y) { // Fallback to log
    frogDisplayY = logPosition.y;
  }
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
      <PondBackground
        width={gameSize.width}
        height={gameSize.height}
      />
      {/* Log Canvas */}
      {logSize.width > 0 && logPosition.x && (
        <canvas
          ref={logCanvasRef}
          onClick={handleLogClick}
          style={{
            position: 'absolute',
            left: logPosition.x - logSize.width / 2,
            top: logPosition.y - logSize.height / 2,
            width: logSize.width, // Style width
            height: logSize.height, // Style height
            zIndex: 5,
            cursor: 'pointer',
            // canvas width/height attributes are set in useEffect
          }}
          // Accessibility: Provide an ARIA label if appropriate, though it's a visual element.
          // For a game element, direct ARIA might be less critical than overall game accessibility.
          aria-label="Log in pond, click to make the frog sleep here"
        />
      )}
      {/* Lily pads */}
      {lilyPads.map((pad, index) => (
        <LilyPad 
          key={pad.id}
          x={pad.x}
          y={pad.y}
          size={pad.size}
          isActive={!isFrogSleeping && index === currentPadIndex} // Active only if not sleeping
          onClick={isFrogSleeping ? null : () => handleJumpToLilyPad(index)} // Disable click if sleeping
        />
      ))}
      {/* Frog character */}
      {(frogDisplayX && frogDisplayY) && (
        <Frog
          key={frogKey} // Add key here
          x={frogDisplayX}
          y={frogDisplayY}
          color={frogColor}
          ownedItems={ownedItems}
          flies={flies}
          onFlyCaught={handleFlyCaught}
          gameOffset={gameOffset}
          isSleeping={isFrogSleeping}
          onWakeUp={handleWakeUpFrog}
          trampolinePosition={trampolinePosition}
          isTrampolineActive={isTrampolineActive}
          onTrampolineImpact={handleTrampolineImpact} // New prop for when frog lands on trampoline
        />
      )}
      {/* Sleep Zzz animation - now depends on isZzzVisible */}
      {isFrogSleeping && isZzzVisible && frogDisplayX && frogDisplayY && (
        <img
          src="https://play.rosebud.ai/assets/Sleep z.GIF?Srht"
          alt="Sleeping zzz"
          style={{
            position: 'absolute',
            left: frogDisplayX - 25, // Center the 50px GIF
            top: frogDisplayY - frogVisualSize / 2 - 40, // Position above the frog's head
            width: 50,
            height: 50,
            zIndex: 100, // Above frog
            pointerEvents: 'none', // So it doesn't interfere with frog click
          }}
        />
      )}
      {/* Fly spawning system */}
      <FlyManager
        // Removed key prop based on currentLevel
        flies={flies}      // Pass flies state
        setFlies={setFlies}
        // moths={moths} - ALREADY REMOVED
        // setMoths={setMoths} - ALREADY REMOVED
        lilyPads={lilyPads}
        gameWidth={gameSize.width}
        gameHeight={gameSize.height}
        // onMothPositionUpdate={handleMothPositionUpdate} // Pass the new handler here - ALREADY REMOVED
      />
      {/* Trampoline */}
      {ownedItems.trampoline_main && (
        <div
          onClick={handleTrampolineClick}
          style={{
            position: 'absolute',
            left: `${gameSize.width * 0.2 - 60}px`, // Center of trampoline at 20% width, 60 is half of 120px size
            top: `${gameSize.height * 0.6 - 60}px`, // Adjusted to match new Y center (0.6)
            width: '120px',
            height: '120px',
            cursor: 'pointer',
            zIndex: 4, // Below log (5) but above background (0)
          }}
          title="Trampoline"
        >
          <img
            src="https://play.rosebud.ai/assets/Trampoline.PNG?43CL"
            alt="Trampoline"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
      {/* Render the consolidated Main Menu */}
      <MainMenu
        onSelectColor={handleFrogColorChange}
        onSelectHat={handleHatSelection} // Pass hat selection handler
        score={score}
        ownedItems={ownedItems}
        onPurchase={handlePurchase}
        isMuted={isMuted} // Pass mute state down
        onToggleMute={handleToggleMute} // Pass toggle function down
        // Removed currentLevel and onSelectLevel props
      />
      {/* Game UI - Using FlyCount asset */}
      <div className="game-ui-score" style={{
        position: 'absolute',
        top: -50,  // Align vertically with menu button
        left: 90, // Position to the right of the menu button
        zIndex: 90, // Ensure it's below the menu button but above background
        width: '200px', // Make it slightly smaller
        height: '200px', // Make it slightly smaller
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Keep centering text horizontally
      }}>
        <img 
          src="https://play.rosebud.ai/assets/FlyCount.PNG?Pyj4" 
          alt="Fly Score" 
          style={{
            position: 'absolute', // Position image absolutely within the container
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            objectFit: 'contain', // Ensure image scales correctly
          }}
        />
        <span style={{
           position: 'relative', // Position text relative to the container
           zIndex: 91, // Ensure text is above the image
           color: '#4a2e1a', // Dark brown color for text
           fontSize: '20px', // Slightly reduced font size
           fontWeight: 'bold', // Keep bold
           fontFamily: "'Arial', sans-serif", // Changed font to Arial for consistency
           marginTop: '-10px', // Adjusted vertical position for smaller container
           marginLeft: '155px', // Adjusted horizontal position to be after the fly icon
        }}>
          {score}
        </span>
      </div>
      {/* Old SettingsMenu and OutfitMenu removed from here */}
      {/* Game instructions div removed */}
    </div>
  );
};