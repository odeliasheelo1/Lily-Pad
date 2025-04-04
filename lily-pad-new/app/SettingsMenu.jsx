import React, { useState, useEffect } from 'react';

export const SettingsMenu = () => {
  // State to manage settings menu visibility and audio
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [settingsHovered, setSettingsHovered] = useState(false);
  const [soundHovered, setSoundHovered] = useState(false);
  const [helpHovered, setHelpHovered] = useState(false);
  const [audio, setAudio] = useState(null);

  // Initialize the audio object
  useEffect(() => {
    const backgroundMusic = new Audio('https://play.rosebud.ai/assets/background-music.mp3?Cq5m');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5; // Set to 50% volume
    setAudio(backgroundMusic);
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.src = '';
      }
    };
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audio) {
      if (isMuted) {
        audio.pause();
      } else {
        audio.play().catch(error => {
          // Auto-play was prevented
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }, [isMuted, audio]);

  // Toggle settings menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle sound
  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
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
        }}>
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
              gap: 10,
              transition: 'transform 0.2s ease',
              transform: soundHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <img 
              src={soundHovered || isMuted
                ? "https://play.rosebud.ai/assets/sounddimmed.png?NpJ5" 
                : "https://play.rosebud.ai/assets/sound.png?t4JR"}
              alt="Sound"
              style={{ width: 40, height: 40 }}
            />
            <span>{isMuted ? "Unmute" : "Mute"} Sound</span>
          </div>

          {/* Help button */}
          <div 
            className="help-button"
            onMouseEnter={() => setHelpHovered(true)}
            onMouseLeave={() => setHelpHovered(false)}
            style={{ 
              cursor: 'pointer', 
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'transform 0.2s ease',
              transform: helpHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <img 
              src={helpHovered 
                ? "https://play.rosebud.ai/assets/questionmarkdimmed.png?OmAI" 
                : "https://play.rosebud.ai/assets/questionmark.png?Uzu1"}
              alt="Help"
              style={{ width: 40, height: 40 }}
            />
            <span>Help</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;