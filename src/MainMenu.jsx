import React, { useState, useEffect } from 'react';
// SettingsMenu import removed as its content (Sound/Help) will be directly included.
import { OutfitModal } from './OutfitModal'; // Renamed from AccessoriesModal
import { StoreModal } from './StoreModal';
import { ResetConfirmationModal } from './ResetConfirmationModal'; // Import the reset modal
// LevelSelector import removed
import { HelpModal } from './HelpModal'; // Import HelpModal
import { AboutModal } from './AboutModal'; // Import the new AboutModal
// Pass score, ownedItems, purchase handler, hat selection handler, isMuted, onToggleMute down
export const MainMenu = ({ onSelectColor, onSelectHat, score, ownedItems, onPurchase, isMuted, onToggleMute }) => { // Removed currentLevel, onSelectLevel
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false); // State for Store modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false); // State for Reset modal
  // Removed isLevelSelectorOpen state
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // State for Help modal
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false); // State for About modal
  // Hover states for grid icons
  const [soundHovered, setSoundHovered] = useState(false);
  const [helpHovered, setHelpHovered] = useState(false);
  const [aboutHovered, setAboutHovered] = useState(false);
  useEffect(() => {
    if (!isMenuOpen) {
      // Reset hover states when menu is closed to ensure they are fresh on next open
      setSoundHovered(false);
      setHelpHovered(false);
      setAboutHovered(false);
    }
  }, [isMenuOpen, setSoundHovered, setHelpHovered, setAboutHovered]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const openOutfitModal = () => {
    setIsOutfitModalOpen(true);
    setIsMenuOpen(false); // Close main menu
  };
  const closeOutfitModal = () => {
    setIsOutfitModalOpen(false);
    setIsOutfitModalOpen(false);
  };
  const openStoreModal = () => {
    setIsStoreModalOpen(true);
    setIsMenuOpen(false); // Close main menu
  };
  const closeStoreModal = () => {
    setIsStoreModalOpen(false);
  };
  // Reset Modal Handlers
  const openResetModal = () => {
    setIsResetModalOpen(true);
    setIsMenuOpen(false); // Close main menu
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
  // Removed Level Selector Modal Handlers
   // Handlers for Help Modal (moved from SettingsMenu)
  const openHelpModal = () => {
    setIsHelpModalOpen(true);
    setIsMenuOpen(false); // Close main menu
  };
  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };
  // About Modal Handlers
  const openAboutModal = () => {
    setIsAboutModalOpen(true);
    setIsMenuOpen(false); // Close main menu
  };
  const closeAboutModal = () => {
    setIsAboutModalOpen(false);
  };
  // Generic Image Button Component (to reduce repetition)
  const ImageButton = ({ baseSrc, dimSrc, alt, onClick, width = '55%', title, externalHoverState, setExternalHoverState }) => { // Default width to 55%
    const [isHovered, setIsHovered] = useState(false);
    const hover = externalHoverState ?? isHovered;
    const setHover = setExternalHoverState ?? setIsHovered;
    return (
      <div 
        style={{ textAlign: 'center', cursor: 'pointer' }}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img 
          src={hover ? dimSrc : baseSrc} 
          alt={alt} 
          style={{ 
            width: width, 
            height: 'auto', 
            display: 'block', 
            margin: '0 auto 5px auto', // Add margin below image
            transition: 'transform 0.1s ease',
            transform: hover ? 'scale(1.05)' : 'scale(1)'
          }} 
        />
        <h4 style={{ marginTop: 0, marginBottom: '5px', color: '#333', fontSize: '0.85rem', fontWeight: '600' }}>{title}</h4>
      </div>
    );
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

      {/* Menu Panel - Updated Styling and Layout */}
      {isMenuOpen && (
        <div className="main-menu-panel" style={{
          position: 'absolute',
          top: 80, // Position below the button
          left: 20,
          backgroundColor: '#D2B48C', // Tan color
          // backgroundImage removed
          // backgroundSize removed
          // backgroundRepeat removed
          // backgroundPosition removed
          // backgroundOrigin removed
          // backgroundClip removed
          borderRadius: 15, // Keep the rounded corners
          padding: '10px', // Keep the padding
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Softer shadow
          zIndex: 105,
          display: 'grid', // Use Grid layout
          gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
          gridTemplateRows: 'auto auto', // Only 2 rows needed now
          gap: '8px 6px', // Keep the gap
          // Set fixed dimensions based on background image aspect ratio (approx. 500x500)
          width: 300, // Scaled down width
          height: 'auto', // Let height adjust based on content + padding
          padding: '10px', // Keep padding
          paddingTop: '30px', // Add more padding at the top for the 'X' button
          animation: 'menuAppear 0.3s ease-out forwards', // Use existing animation
          fontFamily: "'Arial', sans-serif", // Consistent font
        }}>
          {/* Row 1 */}
          <ImageButton 
            baseSrc="https://play.rosebud.ai/assets/Accessories.PNG?AO97"
            dimSrc="https://play.rosebud.ai/assets/Accessories dim.PNG?OVJh"
            alt="Accessories"
            onClick={openOutfitModal}
            title="Accessories"
          />
          <ImageButton
            baseSrc="https://play.rosebud.ai/assets/Shop.PNG?uXu9" // Correct Shop icon
            dimSrc="https://play.rosebud.ai/assets/Shop dim.PNG?y6xs" // Correct Shop dimmed icon
            alt="Store"
            onClick={openStoreModal}
            title="Store"
            width="55%" // Keep standardized width
          />
          <ImageButton 
            baseSrc={isMuted ? "https://play.rosebud.ai/assets/sounddimmed.png?NpJ5" : "https://play.rosebud.ai/assets/sound.png?t4JR"}
            dimSrc={isMuted ? "https://play.rosebud.ai/assets/sound.png?t4JR" : "https://play.rosebud.ai/assets/sounddimmed.png?NpJ5"} // Dimming is visual swap + text
            alt="Sound"
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            width="55%" // Standardize Sound button width
            externalHoverState={soundHovered}
            setExternalHoverState={setSoundHovered}
          />
          {/* Row 2 */}
           <ImageButton 
            baseSrc="https://play.rosebud.ai/assets/questionmark.png?Uzu1"
            dimSrc="https://play.rosebud.ai/assets/questionmarkdimmed.png?OmAI"
            alt="Help"
            onClick={openHelpModal}
            title="Help"
            width="55%" // Standardize Help button width
            externalHoverState={helpHovered}
            setExternalHoverState={setHelpHovered}
          />
          <ImageButton 
            baseSrc="https://play.rosebud.ai/assets/About.PNG?3io8"
            dimSrc="https://play.rosebud.ai/assets/About dim.PNG?zhrt"
            alt="About"
            onClick={openAboutModal} // Add onClick for About
            title="About"
          />
          {/* Reset Button (using ImageButton) */}
          <ImageButton
            baseSrc="https://play.rosebud.ai/assets/Restart.PNG?YcKf" // Restart icon
            dimSrc="https://play.rosebud.ai/assets/Restart dim.PNG?4jdc" // Restart dimmed icon
            alt="Reset"
            onClick={openResetModal}
            title="Reset Game"
            width="55%" // Standardize width
          />
          {/* Row 3 removed (Levels button and empty cells) */}
          {/* New 'X' Close Button (positioned absolutely) */}
          <button
            onClick={toggleMenu}
            style={{
              position: 'absolute',
              top: '8px', // Distance from top edge of panel
              right: '8px', // Distance from right edge of panel
              background: 'none',
              border: 'none',
              fontSize: '1.5rem', // Make 'X' larger
              fontWeight: 'bold',
              color: '#666', // Dark grey color
              cursor: 'pointer',
              lineHeight: 1,
              padding: '2px 5px', // Minimal padding
              transition: 'color 0.2s ease, transform 0.1s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#333'} // Darken on hover
            onMouseLeave={(e) => e.target.style.color = '#666'}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.9)'} // Press effect
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
           >
             &times; {/* HTML entity for 'X' */}
           </button>
        </div>
      )}
      <OutfitModal // Use the correct component name
        isOpen={isOutfitModalOpen}
        onClose={closeOutfitModal}
        onSelectColor={onSelectColor}
        onSelectHat={onSelectHat} // Pass hat selection handler
        ownedItems={ownedItems} // Pass owned items for color and hat filtering
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
      {/* Removed LevelSelector modal rendering */}
      {/* Render the Help Modal */}
      <HelpModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />
      {/* Render the About Modal */}
      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
    </>
  );
};
// TODO: Find actual assets for Store button and replace placeholders.