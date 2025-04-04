import React from 'react';

export const PondBackground = () => {
  return (
    <div className="pond-background" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'url(https://play.rosebud.ai/assets/frogBack_compressed.png?UOPc)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 0,
      opacity: 0.8,
    }}>
      {/* Additional water ripple effects could be added here */}
    </div>
  );
};

export default PondBackground;