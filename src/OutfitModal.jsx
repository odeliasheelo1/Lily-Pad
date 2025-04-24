import React, { useState, useEffect } from 'react';
// Accept ownedColors and ownedItems props, and onSelectHat handler
export const OutfitModal = ({ isOpen, onClose, onSelectColor, ownedColors = {}, ownedItems = {}, onSelectHat }) => {
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem('frogColor') || 'green';
  });
  // Load saved color preference on modal open (in case it changed elsewhere)
  useEffect(() => {
    if (isOpen) {
      setSelectedColor(localStorage.getItem('frogColor') || 'green');
    }
  }, [isOpen]);
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    localStorage.setItem('frogColor', color);
    onSelectColor(color); // Call the color selection handler passed from parent
    // Don't close modal immediately if selecting color, allow hat selection too
    // onClose(); 
  };
  const handleHatSelect = (hatId) => {
    onSelectHat(hatId); // Call the hat selection handler passed from parent
    onClose(); // Close modal after selecting a hat option
  };
  // Determine which hat is currently equipped
  const equippedHat = Object.keys(ownedItems).find(key => key.startsWith('hat_') && ownedItems[key] === 'equipped');
  const isNoHatSelected = !equippedHat;
  const isBasicHatSelected = equippedHat === 'hat_placeholder';
  const isCowboyHatSelected = equippedHat === 'hat_cowboy';
  if (!isOpen) return null;
  return (
    // Modal Overlay
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000, // Ensure it's above other elements
    }}>
      {/* Modal Content */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px 40px',
        borderRadius: '8px', // Match main menu panel
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)', // Slightly stronger shadow for modal
        minWidth: '300px', // Wider modal
        position: 'relative',
        fontFamily: "'Arial', sans-serif", // Consistent font
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '15px', // Adjust position
          right: '15px',
          background: 'none',
          border: 'none',
          fontSize: '1.8rem', // Slightly larger close button
          cursor: 'pointer',
          color: '#aaa', // Even lighter color
          lineHeight: 1,
          padding: '0', // Remove padding for cleaner look
          transition: 'color 0.2s ease', // Smooth color transition
        }}
         onMouseEnter={(e) => e.target.style.color = '#555'} // Darker on hover
         onMouseLeave={(e) => e.target.style.color = '#aaa'}
        >
          &times; {/* Unicode 'X' */}
        </button>
        {/* Actual Color Selection UI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}> {/* Reduced gap */}
          <div className="color-option-title" style={{
            textAlign: 'center',
            fontWeight: '600', // Slightly less bold
            fontSize: '1.2rem', // Larger title
            marginBottom: 20, // Increased margin
            color: '#333' // Darker text color
          }}>
            Choose Frog Color
          </div>
          
          {/* Green option */}
          <div
            className={`color-option ${selectedColor === 'green' ? 'selected' : ''}`}
            // Always allow selecting green
            onClick={() => handleColorSelect('green')} 
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 15, // Increased gap
              padding: '12px 18px', // Adjusted padding
              borderRadius: 6, // Match other elements
              backgroundColor: selectedColor === 'green' ? 'rgba(76, 175, 80, 0.15)' : 'transparent', // More subtle background
              border: selectedColor === 'green' ? '2px solid #4CAF50' : '2px solid #eee', // Use light grey border when not selected
              transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s ease', // Smooth transition + transform
            }}
             onMouseEnter={(e) => {
                 if (selectedColor !== 'green') {
                     e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
                     e.currentTarget.style.borderColor = '#ccc'; // Darker border on hover
                 }
             }}
             onMouseLeave={(e) => {
                 if (selectedColor !== 'green') {
                     e.currentTarget.style.backgroundColor = 'transparent';
                     e.currentTarget.style.borderColor = '#eee'; // Reset border
                 }
             }}
             onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} // Press effect
             onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src="https://play.rosebud.ai/assets/Frog1.png?kssR"
              alt="Green Frog"
              style={{ width: 45, height: 45 }} // Slightly smaller image
            />
            <span style={{ color: '#333', fontWeight: '500' }}>Green</span> {/* Darker text */}
          </div>
          {/* Red option */}
          <div
            className={`color-option ${selectedColor === 'red' ? 'selected' : ''}`}
            // Only allow selecting if owned
            onClick={() => ownedColors.color_red && handleColorSelect('red')}
            style={{
              cursor: ownedColors.color_red ? 'pointer' : 'not-allowed', // Change cursor if not owned
              opacity: ownedColors.color_red ? 1 : 0.5, // Dim if not owned
              display: 'flex',
              alignItems: 'center',
              gap: 15,
              padding: '12px 18px',
              borderRadius: 6,
              backgroundColor: selectedColor === 'red' ? 'rgba(244, 67, 54, 0.15)' : 'transparent',
              border: selectedColor === 'red' ? '2px solid #F44336' : '2px solid #eee',
              transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s ease',
            }}
             onMouseEnter={(e) => {
                 if (selectedColor !== 'red') {
                     e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
                     e.currentTarget.style.borderColor = '#ccc';
                 }
             }}
             onMouseLeave={(e) => {
                 if (selectedColor !== 'red') {
                     e.currentTarget.style.backgroundColor = 'transparent';
                     e.currentTarget.style.borderColor = '#eee';
                 }
             }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src="https://play.rosebud.ai/assets/Red Frog 1.PNG?9ocr"
              alt="Red Frog"
              style={{ width: 45, height: 45 }}
            />
            <span style={{ color: '#333', fontWeight: '500' }}>Red</span>
          </div>
          {/* Yellow option */}
          <div
            className={`color-option ${selectedColor === 'yellow' ? 'selected' : ''}`}
            // Only allow selecting if owned
            onClick={() => ownedColors.color_yellow && handleColorSelect('yellow')}
            style={{
              cursor: ownedColors.color_yellow ? 'pointer' : 'not-allowed', // Change cursor if not owned
              opacity: ownedColors.color_yellow ? 1 : 0.5, // Dim if not owned
              display: 'flex',
              alignItems: 'center',
              gap: 15,
              padding: '12px 18px',
              borderRadius: 6,
              backgroundColor: selectedColor === 'yellow' ? 'rgba(255, 193, 7, 0.15)' : 'transparent',
              border: selectedColor === 'yellow' ? '2px solid #FFC107' : '2px solid #eee',
              transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s ease',
            }}
             onMouseEnter={(e) => {
                 if (selectedColor !== 'yellow') {
                     e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
                     e.currentTarget.style.borderColor = '#ccc';
                 }
             }}
             onMouseLeave={(e) => {
                 if (selectedColor !== 'yellow') {
                     e.currentTarget.style.backgroundColor = 'transparent';
                     e.currentTarget.style.borderColor = '#eee';
                 }
             }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src="https://play.rosebud.ai/assets/Yellow Frog 1.png?OXP4"
              alt="Yellow Frog"
              style={{ width: 45, height: 45 }}
            />
            <span style={{ color: '#333', fontWeight: '500' }}>Yellow</span>
          </div>
          {/* Hat Selection Section */}
          <div className="hat-options" style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
             <div className="hat-option-title" style={{
                textAlign: 'center', fontWeight: '600', fontSize: '1.2rem', marginBottom: 20, color: '#333'
             }}>Choose Hat</div>
            {/* Hat options using calculated variables */}
            {/* No Hat option */}
            <div
                className={`hat-option ${isNoHatSelected ? 'selected' : ''}`}
                onClick={() => handleHatSelect(null)} // Pass null for no hat
                style={{
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 15, padding: '12px 18px', borderRadius: 6,
                    backgroundColor: isNoHatSelected ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                    border: isNoHatSelected ? '2px solid #ccc' : '2px solid #eee',
                    transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s ease',
                }}
                // Add hover/press effects similar to color options
                 onMouseEnter={(e) => { if (!isNoHatSelected) { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'; e.currentTarget.style.borderColor = '#ccc'; } }}
                 onMouseLeave={(e) => { if (!isNoHatSelected) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#eee'; } }}
                 onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                 onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
               {/* Placeholder icon for 'no hat' */}
               <div style={{ width: 45, height: 45, border: '1px dashed #ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>🚫</div>
               <span style={{ color: '#333', fontWeight: '500' }}>No Hat</span>
            </div>
            {/* Basic Hat option */}
            <div
               className={`hat-option ${isBasicHatSelected ? 'selected' : ''}`}
               onClick={() => ownedItems?.hat_placeholder && handleHatSelect('hat_placeholder')} // Only allow select if owned
               style={{
                   cursor: ownedItems?.hat_placeholder ? 'pointer' : 'not-allowed',
                   opacity: ownedItems?.hat_placeholder ? 1 : 0.5,
                   display: 'flex', alignItems: 'center', gap: 15, padding: '12px 18px', borderRadius: 6, marginTop: '10px',
                   backgroundColor: isBasicHatSelected ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                   border: isBasicHatSelected ? '2px solid #ccc' : '2px solid #eee',
                   transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s ease',
               }}
               // Add hover/press effects similar to color options
                 onMouseEnter={(e) => { if (ownedItems?.hat_placeholder && !isBasicHatSelected) { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'; e.currentTarget.style.borderColor = '#ccc'; } }}
                 onMouseLeave={(e) => { if (ownedItems?.hat_placeholder && !isBasicHatSelected) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#eee'; } }}
                 onMouseDown={(e) => ownedItems?.hat_placeholder && (e.currentTarget.style.transform = 'scale(0.98)')}
                 onMouseUp={(e) => ownedItems?.hat_placeholder && (e.currentTarget.style.transform = 'scale(1)')}
             >
                <img
                   src="https://play.rosebud.ai/assets/8 bit hat.png?oXIp" // Use the actual 8-bit hat image
                   alt="Basic Hat"
                   style={{ width: 45, height: 45, objectFit: 'contain' }}
                />
                <span style={{ color: '#333', fontWeight: '500' }}>Basic Hat {ownedItems?.hat_placeholder ? '' : '(Locked)'}</span>
            </div>
            {/* Cowboy Hat option */}
            <div
               className={`hat-option ${isCowboyHatSelected ? 'selected' : ''}`}
               onClick={() => ownedItems?.hat_cowboy && handleHatSelect('hat_cowboy')} // Only allow select if owned
               style={{
                   cursor: ownedItems?.hat_cowboy ? 'pointer' : 'not-allowed',
                   opacity: ownedItems?.hat_cowboy ? 1 : 0.5,
                   display: 'flex', alignItems: 'center', gap: 15, padding: '12px 18px', borderRadius: 6, marginTop: '10px',
                   backgroundColor: isCowboyHatSelected ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                   border: isCowboyHatSelected ? '2px solid #ccc' : '2px solid #eee',
                   transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s ease',
               }}
                 onMouseEnter={(e) => { if (ownedItems?.hat_cowboy && !isCowboyHatSelected) { e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'; e.currentTarget.style.borderColor = '#ccc'; } }}
                 onMouseLeave={(e) => { if (ownedItems?.hat_cowboy && !isCowboyHatSelected) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#eee'; } }}
                 onMouseDown={(e) => ownedItems?.hat_cowboy && (e.currentTarget.style.transform = 'scale(0.98)')}
                 onMouseUp={(e) => ownedItems?.hat_cowboy && (e.currentTarget.style.transform = 'scale(1)')}
             >
                <img
                   src="https://play.rosebud.ai/assets/Cowboy Hat.png?KP7E" // Use the Cowboy Hat image
                   alt="Cowboy Hat"
                   style={{ width: 45, height: 45, objectFit: 'contain' }}
                />
                <span style={{ color: '#333', fontWeight: '500' }}>Cowboy Hat {ownedItems?.hat_cowboy ? '' : '(Locked)'}</span>
            </div>
          </div> {/* End hat-options */}
        </div> {/* End modal inner content */}
      </div> {/* End modal content div */}
    </div>
  );
};