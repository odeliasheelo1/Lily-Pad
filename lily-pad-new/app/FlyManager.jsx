import React, { useState, useEffect } from 'react';
import { Fly } from './Fly';
export const FlyManager = ({ frogPosition, lilyPads = [] }) => {
  const [flies, setFlies] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Listen for window resize
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
  
  // Update fly positions when window resizes
  useEffect(() => {
    if (flies.length > 0) {
      setFlies(prevFlies => 
        prevFlies.map(fly => {
          // Calculate new position based on stored relative coordinates
          const newX = fly.relativeX * window.innerWidth;
          const newY = fly.relativeY * window.innerHeight;
          
          // Make sure fly stays within screen boundaries
          const padding = 50;
          const x = Math.max(padding, Math.min(window.innerWidth - padding, newX));
          const y = Math.max(padding, Math.min(window.innerHeight - padding, newY));
          
          return {
            ...fly,
            x,
            y
          };
        })
      );
    }
  }, [windowSize, flies.length]);
  
  // Handle spawning a new fly
  const spawnFly = (x, y) => {
    // If no coords provided, spawn in random position near a lily pad
    if (x === undefined || y === undefined) {
      // If no lily pads, can't spawn flies
      if (lilyPads.length === 0) return;
      
      // Choose a random lily pad
      const randomPadIndex = Math.floor(Math.random() * lilyPads.length);
      const targetPad = lilyPads[randomPadIndex];
      
      // Define the spawn radius around the lily pad
      const minDistance = 30; // Minimum distance from pad center (not too close)
      const maxDistance = 120; // Maximum distance from pad center (not too far)
      
      // Random angle and distance
      const angle = Math.random() * Math.PI * 2;
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      
      // Calculate position based on lily pad's location
      x = targetPad.x + Math.cos(angle) * distance;
      y = targetPad.y + Math.sin(angle) * distance;
      
      // Make sure fly stays within screen boundaries
      const padding = 50;
      x = Math.max(padding, Math.min(window.innerWidth - padding, x));
      y = Math.max(padding, Math.min(window.innerHeight - padding, y));
      
      // Store relative positions for responsive positioning
      const relativeX = x / window.innerWidth;
      const relativeY = y / window.innerHeight;
    }
    
    const newFly = {
      id: Date.now(),
      x,
      y,
      relativeX: x / window.innerWidth,
      relativeY: y / window.innerHeight,
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
    if (lilyPads.length === 0) return;
    
    const interval = setInterval(() => {
      if (flies.length < 8) { // Increased maximum flies since we removed manual spawning
        spawnFly();
      }
    }, 2000 + Math.random() * 3000); // More frequent spawning (2-5 seconds)
    
    return () => clearInterval(interval);
  }, [flies.length, lilyPads]);
  
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
      
      window.frogExtendTongue(closestFly.x, closestFly.y);
      
      // Remove the fly after a short delay
      setTimeout(() => {
        handleFlyCaught(flyId);
      }, 300);
      
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
  }, [flies, frogPosition, lilyPads]);
  
  return (
    <>
      {flies.map(fly => (
        <Fly
          key={fly.id}
          id={fly.id}
          x={fly.x}
          y={fly.y}
          type={fly.type}
          frogPosition={frogPosition}
          onCaught={handleFlyCaught}
        />
      ))}
    </>
  );
};

export default FlyManager;