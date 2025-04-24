import React, { useState, useEffect } from 'react';

export const Notification = ({ message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '20px',
      fontSize: '16px',
      zIndex: 1000,
      animation: 'fadeInOut 3s ease-in-out',
    }}>
      {message}
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};