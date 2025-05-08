import React, { useState, useEffect, useRef } from 'react';
// Removed frogPosition and onCaught props for now
export const Fly = ({ id, x, y, type, lilyPads, gameWidth, gameHeight }) => {
  const [position, setPosition] = useState({ x, y });
  // Removed windowSize state and resize effect
  // Removed windowSize state and resize effect
  const [hovering, setHovering] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false); // State to track horizontal flip
  const flyRef = useRef(null);
  const prevXRef = useRef(x); // Ref to store previous X position
  // Target lily pad for movement
  const [targetLilyPad, setTargetLilyPad] = useState(null);
  const [moveTimer, setMoveTimer] = useState(null);
  // Choose a new target lily pad to move toward
  const chooseNewTarget = () => {
    if (!lilyPads || lilyPads.length === 0) return;
    
    // Occasionally choose a new lily pad to fly toward
    const randomIndex = Math.floor(Math.random() * lilyPads.length);
    setTargetLilyPad(lilyPads[randomIndex]);
    
    // Set a timer to choose a new target in the future
    clearTimeout(moveTimer);
    const newTimer = setTimeout(() => {
      chooseNewTarget();
    }, 5000 + Math.random() * 5000); // Change targets every 5-10 seconds
    
    setMoveTimer(newTimer);
  };
  
  // Initialize target lily pad
  useEffect(() => {
    if (lilyPads && lilyPads.length > 0) {
      chooseNewTarget();
    }
    
    return () => {
      clearTimeout(moveTimer);
    };
  }, [lilyPads]);
  // Fly hover movement with attraction to target lily pad
  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Basic hovering motion - Use fixed game size for reference? Keep it simpler for now.
      // Let's use a fixed movement scale for simplicity with the fixed container
      const movementScale = 0.8; // Adjust as needed
      // Apply movement based on original spawn position (x, y props)
      let newX = x + Math.sin(elapsed / 1000) * 15 * movementScale;
      let newY = y + Math.cos(elapsed / 1500) * 10 * movementScale;
      // Add attraction to target lily pad if one exists
      if (targetLilyPad) {
        // Vector toward target lily pad
        const dx = targetLilyPad.x - newX;
        const dy = targetLilyPad.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Attraction strength - stronger when further away, weaker when close
        // Use a simpler strength calculation
        const attractionStrength = Math.min(0.01, 1 / (distance + 10)) * movementScale;
        // Apply attraction force
        newX += dx * attractionStrength;
        newY += dy * attractionStrength;
        // Clamp position within game bounds (use gameWidth/gameHeight)
        const padding = 10; // Small padding
        newX = Math.max(padding, Math.min(gameWidth - padding, newX));
        newY = Math.max(padding, Math.min(gameHeight - padding, newY));
      }
      
      // Determine flip based on direction change
      if (newX < prevXRef.current) {
          setIsFlipped(true); // Moving left
      } else if (newX > prevXRef.current) {
          setIsFlipped(false); // Moving right
      }
      // If newX === prevXRef.current, keep the current flip state
      setPosition({ x: newX, y: newY });
      prevXRef.current = newX; // Update previous X position
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [x, y, targetLilyPad, gameWidth, gameHeight]); // Added game dimensions
  // Animate through fly frames
  useEffect(() => {
    if (!hovering) return;
    
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => (prev % 4) + 1); // Cycle through 1-4
    }, 150); // Change frames every 150ms
    
    return () => clearInterval(frameInterval);
  }, [hovering]);
  
  // Removed the old distance check effect that relied on frogPosition/onCaught props
  
  // Fly appearance - use fixed size for now
  const flySize = 35; // Fixed fly size
  // Determine if the game area is "small" based on its fixed dimensions
  const isSmallGame = gameWidth < 600 || gameHeight < 500;
  const animationSpeed = isSmallGame ? '0.4s' : '0.5s';
  const hoverAmount = isSmallGame ? '-3px' : '-5px';
  const rotateAmount = isSmallGame ? '3deg' : '5deg';
  const flyImage = `Fly${currentFrame}`;
  const flyImageId = 
    currentFrame === 1 ? 'ekp0' : 
    currentFrame === 2 ? 'oW87' : 
    currentFrame === 3 ? '45T8' : 'DeXx';
  
  return (
    <div 
      ref={flyRef}
      className="fly"
      style={{
        position: 'absolute',
        left: position.x - flySize/2,
        top: position.y - flySize/2,
        width: flySize,
        height: flySize,
        zIndex: 15,
        transition: 'transform 0.1s ease',
        animation: hovering ? `fly-hover ${animationSpeed} infinite alternate` : 'none',
        // Simpler rotation based on hover animation timing
        // transform: `rotate(${Math.sin(Date.now() / 500) * (isSmallGame ? 7 : 10)}deg)`,
      }}
    >
      <img 
        src={`https://play.rosebud.ai/assets/${flyImage}.png?${flyImageId}`}
        alt="Fly"
        style={{
          width: '100%',
          height: '100%',
          transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)', // Apply flip transform
          transition: 'transform 0.2s ease-in-out', // Smoother flip transition
        }}
      />
      
      <style>
        {`
          @keyframes fly-hover {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(${hoverAmount}) rotate(${rotateAmount}); }
          }
        `}
      </style>
    </div>
  );
};