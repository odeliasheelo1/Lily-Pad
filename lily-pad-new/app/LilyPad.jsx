import React from 'react';
export const LilyPad = ({ x, y, size, isActive, onClick }) => {
  return (
    <div 
      className="lily-pad"
      onClick={onClick}
      style={{
        position: 'absolute',
        left: x - size/2,
        top: y - size/2,
        width: size,
        height: size,
        cursor: isActive ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 10,
        filter: isActive 
          ? 'brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))' 
          : 'brightness(1) drop-shadow(0 0 3px rgba(0, 0, 0, 0.2))',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <img 
        src="https://play.rosebud.ai/assets/lily-pad.png?lsH8"
        alt="Lily Pad"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default LilyPad;