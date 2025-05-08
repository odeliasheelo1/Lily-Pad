import React from 'react';
// Removed level prop
export const PondBackground = ({ width = '100%', height = '100%' }) => { 
  // Simplified: always use the default background
  const backgroundImage = 'https://play.rosebud.ai/assets/frogBack_compressed.png?UOPc';
  return (
    <div className="pond-background" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: width, // Use passed width
      height: height, // Use passed height
      backgroundImage: `url(${backgroundImage})`,
      // 'contain' might be better for fixed aspect ratio, 'cover' will crop
      backgroundSize: '200%', // Increased size to 200%
      backgroundPosition: 'center 70%', // Shift background down
      zIndex: 0,
      opacity: 0.9, // Slightly less opaque
      borderRadius: 'inherit' // Inherit border radius from parent
    }}>
      {/* Water ripple effect using pseudo-element */}
      <style>
        {`
          .pond-background::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(ellipse at center, 
              /* Removed conditional gradient based on level */
              rgba(0,150,255,0.1) 0%, 
              rgba(0,100,200,0.2) 40%, 
              rgba(0,50,150,0.3) 100%
            );
            opacity: 0.5;
            mix-blend-mode: overlay;
            animation: ripple 15s infinite linear;
          }
          @keyframes ripple {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};