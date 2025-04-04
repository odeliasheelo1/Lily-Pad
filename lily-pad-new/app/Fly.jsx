import React, { useState, useEffect, useRef } from 'react';

export const Fly = ({ id, x, y, type, frogPosition, onCaught, lilyPads }) => {
  // Store the full fly object for reference to relativeX and relativeY
  const fly = { id, x, y, type, relativeX: x / window.innerWidth, relativeY: y / window.innerHeight };
  const [position, setPosition] = useState({ x, y });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Update position when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Update fly position based on relative coordinates
      if (typeof fly !== 'undefined' && typeof fly.relativeX === 'number' && typeof fly.relativeY === 'number') {
        setPosition({
          x: fly.relativeX * window.innerWidth,
          y: fly.relativeY * window.innerHeight
        });
      } else if (typeof x === 'number' && typeof y === 'number') {
        const relativeX = x / windowSize.width;
        const relativeY = y / windowSize.height;
        
        setPosition({
          x: relativeX * window.innerWidth,
          y: relativeY * window.innerHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [x, y, windowSize.width, windowSize.height]);
  const [hovering, setHovering] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(1);
  const flyRef = useRef(null);
  
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
      
      // Basic hovering motion
      // Scale hover motion based on window size for responsive behavior
      const scaleX = windowSize.width / 1000; // Reference width of 1000px
      const scaleY = windowSize.height / 800; // Reference height of 800px
      const movementScale = Math.min(1, Math.max(0.5, (scaleX + scaleY) / 2));
      
      // Apply scaled movement
      let newX = x + Math.sin(elapsed / 1000) * 15 * movementScale;
      let newY = y + Math.cos(elapsed / 1500) * 10 * movementScale;
      
      // Add attraction to target lily pad if one exists
      if (targetLilyPad) {
        // Vector toward target lily pad
        const dx = targetLilyPad.x - newX;
        const dy = targetLilyPad.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction strength - stronger when further away, weaker when close
        // Scale attraction strength based on window size
        const attractionStrength = Math.min(0.01, 0.5 / distance) * movementScale;
        
        // Apply attraction force with some randomness
        newX += dx * attractionStrength * (0.5 + Math.random() * 0.5);
        newY += dy * attractionStrength * (0.5 + Math.random() * 0.5);
      }
      
      setPosition({ x: newX, y: newY });
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [x, y, targetLilyPad]);
  
  // Animate through fly frames
  useEffect(() => {
    if (!hovering) return;
    
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => (prev % 4) + 1); // Cycle through 1-4
    }, 150); // Change frames every 150ms
    
    return () => clearInterval(frameInterval);
  }, [hovering]);
  
  // Check for tongue collision
  useEffect(() => {
    // Check distance to frog
    const checkFrogDistance = () => {
      const dx = position.x - frogPosition.x;
      const dy = position.y - frogPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If within catching range and frog has tongue-extending function
      if (distance < 250 && window.frogExtendTongue && hovering) {
        setHovering(false);
        window.frogExtendTongue(position.x, position.y);
        
        // Let the frog "eat" the fly
        setTimeout(() => {
          onCaught(id);
        }, 300);
      }
    };
    
    const interval = setInterval(checkFrogDistance, 100);
    return () => clearInterval(interval);
  }, [id, position, frogPosition, onCaught, hovering]);
  
  // Fly appearance - scale based on window size
  const baseFlySize = 40;
  const isSmallScreen = windowSize.width < 768;
  const flySize = isSmallScreen ? baseFlySize * 0.8 : baseFlySize;
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
        animation: hovering ? `fly-hover ${isSmallScreen ? '0.4s' : '0.5s'} infinite alternate` : 'none',
        transform: `rotate(${Math.sin(Date.now() / 500) * (isSmallScreen ? 7 : 10)}deg)`,
      }}
    >
      <img 
        src={`https://play.rosebud.ai/assets/${flyImage}.png?${flyImageId}`}
        alt="Fly"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      
      <style>
        {`
          @keyframes fly-hover {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(${isSmallScreen ? '-3px' : '-5px'}) rotate(${isSmallScreen ? '3deg' : '5deg'}); }
          }
        `}
      </style>
    </div>
  );
};

export default Fly;