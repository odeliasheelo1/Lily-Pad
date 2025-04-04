import React, { useState, useRef, useEffect } from 'react';

export const Frog = ({ x, y, onFlyCaught, color }) => {
  const [frogState, setFrogState] = useState('idle'); // idle, jumping, eating
  const [currentImage, setCurrentImage] = useState(1);
  
  // Ensure color is always valid
  const validColor = ['green', 'red', 'yellow'].includes(color) ? color : 'green';
  const [rotation, setRotation] = useState(0);
  const [tongueExtended, setTongueExtended] = useState(false);
  const [tongueTarget, setTongueTarget] = useState({ x: 0, y: 0 });
  const [tongueTip, setTongueTip] = useState(1);
  
  const prevPosition = useRef({ x, y });
  
  // Handle frog movement animations
  useEffect(() => {
    if (prevPosition.current.x !== x || prevPosition.current.y !== y) {
      // Calculate direction of jump to set rotation during jump only
      const dx = x - prevPosition.current.x;
      const dy = y - prevPosition.current.y;
      const angle = Math.atan2(dy, dx);
      // Reduce rotation by applying a factor to make it more subtle
      setRotation(angle * (180 / Math.PI) * 0.5);
      
      // Start jump animation
      setFrogState('jumping');
      setCurrentImage(2); // Starting with lifting-off position
      
      // First timer: full extension phase
      const jumpStartTimer = setTimeout(() => {
        setCurrentImage(3); // Extended position for the entire jump
      }, 200);
      
      // Third timer: pre-landing phase
      const jumpLandTimer = setTimeout(() => {
        setCurrentImage(2); // Pre-landing position
      }, 600);
      
      // Fourth timer: complete landing and reset rotation
      const jumpCompleteTimer = setTimeout(() => {
        setFrogState('idle');
        setCurrentImage(1); // Back to idle position
        setRotation(0); // Reset rotation to make frog land flat
      }, 800);
      
      prevPosition.current = { x, y };
      
      return () => {
        clearTimeout(jumpStartTimer);
        clearTimeout(jumpLandTimer);
        clearTimeout(jumpCompleteTimer);
      };
    }
  }, [x, y]);
  
  // Function to extend tongue toward a fly
  const extendTongue = (flyX, flyY) => {
    if (frogState !== 'eating') {
      setFrogState('eating');
      // Keep current image instead of changing to Frog3
      setTongueExtended(true);
      setTongueTarget({ x: flyX, y: flyY });
      
      // Start tongue animation flicking between images
      const tongueInterval = setInterval(() => {
        setTongueTip(prev => prev === 1 ? 2 : 1);
      }, 100);
      
      // Retract tongue after animation
      setTimeout(() => {
        clearInterval(tongueInterval);
        setTongueExtended(false);
        onFlyCaught();
        
        // Return to idle state only if we weren't jumping
        setTimeout(() => {
          if (frogState === 'eating') {
            setFrogState('idle');
            // Only reset to Frog1 if we're not in the middle of a jump
            if (currentImage !== 2 && currentImage !== 3) {
              setCurrentImage(1);
            }
          }
        }, 200);
      }, 300);
    }
  };
  
  // Make the extendTongue method available to parent components
  useEffect(() => {
    // This would typically be done through a ref or context
    // For simplicity in this demo, we'll add it to the window
    window.frogExtendTongue = extendTongue;
    
    // Add a function to trigger jump animation
    window.triggerFrogJump = (targetX, targetY) => {
      // Calculate direction of jump to set rotation
      const dx = targetX - x;
      const dy = targetY - y;
      const angle = Math.atan2(dy, dx);
      // Reduce rotation by applying a factor to make it more subtle
      setRotation(angle * (180 / Math.PI) * 0.5);
      
      // Start jump animation immediately
      setFrogState('jumping');
      setCurrentImage(2); // Start with lifting-off position
      
      // Begin animation sequence - go straight to Frog3 for the main jump
      const jumpStartTimer = setTimeout(() => {
        setCurrentImage(3); // Extended position for the entire jump
      }, 200);
      
      const jumpLandTimer = setTimeout(() => {
        setCurrentImage(2); // Pre-landing position
      }, 600);
    };
    
    return () => {
      delete window.frogExtendTongue;
      delete window.triggerFrogJump;
    };
  }, [x, y]);
  
  // Calculate tongue dimensions based on target
  const calculateTongue = () => {
    if (!tongueExtended) return null;
    
    const dx = tongueTarget.x - x;
    const dy = tongueTarget.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return {
      width: distance,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'left center',
    };
  };
  
  const tongueStyle = calculateTongue();
  
  // Track double-click
  const [lastClickTime, setLastClickTime] = useState(0);
  
  // Handle frog click
  const handleFrogClick = () => {
    const currentTime = new Date().getTime();
    const isDoubleClick = currentTime - lastClickTime < 300; // 300ms threshold for double-click
    
    setLastClickTime(currentTime);
    
    // Allow double-click to work regardless of frog state, as long as tongue isn't extended
    if (isDoubleClick && !tongueExtended) {
      // Double click - try to eat a fly
      if (window.checkForNearbyFlies) {
        window.checkForNearbyFlies();
      }
    } else {
      // Single click - no animation now, just check for flies on double-click
    }
  };
  
  return (
    <div 
      className="frog-container" 
      onClick={handleFrogClick}
      style={{
        position: 'absolute',
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        zIndex: 20,
        transform: `rotate(${rotation}deg)`,
        transition: frogState === 'jumping' 
          ? 'all 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)' 
          : 'all 0.2s ease',
        cursor: 'pointer',
      }}>
      {/* Frog image */}
      <img 
        src={
          validColor === 'green' ?
            `https://play.rosebud.ai/assets/Frog${currentImage}.png?${
              currentImage === 1 ? 'kssR' : currentImage === 2 ? 'FqQu' : 'cuLg'
            }` :
          `https://play.rosebud.ai/assets/${validColor.charAt(0).toUpperCase() + validColor.slice(1)} Frog ${currentImage}.${validColor === 'green' ? 'png' : 'PNG'}?${
            validColor === 'red' ?
              (currentImage === 1 ? '9ocr' : currentImage === 2 ? 'zjkN' : currentImage === 3 ? 'LNwW' : 'y3n0') :
              (currentImage === 1 ? 'OXP4' : currentImage === 2 ? 'xsbc' : currentImage === 3 ? 'NElb' : '2v3F')
          }`
        }
        alt="Frog"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 20, // Lower z-index so tongue can appear over frog
        }}
      />
      
      {/* Tongue (visible only when extended) */}
      {tongueExtended && (
        <div className="frog-tongue" style={{
          position: 'absolute',
          left: '50%',
          top: '40%', // Move tongue up to come from mouth area
          height: 8, // Slightly thinner tongue
          backgroundColor: '#ff6699',
          zIndex: 22, // Higher z-index to appear over the frog
          width: tongueStyle.width,
          transform: tongueStyle.transform,
          transformOrigin: tongueStyle.transformOrigin,
        }}>
          <img 
            src={`https://play.rosebud.ai/assets/GreenTongue${tongueTip}.png?${tongueTip === 1 ? 'DPLH' : 'xFG2'}`}
            alt="Tongue Tip"
            style={{
              position: 'absolute',
              right: -20,
              top: -5,
              width: 30,
              height: 20,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Frog;