import React from 'react';

export const ResetConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  // Reusing styles similar to other modals for consistency
  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, // Ensure it's above the main menu
  };
  const contentStyle = {
    backgroundColor: '#D2B48C', padding: '25px 35px', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)', minWidth: '300px', maxWidth: '80%', textAlign: 'center', position: 'relative', fontFamily: "'Arial', sans-serif",
  };
   const titleStyle = {
    fontWeight: '600', fontSize: '1.3rem', marginBottom: '15px', color: '#d32f2f', // Warning red color
  };
   const messageStyle = {
    marginBottom: '30px', color: '#555', fontSize: '1rem', lineHeight: '1.5',
  };
  const buttonContainerStyle = {
    display: 'flex', justifyContent: 'center', gap: '20px',
  };
  const buttonBaseStyle = {
    cursor: 'pointer', padding: '10px 25px', border: 'none', borderRadius: '6px', fontFamily: "'Arial', sans-serif", fontSize: '1rem', transition: 'background-color 0.2s ease, transform 0.1s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
   const confirmButtonStyle = {
    ...buttonBaseStyle, backgroundColor: '#f44336', color: 'white',
  };
   const cancelButtonStyle = {
    ...buttonBaseStyle, backgroundColor: '#eee', color: '#333',
  };

  return (
    <div style={modalStyle} onClick={onClose}> {/* Close on overlay click */}
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
        <div style={titleStyle}>Reset Game?</div>
        <p style={messageStyle}>
          Are you sure you want to reset all your progress? This action cannot be undone. Your score and all purchased items will be lost.
        </p>
        <div style={buttonContainerStyle}>
          <button
            style={cancelButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ddd'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#eee'}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            No, Cancel
          </button>
          <button
            style={confirmButtonStyle}
            onClick={onConfirm}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e53935'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  );
};