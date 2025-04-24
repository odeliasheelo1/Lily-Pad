import React, { useState, useEffect } from 'react';
import { HelpModal } from './HelpModal'; // Import the HelpModal
// Accept isEmbedded prop and new props: isMuted, onToggleMute
export const SettingsMenu = ({ isEmbedded = false, isMuted, onToggleMute }) => { 
  // State to manage settings menu visibility (only for standalone mode)
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Still needed for standalone mode
  const [settingsHovered, setSettingsHovered] = useState(false);
  const [soundHovered, setSoundHovered] = useState(false);
  const [helpHovered, setHelpHovered] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // State for Help modal
  // Removed audio state and related useEffects
  
  // Toggle settings menu (only used in standalone mode)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Toggle sound - now calls the function passed via props
  const toggleSound = () => {
    onToggleMute(); 
  };
  
  // Handlers for Help Modal
  const openHelpModal = () => {
    setIsHelpModalOpen(true);
  };
  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };
  // Render the inner menu content (sound and help buttons)
  const renderMenuContent = () => (
    <>
          {/* Sound toggle button */}
          <div 
            className="sound-button"
            onClick={toggleSound}
            onMouseEnter={() => setSoundHovered(true)}
            onMouseLeave={() => setSoundHovered(false)}
            style={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12, // Slightly increased gap
              transition: 'transform 0.2s ease, opacity 0.2s ease', // Add opacity transition
              transform: soundHovered ? 'scale(1.03)' : 'scale(1)', // Smaller scale effect
              opacity: soundHovered ? 0.8 : 1, // Dim slightly on hover
              padding: '5px 0', // Add some vertical padding
            }}
          >
            <img
              src={isMuted // Base icon on state, hover dims via opacity
                ? "https://play.rosebud.ai/assets/sounddimmed.png?NpJ5" 
                : "https://play.rosebud.ai/assets/sound.png?t4JR"}
              alt="Sound"
              style={{ width: 35, height: 35 }} // Slightly smaller icons
            />
            <span style={{ color: '#555', fontSize: '0.95rem' }}>{isMuted ? "Unmute" : "Mute"} Sound</span> {/* Consistent font style */}
          </div>
          {/* Help button */}
          <div 
            className="help-button"
            onClick={openHelpModal} // Open Help Modal on click
            onMouseEnter={() => setHelpHovered(true)}
            onMouseLeave={() => setHelpHovered(false)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12, // Match sound button gap
              transition: 'transform 0.2s ease, opacity 0.2s ease', // Add opacity transition
              transform: helpHovered ? 'scale(1.03)' : 'scale(1)', // Smaller scale effect
              opacity: helpHovered ? 0.8 : 1, // Dim slightly on hover
              padding: '5px 0', // Add some vertical padding
            }}
          >
            <img
              src={helpHovered // Just use hover state for icon swap here
                ? "https://play.rosebud.ai/assets/questionmarkdimmed.png?OmAI"
                : "https://play.rosebud.ai/assets/questionmark.png?Uzu1"}
              alt="Help"
              style={{ width: 35, height: 35 }} // Match sound icon size
            />
            <span style={{ color: '#555', fontSize: '0.95rem' }}>Help</span> {/* Consistent font style */}
          </div>
    </>
  );
  // Always render the HelpModal at the top level, its visibility is controlled by state
  const modal = <HelpModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />;
  // If embedded, render only the content *and* the modal
  if (isEmbedded) {
    // Use a fragment to render both the content and the modal
    return (
      <>
        {renderMenuContent()}
        {modal}
      </>
    );
  }
  // Otherwise, render the full component with container, button, *and* the modal
  return (
    <> {/* Use fragment for standalone mode */}
      {/* Render the Help Modal (already defined as 'modal') */}
      {modal}
      {/* Original Settings Container Div */}
      <div className="settings-container" style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 100
      }}>
        {/* Settings button */}
      <div
        className="settings-button"
        onClick={toggleMenu}
        onMouseEnter={() => setSettingsHovered(true)}
        onMouseLeave={() => setSettingsHovered(false)}
        style={{
          cursor: 'pointer',
          width: 50,
          height: 50,
          transition: 'transform 0.2s ease',
          transform: settingsHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        <img
          src={settingsHovered
            ? "https://play.rosebud.ai/assets/settingsdimmed.png?G4ae"
            : "https://play.rosebud.ai/assets/settings.png?C20P"}
          alt="Settings"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {/* Settings menu panel */}
      {isMenuOpen && (
        <div className="settings-menu" style={{
          position: 'absolute',
          right: 0,
          top: 60,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 10,
          padding: 15,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          minWidth: 150,
          animation: 'menuAppear 0.3s ease-out forwards', // Added animation
        }}>
          {renderMenuContent()}
        </div>
      )}
      </div>
    </>
  );
};