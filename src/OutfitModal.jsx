import React, { useState, useEffect } from 'react';
// Accept ownedItems props (which includes colors), and onSelectHat handler
export const OutfitModal = ({ isOpen, onClose, onSelectColor, ownedItems = {}, onSelectHat }) => {
  // Magic Hat ownership reverted to original state from ownedItems prop
  // const ownedItems = { ...originalOwnedItems, hat_magic: 'owned' }; // This line is now removed/commented
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
  // const isBasicHatSelected = equippedHat === 'hat_placeholder'; // REMOVED
  const isCowboyHatSelected = equippedHat === 'hat_cowboy';
  const isStrawberryHatSelected = equippedHat === 'hat_strawberry';
  const isLAHatSelected = equippedHat === 'hat_la';
  const isChefHatSelected = equippedHat === 'hat_chef';
  const isCrownHatSelected = equippedHat === 'hat_crown';
  const isMagicHatSelected = equippedHat === 'hat_magic';
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
        backgroundColor: '#D2B48C', // Tan color consistent with StoreModal
        padding: '20px', // Standardized padding
        borderRadius: '12px', // Match StoreModal border radius
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)', // Match StoreModal shadow
        width: 'clamp(350px, 90vw, 600px)', // Match StoreModal width clamping
        maxHeight: '85vh', // Match StoreModal max height
        overflowY: 'auto', // Add scroll for overflow
        position: 'relative',
        fontFamily: "'Arial', sans-serif",
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
position: 'absolute',
          top: '10px', // Adjusted position
          right: '10px', // Adjusted position
          background: 'none',
          border: 'none',
          fontSize: '1.5rem', // Reduced close button size
          cursor: 'pointer',
          color: '#888', 
          lineHeight: 1,
          padding: '0', // Remove padding for cleaner look
          transition: 'color 0.2s ease', // Smooth color transition
        }}
         onMouseEnter={(e) => e.target.style.color = '#444'} // Darker on hover
         onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          &times; {/* Unicode 'X' */}
        </button>
        {/* Actual Color Selection UI */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}> {/* Increased main gap */}
          {/* Color Selection Section */}
          <div>
            <div style={{
              textAlign: 'center',
              fontWeight: 'bold', // Bolder title
              fontSize: '1.3rem', // Larger title font
              marginBottom: '15px', // Increased margin
              color: '#4a2e1a' // Darker brown, like store title
            }}>
              Choose Frog Color
            </div>
            {/* Grid container for color options */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', // Wider cards, responsive
              gap: '15px', // Increased gap
              justifyItems: 'stretch', // Stretch items to fill grid cells
            }}>
              {/* Green option */}
              <div
                className={`color-option ${selectedColor === 'green' ? 'selected' : ''}`}
                onClick={() => handleColorSelect('green')}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px', // Increased padding
                  borderRadius: '8px', // Consistent with store cards
                  backgroundColor: selectedColor === 'green' ? '#C19A6B' : '#F5F5DC', // Darker selected tan, light tan unselected
                  border: selectedColor === 'green' ? '2px solid #8B4513' : '1px solid #e0e0e0', // Sienna border for selected, light gray otherwise
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: selectedColor === 'green' ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  if (selectedColor !== 'green') e.currentTarget.style.backgroundColor = '#FAF0E6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = selectedColor === 'green' ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                  if (selectedColor !== 'green') e.currentTarget.style.backgroundColor = '#F5F5DC';
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} // Return to hover state
              >
                <img
                  src="https://play.rosebud.ai/assets/Frog1.png?kssR"
                  alt="Green Frog"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }} // Larger image
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Green</span> {/* Adjusted text style */}
              </div>
              {/* Red option */}
              <div
                className={`color-option ${selectedColor === 'red' ? 'selected' : ''}`}
                onClick={() => ownedItems.color_red && handleColorSelect('red')}
                style={{
                  cursor: ownedItems.color_red ? 'pointer' : 'not-allowed',
                  opacity: ownedItems.color_red ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: selectedColor === 'red' ? '#C19A6B' : '#F5F5DC',
                  border: selectedColor === 'red' ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: selectedColor === 'red' ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  if (ownedItems.color_red) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (selectedColor !== 'red') e.currentTarget.style.backgroundColor = '#FAF0E6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (ownedItems.color_red) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = selectedColor === 'red' ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (selectedColor !== 'red') e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems.color_red && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems.color_red && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/Red Frog 1.PNG?9ocr"
                  alt="Red Frog"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Red {ownedItems.color_red ? '' : '(Locked)'}</span>
              </div>
              {/* Yellow option */}
              <div
                className={`color-option ${selectedColor === 'yellow' ? 'selected' : ''}`}
                onClick={() => ownedItems.color_yellow && handleColorSelect('yellow')}
                style={{
                  cursor: ownedItems.color_yellow ? 'pointer' : 'not-allowed',
                  opacity: ownedItems.color_yellow ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: selectedColor === 'yellow' ? '#C19A6B' : '#F5F5DC',
                  border: selectedColor === 'yellow' ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: selectedColor === 'yellow' ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                 onMouseEnter={(e) => {
                  if (ownedItems.color_yellow) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (selectedColor !== 'yellow') e.currentTarget.style.backgroundColor = '#FAF0E6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (ownedItems.color_yellow) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = selectedColor === 'yellow' ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (selectedColor !== 'yellow') e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems.color_yellow && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems.color_yellow && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/Yellow Frog 1.png?OXP4"
                  alt="Yellow Frog"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Yellow {ownedItems.color_yellow ? '' : '(Locked)'}</span>
              </div>
            </div> {/* End grid container for color options */}
          </div>
          {/* Hat Selection Section */}
          <div>
            <div style={{
              textAlign: 'center',
              fontWeight: 'bold', // Bolder title
              fontSize: '1.3rem', // Larger title font
              marginBottom: '15px', // Increased margin
              color: '#4a2e1a', // Darker brown, like store title
              borderTop: '1px solid #c8b7a6', // Separator line
              paddingTop: '20px', // Space above title after separator
              marginTop: '20px', // Space below color options
            }}>
              Choose Hat
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', // Wider cards, responsive
              gap: '15px', // Increased gap
              justifyItems: 'stretch', // Stretch items to fill grid cells
            }}>
              {/* No Hat option */}
              <div
                className={`hat-option ${isNoHatSelected ? 'selected' : ''}`}
                onClick={() => handleHatSelect(null)} // Pass null for no hat
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isNoHatSelected ? '#C19A6B' : '#F5F5DC',
                  border: isNoHatSelected ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: isNoHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  if (!isNoHatSelected) e.currentTarget.style.backgroundColor = '#FAF0E6';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isNoHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                  if (!isNoHatSelected) e.currentTarget.style.backgroundColor = '#F5F5DC';
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              >
                <div style={{ width: 50, height: 50, border: '2px dashed #b0a090', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '24px', marginBottom: '8px' }}>🚫</div>
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>No Hat</span>
              </div>
              {/* Cowboy Hat option */}
              <div
                className={`hat-option ${isCowboyHatSelected ? 'selected' : ''}`}
                onClick={() => ownedItems?.hat_cowboy && handleHatSelect('hat_cowboy')}
                style={{
                  cursor: ownedItems?.hat_cowboy ? 'pointer' : 'not-allowed',
                  opacity: ownedItems?.hat_cowboy ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isCowboyHatSelected ? '#C19A6B' : '#F5F5DC',
                  border: isCowboyHatSelected ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: isCowboyHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                 onMouseEnter={(e) => { 
                   if(ownedItems?.hat_cowboy) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (!isCowboyHatSelected) e.currentTarget.style.backgroundColor = '#FAF0E6';
                   }
                }}
                onMouseLeave={(e) => { 
                  if(ownedItems?.hat_cowboy) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isCowboyHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (!isCowboyHatSelected) e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems?.hat_cowboy && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems?.hat_cowboy && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/CowboyHat.PNG?jWEr"
                  alt="Cowboy Hat"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Cowboy Hat {ownedItems?.hat_cowboy ? '' : '(Locked)'}</span>
              </div>
              {/* Strawberry Hat option */}
              <div
                className={`hat-option ${isStrawberryHatSelected ? 'selected' : ''}`}
                onClick={() => ownedItems?.hat_strawberry && handleHatSelect('hat_strawberry')}
                style={{
                  cursor: ownedItems?.hat_strawberry ? 'pointer' : 'not-allowed',
                  opacity: ownedItems?.hat_strawberry ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isStrawberryHatSelected ? '#C19A6B' : '#F5F5DC',
                  border: isStrawberryHatSelected ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: isStrawberryHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                 onMouseEnter={(e) => { 
                   if(ownedItems?.hat_strawberry) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (!isStrawberryHatSelected) e.currentTarget.style.backgroundColor = '#FAF0E6';
                   }
                }}
                onMouseLeave={(e) => { 
                  if(ownedItems?.hat_strawberry) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isStrawberryHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (!isStrawberryHatSelected) e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems?.hat_strawberry && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems?.hat_strawberry && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/Strawberry hat.PNG?pdTd"
                  alt="Strawberry Hat"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Strawberry Hat {ownedItems?.hat_strawberry ? '' : '(Locked)'}</span>
              </div>
              {/* LA Hat option */}
                <div
                className={`hat-option ${isLAHatSelected ? 'selected' : ''}`}
                onClick={() => ownedItems?.hat_la && handleHatSelect('hat_la')}
                style={{
                  cursor: ownedItems?.hat_la ? 'pointer' : 'not-allowed',
                  opacity: ownedItems?.hat_la ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isLAHatSelected ? '#C19A6B' : '#F5F5DC',
                  border: isLAHatSelected ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: isLAHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                 onMouseEnter={(e) => { 
                   if(ownedItems?.hat_la) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (!isLAHatSelected) e.currentTarget.style.backgroundColor = '#FAF0E6';
                   }
                }}
                onMouseLeave={(e) => { 
                  if(ownedItems?.hat_la) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isLAHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (!isLAHatSelected) e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems?.hat_la && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems?.hat_la && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/LA hat.PNG?mzqj"
                  alt="LA Hat"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>LA Hat {ownedItems?.hat_la ? '' : '(Locked)'}</span>
              </div>
              {/* Chef Hat option */}
              <div
                className={`hat-option ${isChefHatSelected ? 'selected' : ''}`}
                onClick={() => ownedItems?.hat_chef && handleHatSelect('hat_chef')}
                style={{
                  cursor: ownedItems?.hat_chef ? 'pointer' : 'not-allowed',
                  opacity: ownedItems?.hat_chef ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isChefHatSelected ? '#C19A6B' : '#F5F5DC',
                  border: isChefHatSelected ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: isChefHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                 onMouseEnter={(e) => { 
                   if(ownedItems?.hat_chef) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (!isChefHatSelected) e.currentTarget.style.backgroundColor = '#FAF0E6';
                   }
                }}
                onMouseLeave={(e) => { 
                  if(ownedItems?.hat_chef) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isChefHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (!isChefHatSelected) e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems?.hat_chef && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems?.hat_chef && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/Chef hat.PNG?fGDe"
                  alt="Chef Hat"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Chef Hat {ownedItems?.hat_chef ? '' : '(Locked)'}</span>
              </div>
               {/* Crown Hat option */}
              <div
                className={`hat-option ${isCrownHatSelected ? 'selected' : ''}`}
                onClick={() => ownedItems?.hat_crown && handleHatSelect('hat_crown')}
                style={{
                  cursor: ownedItems?.hat_crown ? 'pointer' : 'not-allowed',
                  opacity: ownedItems?.hat_crown ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isCrownHatSelected ? '#C19A6B' : '#F5F5DC',
                  border: isCrownHatSelected ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: isCrownHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                 onMouseEnter={(e) => { 
                   if(ownedItems?.hat_crown) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (!isCrownHatSelected) e.currentTarget.style.backgroundColor = '#FAF0E6';
                   }
                }}
                onMouseLeave={(e) => { 
                  if(ownedItems?.hat_crown) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isCrownHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (!isCrownHatSelected) e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems?.hat_crown && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems?.hat_crown && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/CrownHat.PNG?9Z7Q"
                  alt="Crown Hat"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Crown Hat {ownedItems?.hat_crown ? '' : '(Locked)'}</span>
              </div>
              {/* Magic Hat option */}
              <div
                className={`hat-option ${isMagicHatSelected ? 'selected' : ''}`}
                onClick={() => ownedItems?.hat_magic && handleHatSelect('hat_magic')}
                style={{
                  cursor: ownedItems?.hat_magic ? 'pointer' : 'not-allowed',
                  opacity: ownedItems?.hat_magic ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isMagicHatSelected ? '#C19A6B' : '#F5F5DC',
                  border: isMagicHatSelected ? '2px solid #8B4513' : '1px solid #e0e0e0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s',
                  boxShadow: isMagicHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none',
                  textAlign: 'center',
                }}
                 onMouseEnter={(e) => { 
                   if(ownedItems?.hat_magic) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    if (!isMagicHatSelected) e.currentTarget.style.backgroundColor = '#FAF0E6';
                   }
                }}
                onMouseLeave={(e) => { 
                  if(ownedItems?.hat_magic) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isMagicHatSelected ? '0 2px 5px rgba(0,0,0,0.15)' : 'none';
                    if (!isMagicHatSelected) e.currentTarget.style.backgroundColor = '#F5F5DC';
                  }
                }}
                onMouseDown={(e) => ownedItems?.hat_magic && (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => ownedItems?.hat_magic && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                <img
                  src="https://play.rosebud.ai/assets/MagicHat.PNG?fJX9"
                  alt="Magic Hat"
                  style={{ width: 50, height: 50, objectFit: 'contain', marginBottom: '8px' }}
                />
                <span style={{ color: '#444', fontWeight: '600', fontSize: '0.9rem' }}>Magic Hat {ownedItems?.hat_magic ? '' : '(Locked)'}</span>
              </div>
            </div> {/* End hat-options grid */}
          </div> {/* End hat selection section */}
        </div> {/* End modal inner content flex container */}
      </div> {/* End modal content div */}
    </div>
  );
};