import React, { useState } from 'react';
import { SettingsMenu } from './SettingsMenu';
import { OutfitModal } from './OutfitModal';
import { StoreModal } from './StoreModal';
import { ResetConfirmationModal } from './ResetConfirmationModal'; // Import the reset modal
// Pass score, ownedItems, purchase handler, hat selection handler, isMuted, onToggleMute down
export const MainMenu = ({ onSelectColor, onSelectHat, score, ownedItems, onPurchase, isMuted, onToggleMute }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false); // State for Store modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false); // State for Reset modal
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const openOutfitModal = () => {
    setIsOutfitModalOpen(true);
    // Optionally close the main menu when opening the modal
    // setIsMenuOpen(false); 
  };
  const closeOutfitModal = () => {
    setIsOutfitModalOpen(false);
  };
  // Removed extra closing brace here
  const openStoreModal = () => {
    setIsStoreModalOpen(true);
  };
  const closeStoreModal = () => {
    setIsStoreModalOpen(false);
  };
  // Reset Modal Handlers
  const openResetModal = () => {
    setIsResetModalOpen(true);
  };
  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };
  const handleConfirmReset = () => {
     // Clear relevant localStorage items
    localStorage.removeItem('froggyJumpsScore');
    localStorage.removeItem('froggyOwnedItems');
    localStorage.removeItem('frogColor'); // Also reset selected color preference
    // Reload the page to go back to the title screen and reset state
    window.location.reload();
  };
  return (
    <>
      {/* Main Menu Button */}
      <div
        className="main-menu-button"
        onClick={toggleMenu}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        style={{ 
          position: 'absolute',
          top: 20, 
          left: 20, 
          zIndex: 110, // Ensure it's above other UI elements
          cursor: 'pointer', 
          width: 50, 
          height: 50,
          transition: 'transform 0.2s ease',
          transform: buttonHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <img 
          src={buttonHovered 
            ? "https://play.rosebud.ai/assets/Menu dim.png?Y6vR" 
            : "https://play.rosebud.ai/assets/Menu.png?zr9C"}
          alt="Menu"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Menu Panel */}
      {isMenuOpen && (
        <div className="main-menu-panel" style={{
          position: 'absolute',
          top: 80, // Position below the button
          left: 20,
          backgroundColor: '#ffffff', // Solid white background
          borderRadius: 8, // Slightly smaller radius
          padding: '25px', // Increased padding
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Softer shadow
          zIndex: 105,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          minWidth: 220, // Slightly wider
          animation: 'menuAppear 0.3s ease-out forwards', // Use existing animation
          fontFamily: "'Arial', sans-serif", // Consistent font
        }}>
          {/* Render actual menus, passing isEmbedded prop */}
          <div className="menu-section" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#555' }}>Settings</h4>
            {/* Pass isMuted and onToggleMute down to SettingsMenu */}
            <SettingsMenu isEmbedded={true} isMuted={isMuted} onToggleMute={onToggleMute} />
          </div>
          <div className="menu-section">
             <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#555' }}>Outfit</h4>
              {/* Button to open the Outfit Modal */}
              <button
                onClick={openOutfitModal}
                className="menu-button" // Add class for potential global styling
                style={{
                  cursor: 'pointer',
                  padding: '10px 18px', // Larger padding
                  border: 'none', // Remove border
                  borderRadius: '6px', // Match panel radius
                  backgroundColor: '#4CAF50', // Green theme color
                  color: 'white', // White text
                  fontFamily: "'Arial', sans-serif",
                  fontSize: '0.95rem', // Slightly larger font
                  width: '100%', // Make button fill section width
                  textAlign: 'center',
                  transition: 'background-color 0.2s ease, transform 0.1s ease', // Smooth transitions
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'} // Darker green on hover
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'} // Press effect
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                  Outfit
              </button>
          </div>
           {/* Store Button */}
          <div className="menu-section" style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
             <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#555' }}>Store</h4>
              <button
                onClick={openStoreModal} // Open the Store Modal
                className="menu-button"
                style={{
                  cursor: 'pointer', padding: '10px 18px', border: 'none', borderRadius: '6px', backgroundColor: '#2196F3', /* Blue theme color */ color: 'white', fontFamily: "'Arial', sans-serif", fontSize: '0.95rem', width: '100%', textAlign: 'center', transition: 'background-color 0.2s ease, transform 0.1s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1e88e5'} /* Darker blue */
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                  Visit Store
              </button>
          </div>
          {/* Reset Game Button */}
          <div className="menu-section" style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
             <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#555' }}>Reset</h4>
              <button
                onClick={openResetModal} // Open the reset confirmation modal
                className="menu-button reset-button" // Add specific class
                style={{
                  cursor: 'pointer', padding: '10px 18px', border: 'none', borderRadius: '6px', backgroundColor: '#f44336', /* Red color for warning */ color: 'white', fontFamily: "'Arial', sans-serif", fontSize: '0.95rem', width: '100%', textAlign: 'center', transition: 'background-color 0.2s ease, transform 0.1s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e53935'} /* Darker red */
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                  Reset Game
              </button>
          </div>
        </div>
      )}
      {/* Render the Outfit Modal */}
      <OutfitModal
        isOpen={isOutfitModalOpen}
        onClose={closeOutfitModal}
        onSelectColor={onSelectColor}
        onSelectHat={onSelectHat} // Pass hat selection handler
        ownedColors={ownedItems} // Pass owned items for color filtering
        ownedItems={ownedItems} // Pass owned items for hat filtering
      />
      {/* Render the Store Modal */}
      <StoreModal
        isOpen={isStoreModalOpen}
        onClose={closeStoreModal}
        score={score}
        ownedItems={ownedItems}
        onPurchase={onPurchase} // Pass the purchase handler
      />
       {/* Render the Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        onConfirm={handleConfirmReset}
      />
    </>
  );
};