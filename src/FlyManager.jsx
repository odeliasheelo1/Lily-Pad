import React, { useState, useEffect } from 'react';
import { Fly } from './Fly';
// import { Moth } from 'Moth'; // Import the Moth component REMOVED
// Accept flies, setFlies, gameWidth, gameHeight, lilyPads props
// Removed moths, setMoths, and onMothPositionUpdate props
export const FlyManager = ({ flies, setFlies, lilyPads = [], gameWidth, gameHeight }) => {
  // Handle spawning a new fly
  const spawnFly = () => {
    if (!lilyPads || lilyPads.length === 0 || !gameWidth || !gameHeight) return;
    const randomPadIndex = Math.floor(Math.random() * lilyPads.length);
    const targetPad = lilyPads[randomPadIndex];
    const minDistance = Math.min(gameWidth, gameHeight) * 0.05;
    const maxDistance = Math.min(gameWidth, gameHeight) * 0.2;
    const angle = Math.random() * Math.PI * 2;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    let x = targetPad.x + Math.cos(angle) * distance;
    let y = targetPad.y + Math.sin(angle) * distance;
    const padding = 30;
    x = Math.max(padding, Math.min(gameWidth - padding, x));
    y = Math.max(padding, Math.min(gameHeight - padding, y));
    const newFly = {
      id: `fly-${Date.now()}-${Math.random()}`,
      x,
      y,
      relativeX: x / gameWidth,
      relativeY: y / gameHeight,
      type: Math.floor(Math.random() * 4) + 1,
    };
    setFlies(prevFlies => [...prevFlies, newFly]);
  };
  // // Handle spawning a new moth REMOVED
  // const spawnMoth = () => {
  //   if (!lilyPads || lilyPads.length === 0 || !gameWidth || !gameHeight) return;
  //   // Moths spawn near a lily pad but can roam further
  //   const randomPadIndex = Math.floor(Math.random() * lilyPads.length);
  //   const targetPad = lilyPads[randomPadIndex];
  //   
  //   // Spawn slightly offset from the lily pad center
  //   const offsetX = (Math.random() - 0.5) * targetPad.size * 0.5;
  //   const offsetY = (Math.random() - 0.5) * targetPad.size * 0.5;
  //   
  //   let x = targetPad.x + offsetX;
  //   let y = targetPad.y + offsetY;
  //   // Ensure moths spawn within initial game boundaries
  //   const padding = 10; // Moths can start closer to edges
  //   x = Math.max(padding, Math.min(gameWidth - padding, x));
  //   y = Math.max(padding, Math.min(gameHeight - padding, y));
  //   const newMoth = {
  //     id: `moth-${Date.now()}-${Math.random()}`,
  //     initialX: x,
  //     initialY: y,
  //   };
  //   setMoths(prevMoths => [...prevMoths, newMoth]);
  // };
  // Spawn flies automatically
  useEffect(() => {
    if (!setFlies || lilyPads.length === 0 || !gameWidth || !gameHeight) return;
    const flyInterval = setInterval(() => {
      if (flies.length < 8) {
        spawnFly();
      }
    }, 2000 + Math.random() * 2500); // Flies spawn a bit less frequently
    return () => clearInterval(flyInterval);
  }, [flies.length, lilyPads, gameWidth, gameHeight, setFlies]);
  // // Spawn moths automatically REMOVED
  // useEffect(() => {
  //   if (!setMoths || lilyPads.length === 0 || !gameWidth || !gameHeight) return;
  //   const mothInterval = setInterval(() => {
  //     if (moths.length < 3) { // Fewer moths than flies
  //       spawnMoth();
  //     }
  //   }, 4000 + Math.random() * 3000); // Moths spawn less frequently
  //   return () => clearInterval(mothInterval);
  // }, [moths.length, lilyPads, gameWidth, gameHeight, setMoths]);
  return (
    <>
      {flies.map(fly => {
        const otherFlies = flies.filter(f => f.id !== fly.id).map(f => ({ id: f.id, x: f.x, y: f.y }));
        return (
          <Fly
            key={fly.id}
            id={fly.id}
            x={fly.x}
            y={fly.y}
            type={fly.type}
            lilyPads={lilyPads}
            gameWidth={gameWidth}
            gameHeight={gameHeight}
            otherFlies={otherFlies}
          />
        );
      })}
      {/* Moth rendering removed */}
      {/* {moths.map(moth => (
        <Moth
          key={moth.id}
          id={moth.id}
          initialX={moth.initialX} 
          initialY={moth.initialY}
          x={moth.x} 
          y={moth.y} 
          lilyPads={lilyPads} 
          gameWidth={gameWidth}
          gameHeight={gameHeight}
          onPositionUpdate={onMothPositionUpdate} 
        />
      ))} */}
    </>
  );
};