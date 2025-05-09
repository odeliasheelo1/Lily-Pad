import React, { useState, useRef, useEffect } from 'react';
// Accept ownedItems, flies, onFlyCaught, gameOffset, isSleeping, onWakeUp, trampolinePosition, isTrampolineActive, and onTrampolineImpact props.
export const Frog = ({ x, y, color, ownedItems, flies, onFlyCaught, gameOffset, isSleeping, onWakeUp, trampolinePosition, isTrampolineActive, onTrampolineImpact }) => { 
  const [frogState, setFrogState] = useState('idle'); // idle, jumping, eating
  const [currentImage, setCurrentImage] = useState(1);
  // Ensure color is always valid
  const validColor = ['green', 'red', 'yellow'].includes(color) ? color : 'green';
  const [rotation, setRotation] = useState(0);
  // Tongue state
  const [tongueState, setTongueState] = useState('idle'); // idle, charging, extending, retracting
  const [tongueTarget, setTongueTarget] = useState({ x: 0, y: 0 }); // Where the cursor was on release
  const [tongueDistance, setTongueDistance] = useState(0); // How far the tongue *should* go (target)
  const [currentTongueLength, setCurrentTongueLength] = useState(0); // Actual visual length for animation
  const [tongueTip, setTongueTip] = useState(1);
  const [chargeStartTime, setChargeStartTime] = useState(null); // Track hold start time
  const [chargeLevel, setChargeLevel] = useState(0); // 0 to 1, for the visual indicator
  // State for internal trampoline bounce animation
  const [verticalBounceOffset, setVerticalBounceOffset] = useState(0);
  const [internalBounceActive, setInternalBounceActive] = useState(false);
  // Refs for mouseup handler logic to ensure stability
  const frogLogicRef = useRef({});
  
  const prevPosition = useRef({ x, y }); // Holds previous x,y for jump detection
  const isInitialMount = useRef(true); // Flag to skip animation on first render if x,y are stable
  const maxTongueDistance = 250; // Max distance the tongue can travel
  const chargeTimeForMaxDistance = 1000; // 1 second hold for max distance
  // Set initial frog image to idle on mount
  useEffect(() => {
    setCurrentImage(1); // Start with idle image
  }, []);
  // Effect to reset animation states when color changes
  useEffect(() => {
    // Reset to idle state when color changes to avoid animation glitches
    setFrogState('idle');
    setCurrentImage(1);
    setRotation(0);
    setTongueState('idle');
    setCurrentTongueLength(0);
    setChargeLevel(0);
    // If you have other animation-specific states, reset them here too
  }, [validColor]); // Watch for changes in the validated color
  const tongueRetractionTime = 150; // ms for tongue to retract
  const tongueHeight = 8; // Height of the tongue div in pixels
  const frogRef = useRef(null); // Ref for the frog container div
  
  // Handle frog movement and bounce animations
  useEffect(() => {
    // Skip animation on initial mount if x,y are already set, or if x,y haven't changed.
    if (isInitialMount.current || (prevPosition.current.x === x && prevPosition.current.y === y)) {
      prevPosition.current = { x, y };
      isInitialMount.current = false;
      // Ensure frog is in idle image if not jumping and initial mount
      if (frogState !== 'jumping' && tongueState === 'idle' && !isSleeping && !internalBounceActive) {
        setCurrentImage(1);
      }
      return;
    }
    let animationTimers = []; // To store all timers for this specific animation sequence
    // Calculate direction for rotation for any jump - REMOVED to prevent turning
    // const dx = x - prevPosition.current.x;
    // const dy = y - prevPosition.current.y;
    // const angle = Math.atan2(dy, dx);
    // setRotation(angle * (180 / Math.PI) * 0.5); // Rotation is now disabled during jump
// Determine if this movement is part of a trampoline bounce sequence.
    // This is true if the frog is moving towards a y-coordinate
    // that is either the peak of the bounce or the trampoline surface itself,
    // AND the frog is horizontally aligned with the trampoline.
    const isBouncing = 
      isTrampolineActive &&
      trampolinePosition &&
      Math.abs(x - trampolinePosition.x) < 1 && // Horizontally aligned
      (y < prevPosition.current.y || y === trampolinePosition.y); // Moving up or landing
    setFrogState('jumping');
    if (isBouncing) {
      // For trampoline bounces, use a simpler animation:
      // Frog quickly goes to "extended" (image 3) and stays there until "landing" on trampoline.
      // The game logic (bounceState in LilyPadGame) handles the timing of ascent and descent.
      setCurrentImage(3); // Extended position for bounce
      // The decision to call onTrampolineImpact or change bounceState is handled by LilyPadGame
      // when this jump animation completes (i.e., when x,y match the target).
      // The key is that LilyPadGame's bounceState changes trigger new x,y targets for Frog.
    } else {
      // Standard jump animation (not a trampoline bounce) - now with looping
      setCurrentImage(2); // Initial lifting-off position
      // Timer for mid-air extended pose
      const midAirTimer = setTimeout(() => {
        // Ensure frog is still in 'jumping' state and not in a special state (like internal bounce)
        // or already transitioning to another state due to fast, subsequent actions.
        // The isSleeping prop change should not interrupt the visual frames of the jump itself.
        if (frogState === 'jumping' && !internalBounceActive) {
          setCurrentImage(3); // Extended pose
        }
      }, 150); // Show extended pose after 150ms
      animationTimers.push(midAirTimer);
      // Timer for pre-landing tucked pose
      const preLandingTimer = setTimeout(() => {
         if (frogState === 'jumping' && !internalBounceActive) {
          setCurrentImage(2); // Tucked pose before landing
        }
      }, 550); // Show tucked pose after 550ms (total jump is 800ms)
      animationTimers.push(preLandingTimer);
      
      // The animationCompleteTimer (already existing) will set to image 1 (idle) at 800ms.
    }
    
    // Timer to transition back to idle and potentially call onTrampolineImpact.
    // This timer's duration should match the CSS transition duration for movement.
    const animationCompleteTimer = setTimeout(() => {
      setFrogState('idle');
      setCurrentImage(1); // Default to idle position after jump
      if (isBouncing && onTrampolineImpact && trampolinePosition &&
          Math.abs(x - trampolinePosition.x) < 5 && 
          Math.abs(y - trampolinePosition.y) < 5 &&
          isTrampolineActive) {
        // Landed on an active trampoline
        setInternalBounceActive(true);
        onTrampolineImpact(); 
        // Bounce useEffect will handle currentImage
      } else {
        // Not on trampoline or trampoline not active, or jumped elsewhere
        setInternalBounceActive(false);
        setVerticalBounceOffset(0); // Ensure bounce offset is reset
        if (!isBouncing) { // For non-trampoline jumps
          setRotation(0);
        }
        // Ensure currentImage is 1 if truly idle and not handled by bounce
        // Ensure currentImage is 1 if truly idle and not handled by bounce or sleeping
        if (frogState === 'idle' && tongueState === 'idle' && !isSleeping && !internalBounceActive) {
            setCurrentImage(1); 
        } else if (isSleeping) {
            setCurrentImage(1); // Ensure sleeping frog is in idle pose
        }
      }
      // If it was a bounce but didn't land exactly on trampoline (e.g. peak), 
      // LilyPadGame's bounceState logic will handle the next phase.
    }, 800); // Matches CSS transition for jump
    animationTimers.push(animationCompleteTimer);
    
    prevPosition.current = { x, y };
    return () => {
      animationTimers.forEach(timerId => {
        if (typeof timerId === 'number') { // Check if it's a setTimeout ID
          clearTimeout(timerId);
        } else { // Assume it's an interval ID (though clearInterval also accepts numbers)
          clearInterval(timerId); 
        }
      }); // Cleanup all timers and intervals
    };
  }, [x, y, isTrampolineActive, trampolinePosition, onTrampolineImpact, frogState, tongueState, isSleeping, internalBounceActive]);
// Store relevant functions and state in frogLogicRef for stable access in event listener
useEffect(() => {
  frogLogicRef.current = {
    tongueState,
    frogState, // Ensure frogState is included for tongue logic
    chargeStartTime,
    gameOffset,
    flies,
    // moths, // Removed
    x,
    y,
    rotation, // Make sure rotation is included if used by launchTongue directly or indirectly
    onFlyCaught,
    // onMothCaught, // Removed
    setTongueState,
    setTongueTarget,
    setTongueDistance,
    setCurrentTongueLength,
    setTongueTip,
    setChargeStartTime,
    // Define launchTongue logic here, ensuring it uses values from frogLogicRef.current
    launchTongue: (distance, targetX, targetY) => {
      const current = frogLogicRef.current;
      // Prevent tongue action if jumping
      if ((current.tongueState !== 'idle' && current.tongueState !== 'charging') || 
          current.frogState === 'jumping') return;
      
      current.setTongueState('extending');
      current.setTongueTarget({ x: targetX, y: targetY });
      current.setTongueDistance(distance);
      current.setCurrentTongueLength(distance);
      
      const tipInterval = setInterval(() => {
        current.setTongueTip(prev => prev === 1 ? 2 : 1);
      }, 100);
      
      const extensionDuration = 150 + (distance / maxTongueDistance) * 150;
      
      setTimeout(() => {
        clearInterval(tipInterval);
        const frogCenterX = current.x;
        const frogCenterY = current.y;
        // Re-fetch tongueTarget from ref in case it was updated by another process, though unlikely here.
        const currentTongueTarget = frogLogicRef.current.tongueTarget || {x: targetX, y: targetY}; // Fallback if not set
        
        const dx = currentTongueTarget.x - frogCenterX;
        const dy = currentTongueTarget.y - frogCenterY;
        // Collision detection logic (ensure all variables like flies, x, y are from current ref)
        const tongueOriginOffsetX = 15; 
        const tongueOriginOffsetY = -8; 
        const tongueStartX = frogCenterX + tongueOriginOffsetX * Math.cos(current.rotation * Math.PI / 180) - tongueOriginOffsetY * Math.sin(current.rotation * Math.PI / 180);
        const tongueStartY = frogCenterY + tongueOriginOffsetX * Math.sin(current.rotation * Math.PI / 180) + tongueOriginOffsetY * Math.cos(current.rotation * Math.PI / 180);
        
        const dirDx = currentTongueTarget.x - tongueStartX;
        const dirDy = currentTongueTarget.y - tongueStartY;
        const dirMag = Math.sqrt(dirDx*dirDx + dirDy*dirDy);
        const normDirX = dirMag > 0 ? dirDx / dirMag : 1;
        const normDirY = dirMag > 0 ? dirDy / dirMag : 0;
        const tongueTipX = tongueStartX + normDirX * distance;
        const tongueTipY = tongueStartY + normDirY * distance;
        const flyHitboxSize = 18;
        const tongueTipHitboxSize = 10;
        let caughtFlyId = null;
        // let caughtMothId = null; // Removed moth catching logic
        if (current.flies) {
            for (const fly of current.flies) {
                const flyDx = fly.x - tongueTipX;
                const flyDy = fly.y - tongueTipY;
                const flyDistance = Math.sqrt(flyDx * flyDx + flyDy * flyDy);
                if (flyDistance < flyHitboxSize + tongueTipHitboxSize) {
                    caughtFlyId = fly.id;
                    break;
                }
            }
        }
        // Removed moth collision check
        // if (caughtFlyId === null && current.moths && current.onMothCaught) {
        //     const mothHitboxSize = 16;
        //     for (const moth of current.moths) {
        //         const mothDx = moth.x - tongueTipX;
        //         const mothDy = moth.y - tongueTipY;
        //         const mothDistance = Math.sqrt(mothDx * mothDx + mothDy * mothDy);
        //         if (mothDistance < mothHitboxSize + tongueTipHitboxSize) {
        //             caughtMothId = moth.id;
        //             break;
        //         }
        //     }
        // }
        if (caughtFlyId !== null) current.onFlyCaught(caughtFlyId);
        // else if (caughtMothId !== null) current.onMothCaught(caughtMothId); // Removed
        current.setTongueState('retracting');
      }, extensionDuration);
    },
    // Define handleMouseUp logic here
    handleMouseUp: (e) => {
      const current = frogLogicRef.current;
      if (current.tongueState === 'charging') {
        const chargeDuration = Date.now() - current.chargeStartTime;
        const chargeRatio = Math.min(chargeDuration / chargeTimeForMaxDistance, 1);
        const launchDistance = chargeRatio * maxTongueDistance;
        
        const mouthOffsetX = 8; 
        const mouthOffsetY = 2; 
        const tongueStartX = current.x + mouthOffsetX;
        const tongueStartY = current.y + mouthOffsetY;
        let targetX = 0;
        let targetY = 0;
        let actualLaunchDistance = 0;
        let closestTarget = null;
        let minSqDistToClosestTarget = launchDistance * launchDistance;
        if (current.flies && current.flies.length > 0) {
            for (const fly of current.flies) {
                const dxFly = fly.x - tongueStartX;
                const dyFly = fly.y - tongueStartY;
                const distSq = dxFly * dxFly + dyFly * dyFly;
                if (distSq < minSqDistToClosestTarget) {
                    minSqDistToClosestTarget = distSq;
                    closestTarget = fly;
                }
            }
        }
        // Removed moth targeting logic
        // if (current.moths && current.moths.length > 0) {
        //     for (const moth of current.moths) {
        //         const dxMoth = moth.x - tongueStartX;
        //         const dyMoth = moth.y - tongueStartY;
        //         const distSq = dxMoth * dxMoth + dyMoth * dyMoth;
        //         if (distSq < minSqDistToClosestTarget) {
        //             minSqDistToClosestTarget = distSq;
        //             closestTarget = moth;
        //         }
        //     }
        // }
        if (closestTarget) {
            targetX = closestTarget.x;
            targetY = closestTarget.y;
            actualLaunchDistance = Math.sqrt(minSqDistToClosestTarget);
        } else {
            const mouseGameX = e.clientX - current.gameOffset.left;
            const mouseGameY = e.clientY - current.gameOffset.top;
            const dxMouse = mouseGameX - tongueStartX;
            const dyMouse = mouseGameY - tongueStartY;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distMouse <= launchDistance) {
                targetX = mouseGameX;
                targetY = mouseGameY;
                actualLaunchDistance = distMouse;
            } else {
                const ratio = launchDistance / distMouse;
                targetX = tongueStartX + dxMouse * ratio;
                targetY = tongueStartY + dyMouse * ratio;
                actualLaunchDistance = launchDistance;
            }
        }
        current.launchTongue(actualLaunchDistance, targetX, targetY);
        current.setChargeStartTime(null);
      } else {
        current.setChargeStartTime(null);
      }
    }
  };
  // This effect updates the ref on every render with the latest functions/state
}, [tongueState, frogState, chargeStartTime, gameOffset, flies, x, y, rotation, onFlyCaught, setTongueState, setTongueTarget, setTongueDistance, setCurrentTongueLength, setTongueTip, setChargeStartTime]);
  // Make jump trigger available globally (keep this)
  useEffect(() => {
    // Add a function to trigger jump animation
    window.triggerFrogJump = (targetX, targetY) => {
      // Calculate direction of jump to set rotation - REMOVED
      // const dx = targetX - x;
      // const dy = targetY - y;
      // const angle = Math.atan2(dy, dx);
      // Reduce rotation by applying a factor to make it more subtle - REMOVED
      // setRotation(angle * (180 / Math.PI) * 0.5); // Rotation is now disabled
      
      // Start jump animation immediately
      setFrogState('jumping');
      // setCurrentImage calls and their timers are removed from here.
      // The main useEffect hook reacting to x, y changes will now solely manage the image sequence.
    };
    
    return () => {
      // delete window.frogExtendTongue; // Remove the old global function
      delete window.triggerFrogJump;
    };
  }, []); // setFrogState is stable, so empty dependencies are fine.
  
  // Calculate tongue dimensions based on launch target and distance
  const calculateTongueStyle = () => {
    // Render tongue if extending or retracting, using currentTongueLength
    if ((tongueState !== 'extending' && tongueState !== 'retracting') || currentTongueLength <= 0) return null;
    
    // Define the mouth position offset relative to the frog's center (x,y)
    // These values are estimations based on the frog asset's visual center
    // Adjusted offsets to better center on the visual mouth
    const mouthOffsetX = 0; // Slightly more to the right
    const mouthOffsetY = -6; // Slightly above the visual center y-axis
    
    // Calculate the actual starting point of the tongue in game coordinates
    const tongueStartX = x + mouthOffsetX;
    const tongueStartY = y + mouthOffsetY;
    
    // Calculate vector from the *mouth* to the target
    const dx = tongueTarget.x - tongueStartX;
    const dy = tongueTarget.y - tongueStartY;
    const targetDist = Math.sqrt(dx*dx + dy*dy);
    
    // Calculate angle from the *mouth*
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Use currentTongueLength for the visual width
    const currentWidth = currentTongueLength; 
        
    return {
      // Position the tongue div itself relative to the frog container
      // Frog container is 100x100, center is 50,50
      left: `calc(50% + ${mouthOffsetX}px)`, // Start at mouth X offset from center
      // Adjust top calculation to center the tongue vertically on the mouth offset
      top: `calc(50% + ${mouthOffsetY}px - ${tongueHeight / 2}px)`, 
      
      width: currentWidth,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'left center', // Rotate around the starting point (mouth)
    };
  };
  
  const tongueStyle = calculateTongueStyle();
  
  // Effect for handling tongue retraction animation
  useEffect(() => {
    let animationFrameId;
    let retractStartTime;
    
    const animateRetraction = (timestamp) => {
      if (!retractStartTime) retractStartTime = timestamp;
      const elapsed = timestamp - retractStartTime;
      
      if (tongueState === 'retracting') {
        const remainingRatio = Math.max(0, 1 - elapsed / tongueRetractionTime);
        setCurrentTongueLength(tongueDistance * remainingRatio); // Decrease length based on original distance
        
        if (remainingRatio > 0) {
          animationFrameId = requestAnimationFrame(animateRetraction);
        } else {
          // Animation finished
          setTongueState('idle');
          setCurrentTongueLength(0);
          setTongueDistance(0); // Reset target distance as well
          // Return frog to idle image only if not jumping
          if (frogState === 'idle') { 
             setCurrentImage(1);
          }
        }
      } else {
          // If state changed mid-animation, ensure cleanup
          setCurrentTongueLength(0); 
          setTongueDistance(0);
      }
    };
    
    if (tongueState === 'retracting') {
      animationFrameId = requestAnimationFrame(animateRetraction);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
    
  }, [tongueState, tongueDistance, frogState, tongueRetractionTime]); // Added dependencies
  
  // Handle mouse down on frog: start charging
  const handleMouseDown = (e) => {
     // Prevent default drag behavior
     e.preventDefault();
     // If frog is sleeping, do not initiate charge. Wake-up is handled by handleClick.
     if (isSleeping) {
       return;
     }
     // Only charge if idle, not jumping, and not sleeping
     if (tongueState === 'idle' && frogState === 'idle' && !isSleeping) {
       setTongueState('charging');
       setChargeStartTime(Date.now());
       // Maybe add a visual cue for charging later
     }
  };
  // General click handler for the frog
  const handleClick = (e) => {
    // If the frog is sleeping and a wake-up handler exists, call it.
    if (isSleeping && typeof onWakeUp === 'function') {
      onWakeUp();
    }
    // MouseDown handles tongue charging, so this primarily for waking up.
  };
  // Effect to add/remove the stable mouseup listener
  useEffect(() => {
    const eventListener = (e) => {
      if (frogLogicRef.current && frogLogicRef.current.handleMouseUp) {
        frogLogicRef.current.handleMouseUp(e);
      }
    };
    window.addEventListener('mouseup', eventListener);
    return () => {
      window.removeEventListener('mouseup', eventListener);
    };
  }, []); // Empty dependency array ensures this runs only on mount/unmount
  // Effect to update charge level visual
  useEffect(() => {
    let animationFrameId;
    let lastTimestamp; // To track time between frames
    const chargeRate = 1.0 / chargeTimeForMaxDistance; // Charge level increase per millisecond
    
    const updateCharge = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp; // Initialize timestamp on first frame
      const deltaTime = timestamp - lastTimestamp; // Time elapsed since last frame
      lastTimestamp = timestamp; // Update last timestamp
      
      if (tongueState === 'charging' && chargeStartTime) {
        // Increment charge level based on deltaTime, ensuring it doesn't exceed 1
        setChargeLevel(prevLevel => Math.min(prevLevel + chargeRate * deltaTime, 1));
        
        // Continue animation if still charging
        animationFrameId = requestAnimationFrame(updateCharge); 
      } else {
        // If not charging, reset the level (redundant, but safe)
        setChargeLevel(0); 
      }
    };
    
    if (tongueState === 'charging') {
      // Reset level and timestamp when charging begins
      setChargeLevel(0); 
      lastTimestamp = null; 
      animationFrameId = requestAnimationFrame(updateCharge);
    } else {
      // Ensure reset if state changes abruptly or is not 'charging'
      setChargeLevel(0); 
    }
    
    
    return () => {
      // Cleanup: cancel animation frame when component unmounts or dependencies change
      cancelAnimationFrame(animationFrameId); 
    };
    
    // Dependencies: run this effect when charging starts/stops or the max time changes
  }, [tongueState, chargeStartTime, chargeTimeForMaxDistance]);
  // Effect to stop internal bounce if trampoline becomes inactive
  useEffect(() => {
    if (!isTrampolineActive) {
      setInternalBounceActive(false);
      setVerticalBounceOffset(0);
    }
  }, [isTrampolineActive]);
// Effect for the continuous bounce animation on the trampoline
const BOUNCE_VISUAL_OFFSET = 150; // How many pixels the frog visually moves up
const BOUNCE_ANIM_HALF_DURATION = 500; // ms for one direction (up or down), matches 'all 0.5s ease'
useEffect(() => {
    let bounceTimer;
    if (internalBounceActive && isTrampolineActive && frogState === 'idle' && !isSleeping) {
      if (verticalBounceOffset === 0) { // Frog is at the bottom of the bounce, going up
        bounceTimer = setTimeout(() => {
          setVerticalBounceOffset(-BOUNCE_VISUAL_OFFSET);
          setCurrentImage(3); // Extended image for going up
        }, BOUNCE_ANIM_HALF_DURATION / 2); // Slight pause at bottom
      } else { // Frog is at the top of the bounce, going down
        bounceTimer = setTimeout(() => {
          setVerticalBounceOffset(0);
          setCurrentImage(2); // Tucked image for going down
        }, BOUNCE_ANIM_HALF_DURATION);
      }
    } else if (!internalBounceActive) {
      // If bounce is not active, ensure offset is zero.
      // Image handling should be covered by other effects (jump completion, idle state).
      setVerticalBounceOffset(0);
      if (frogState === 'idle' && tongueState === 'idle' && !isSleeping) {
          setCurrentImage(1); // Ensure idle image if truly idle
      }
    }
    return () => clearTimeout(bounceTimer);
  }, [internalBounceActive, verticalBounceOffset, isTrampolineActive, frogState, tongueState, isSleeping]);
  return (
    <div
      ref={frogRef} // Attach ref
      className="frog-container"
      onMouseDown={handleMouseDown} // Use onMouseDown for charging
      onClick={handleClick}      // Use onClick for waking up
      style={{
        position: 'absolute',
        left: x - 50,
        top: y - 50 + verticalBounceOffset, // Apply vertical bounce offset
        width: 100,
        height: 100,
        zIndex: 20,
        transform: `rotate(${rotation}deg)`,
        // Apply jump transition for movement, otherwise smooth transition for rotation/other changes
        // The 'all 0.2s ease' will also apply to 'top' for the bounce animation
transition: frogState === 'jumping'
          ? 'left 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67), top 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67), transform 0.2s ease'
          : 'all 0.5s ease', // Adjusted to match new BOUNCE_ANIM_HALF_DURATION
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
      
      {/* Tongue (visible only when extending/retracting) */}
      {(tongueState === 'extending' || tongueState === 'retracting') && tongueStyle && (
        <div className="frog-tongue" style={{
          position: 'absolute',
          // Use the calculated left/top from tongueStyle
          left: tongueStyle.left, 
          top: tongueStyle.top, 
          height: tongueHeight, // Use the constant
          backgroundColor: '#e76f51', // Brighter tongue color
          zIndex: 22, // Higher z-index to appear over the frog
          width: tongueStyle.width,
          transform: tongueStyle.transform,
          transformOrigin: tongueStyle.transformOrigin,
          // Add transition for smooth width changes (for retraction)
          transition: tongueState === 'retracting' ? `width ${tongueRetractionTime}ms linear` : 'none',
        }}>
          <img 
            src={`https://play.rosebud.ai/assets/GreenTongue${tongueTip}.png?${tongueTip === 1 ? 'DPLH' : 'xFG2'}`}
            alt="Tongue Tip"
            style={{
              position: 'absolute',
              right: -6, // Adjusted tip position to match new central origin
              top: -4,    // Adjusted vertical tip position
              width: 25,  // Tip image size
              height: 18, // Tip image size
            }}
          />
        </div>
      )}
      {/* Conditionally render the hat based on equipped status */}
      {ownedItems?.hat_placeholder === 'equipped' && (() => {
        const baseStyle = { position: 'absolute', height: 'auto', zIndex: 21, pointerEvents: 'none' };
        const colorSpecificStyles = {
          green: { top: '7px', left: '27px', width: '35px', transform: 'rotate(-5deg)' },
          red:   { top: '7px', left: '27px', width: '35px', transform: 'rotate(-5deg)' },
          yellow:{ top: '5px', left: '25px', width: '35px', transform: 'rotate(-5deg)' }
        };
        const finalStyle = { ...baseStyle, ...(colorSpecificStyles[validColor] || colorSpecificStyles.green) };
        return (
          <img
            src="https://play.rosebud.ai/assets/8 bit hat.png?oXIp"
            alt="Hat"
            style={finalStyle}
          />
        );
      })()}
      {/* Conditionally render the Cowboy Hat */}
      {ownedItems?.hat_cowboy === 'equipped' && (() => {
        const baseStyle = { position: 'absolute', height: 'auto', zIndex: 21, pointerEvents: 'none' };
        const colorSpecificStyles = {
          green: { top: '5px', left: '5px', width: '90px', transform: 'rotate(-4deg)' },
          red:   { top: '5px', left: '5px', width: '90px', transform: 'rotate(-4deg)' },
          yellow:{ top: '5px', left: '5px', width: '90px', transform: 'rotate(-4deg)' }
        };
        const finalStyle = { ...baseStyle, ...(colorSpecificStyles[validColor] || colorSpecificStyles.green) };
        return (
          <img
            src="https://play.rosebud.ai/assets/CowboyHat.PNG?jWEr"
            alt="Cowboy Hat"
            style={finalStyle}
          />
        );
      })()}
      {/* Conditionally render the LA Hat */}
      {ownedItems?.hat_la === 'equipped' && (() => {
        const baseStyle = { position: 'absolute', height: 'auto', zIndex: 21, pointerEvents: 'none' };
        const colorSpecificStyles = {
          green: { top: '10px', left: '10px', width: '80px', transform: 'rotate(-5deg)' },
          red:   { top: '10px', left: '10px', width: '80px', transform: 'rotate(-5deg)' },
          yellow:{ top: '8px', left: '8px', width: '80px', transform: 'rotate(-5deg)' }
        };
        const finalStyle = { ...baseStyle, ...(colorSpecificStyles[validColor] || colorSpecificStyles.green) };
        return (
          <img
            src="https://play.rosebud.ai/assets/LA hat.PNG?mzqj"
            alt="LA Hat"
            style={finalStyle}
          />
        );
      })()}
      {/* Conditionally render the Strawberry Hat */}
      {ownedItems?.hat_strawberry === 'equipped' && (() => {
        const baseStyle = { position: 'absolute', height: 'auto', zIndex: 21, pointerEvents: 'none' };
        const colorSpecificStyles = {
          green: { top: '4px', left: '-1px', width: '90px', transform: 'rotate(-2deg) scaleX(-1)' },
          red:   { top: '4px', left: '-1px', width: '90px', transform: 'rotate(-2deg) scaleX(-1)' },
          yellow:{ top: '2px', left: '-3px', width: '90px', transform: 'rotate(-2deg) scaleX(-1)' }
        };
        const finalStyle = { ...baseStyle, ...(colorSpecificStyles[validColor] || colorSpecificStyles.green) };
        return (
          <img
            src="https://play.rosebud.ai/assets/Strawberry hat.PNG?pdTd"
            alt="Strawberry Hat"
            style={finalStyle}
          />
        );
      })()}
      {/* Conditionally render the Chef Hat */}
      {ownedItems?.hat_chef === 'equipped' && (() => {
        const baseStyle = { position: 'absolute', height: 'auto', zIndex: 21, pointerEvents: 'none' };
        const colorSpecificStyles = {
          green: { top: '3px', left: '6px', width: '90px', transform: 'rotate(-2deg)' },
          red:   { top: '3px', left: '6px', width: '90px', transform: 'rotate(-2deg)' },
          yellow:{ top: '1px', left: '4px', width: '90px', transform: 'rotate(-2deg)' }
        };
        const finalStyle = { ...baseStyle, ...(colorSpecificStyles[validColor] || colorSpecificStyles.green) };
        return (
          <img
            src="https://play.rosebud.ai/assets/Chef hat.PNG?fGDe"
            alt="Chef Hat"
            style={finalStyle}
          />
        );
      })()}
      {/* Conditionally render the Crown Hat */}
      {ownedItems?.hat_crown === 'equipped' && (() => {
        const baseStyle = { position: 'absolute', height: 'auto', zIndex: 21, pointerEvents: 'none' };
        const colorSpecificStyles = {
          green: { top: '3px', left: '5px', width: '90px', transform: 'rotate(-2deg)' },
          red:   { top: '3px', left: '5px', width: '90px', transform: 'rotate(-2deg)' },
          yellow:{ top: '1px', left: '3px', width: '90px', transform: 'rotate(-2deg)' }
        };
        const finalStyle = { ...baseStyle, ...(colorSpecificStyles[validColor] || colorSpecificStyles.green) };
        return (
          <img
            src="https://play.rosebud.ai/assets/CrownHat.PNG?9Z7Q"
            alt="Crown Hat"
            style={finalStyle}
          />
        );
      })()}
      {/* Conditionally render the Magic Hat */}
      {ownedItems?.hat_magic === 'equipped' && (() => {
        const baseStyle = { position: 'absolute', height: 'auto', zIndex: 21, pointerEvents: 'none' };
        // Define specific styles for the Magic Hat for each frog color
        const colorSpecificStyles = {
          green: { top: '3px', left: '5px', width: '90px', transform: 'rotate(-3deg)' },
          red:   { top: '3px', left: '5px', width: '90px', transform: 'rotate(-3deg)' },
          yellow:{ top: '3px', left: '5px', width: '90px', transform: 'rotate(-3deg)' } 
        };
        const finalStyle = { ...baseStyle, ...(colorSpecificStyles[validColor] || colorSpecificStyles.green) };
        return (
          <img
            src="https://play.rosebud.ai/assets/MagicHat.PNG?fJX9"
            alt="Magic Hat"
            style={finalStyle}
          />
        );
      })()}
    {/* Charge Indicator Bar - Do not show if sleeping */}
      {tongueState === 'charging' && !isSleeping && (
          <div className="charge-bar-container" style={{
              position: 'absolute',
              bottom: '105%', // Position above the frog
              left: '10%', // Center the bar relative to the frog
              width: '80%',
              height: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
              zIndex: 25,
          }}>
              <div className="charge-bar-fill" style={{
                  width: `${chargeLevel * 100}%`,
                  height: '100%',
                  backgroundColor: `hsl(${(1 - chargeLevel) * 120}, 70%, 50%)`, // Green to Red gradient
                  borderRadius: '4px',
                  // Remove explicit transition, as updates are now frame-based
                  // transition: 'width 0.05s linear, background-color 0.05s linear', 
              }}></div>
          </div>
      )}
    </div>
  );
};