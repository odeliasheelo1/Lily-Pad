import React, { useState, useEffect } from 'react';
import { Fly } from './Fly';
// Accept gameWidth, gameHeight, and onScoreUpdate props
export const FlyManager = ({ frogPosition, lilyPads = [], gameWidth, gameHeight, onScoreUpdate }) => {
  const [flies, setFlies] = useState([]);
  // Removed window resize listener and related state
  // Handle spawning a new fly within game boundaries
  const spawnFly = () => {
    // If no coords provided, spawn in random position near a lily pad
    // If no lily pads or game dimensions, can't spawn flies
    if (!lilyPads || lilyPads.length === 0 || !gameWidth || !gameHeight) return;
    // Choose a random lily pad
    const randomPadIndex = Math.floor(Math.random() * lilyPads.length);
    const targetPad = lilyPads[randomPadIndex];
    // Define the spawn radius around the lily pad, relative to game size
    const minDistance = Math.min(gameWidth, gameHeight) * 0.05; // 5% of smaller dimension
    const maxDistance = Math.min(gameWidth, gameHeight) * 0.2;  // 20% of smaller dimension
    // Random angle and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    // Calculate position based on lily pad's location
    let x = targetPad.x + Math.cos(angle) * distance;
    let y = targetPad.y + Math.sin(angle) * distance;
    // Make sure fly stays within game boundaries (using gameWidth/gameHeight)
    const padding = 30; // Reduced padding
    x = Math.max(padding, Math.min(gameWidth - padding, x));
    y = Math.max(padding, Math.min(gameHeight - padding, y));
    const newFly = {
      id: Date.now(),
      x,
      y,
      // Relative positions based on game dimensions
      relativeX: x / gameWidth,
      relativeY: y / gameHeight,
      type: Math.floor(Math.random() * 4) + 1, // Random fly type (1-4)
    };
    setFlies(prevFlies => [...prevFlies, newFly]);
  };
  
  // Handle fly being caught
  const handleFlyCaught = (flyId) => {
    setFlies(prevFlies => prevFlies.filter(fly => fly.id !== flyId));
  };
  
  // Automatic fly spawning only, no click-to-spawn
  
  // Spawn flies automatically at random intervals
  useEffect(() => {
    // Only spawn flies if we have lily pads
    if (lilyPads.length === 0 || !gameWidth || !gameHeight) return; // Check game dimensions too
    const interval = setInterval(() => {
      if (flies.length < 8) {
        spawnFly();
      }
    }, 1000 + Math.random() * 2000); // Even more frequent spawning (1-3 seconds)
    
    return () => clearInterval(interval);
  }, [flies.length, lilyPads, gameWidth, gameHeight]); // Add game dimensions to dependency array
  // Check for nearby flies (called when frog is clicked)
  const checkForNearbyFlies = () => {
    if (flies.length === 0) return false;
    
    // Find the closest fly
    let closestFly = null;
    let closestDistance = Infinity;
    
    flies.forEach(fly => {
      const dx = fly.x - frogPosition.x;
      const dy = fly.y - frogPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 250 && distance < closestDistance) {
        closestFly = fly;
        closestDistance = distance;
      }
    });
    
    // If found a nearby fly, have the frog eat it
    if (closestFly && window.frogExtendTongue) {
      // We need to store the fly ID before it's potentially removed
      const flyId = closestFly.id;
      // Trigger score update immediately
      if (onScoreUpdate) {
        onScoreUpdate();
      }
      // Trigger tongue animation
      window.frogExtendTongue(closestFly.x, closestFly.y);
      // Remove the fly after a shorter delay matching the tongue animation
      setTimeout(() => {
        handleFlyCaught(flyId); // Removes fly from state
      }, 150); // Match the new tongue extension time in Frog.jsx
      return true;
    }
    
    return false;
  };
  
  // Make the checkForNearbyFlies function available globally
  useEffect(() => {
    window.checkForNearbyFlies = checkForNearbyFlies;
    
    return () => {
      delete window.checkForNearbyFlies;
    };
    // Added gameWidth/Height dependencies here implicitly through spawnFly changes
  }, [flies, frogPosition, lilyPads, gameWidth, gameHeight, onScoreUpdate]); // Add onScoreUpdate to dependencies
  return (
    <>
      {flies.map(fly => {
        // Filter out the current fly from the list passed down
        const otherFlies = flies.filter(f => f.id !== fly.id).map(f => ({ id: f.id, x: f.x, y: f.y }));
        return (
          <Fly
            key={fly.id}
            id={fly.id}
            x={fly.x}
            y={fly.y}
            type={fly.type}
            frogPosition={frogPosition}
            onCaught={handleFlyCaught}
            lilyPads={lilyPads} // Pass lilyPads down
            gameWidth={gameWidth} // Pass gameWidth down
            gameHeight={gameHeight} // Pass gameHeight down
            otherFlies={otherFlies} // Pass positions of other flies
          />
        );
      })}
    </>
  );
};