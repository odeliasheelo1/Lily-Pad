import React, { useState, useEffect } from 'react';
import { OutfitModal } from './OutfitModal';
import { StoreModal } from './StoreModal';
import { ResetConfirmationModal } from './ResetConfirmationModal';
import { HelpModal } from './HelpModal';
import { AboutModal } from './AboutModal';
import HelpIcon from './assets/Question.png';
import HelpDimIcon from './assets/QuestionDim.png';
import AboutIcon from './assets/About.png';
import AboutDimIcon from './assets/AboutDim.png';
import ResetIcon from './assets/Reset.png';
import ResetDimIcon from './assets/ResetDim.png';

export const MainMenu = ({ onSelectColor, onSelectHat, score, ownedItems, onPurchase, isMuted, onToggleMute }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [soundHovered, setSoundHovered] = useState(false);
  const [helpHovered, setHelpHovered] = useState(false);
  const [aboutHovered, setAboutHovered] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      setSoundHovered(false);
      setHelpHovered(false);
      setAboutHovered(false);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openOutfitModal = () => { setIsOutfitModalOpen(true); setIsMenuOpen(false); };
  const closeOutfitModal = () => setIsOutfitModalOpen(false);
  const openStoreModal = () => { setIsStoreModalOpen(true); setIsMenuOpen(false); };
  const closeStoreModal = () => setIsStoreModalOpen(false);
  const openResetModal = () => { setIsResetModalOpen(true); setIsMenuOpen(false); };
  const closeResetModal = () => setIsResetModalOpen(false);
  const openHelpModal = () => { setIsHelpModalOpen(true); setIsMenuOpen(false); };
  const closeHelpModal = () => setIsHelpModalOpen(false);
  const openAboutModal = () => { setIsAboutModalOpen(true); setIsMenuOpen(false); };
  const closeAboutModal = () => setIsAboutModalOpen(false);

  const handleConfirmReset = () => {
    localStorage.removeItem('froggyJumpsScore');
    localStorage.removeItem('froggyOwnedItems');
    localStorage.removeItem('frogColor');
    window.location.reload();
  };

  const ImageButton = ({ baseSrc, dimSrc, alt, onClick, width = '55%', title, externalHoverState, setExternalHoverState }) => {
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
            margin: '0 auto 5px auto',
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
          zIndex: 110,
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
          top: 80,
          left: 20,
          backgroundColor: '#D2B48C',
          borderRadius: 15,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 105,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: '8px 6px',
          width: 300,
          height: 'auto',
          padding: '30px 10px 10px 10px', // ✅ KEEP THIS
          animation: 'menuAppear 0.3s ease-out forwards',
          fontFamily: "'Arial', sans-serif",
        }}>
          <ImageButton
            baseSrc="https://play.rosebud.ai/assets/Accessories.PNG?AO97"
            dimSrc="https://play.rosebud.ai/assets/Accessories dim.PNG?OVJh"
            alt="Accessories"
            onClick={openOutfitModal}
            title="Accessories"
          />
          <ImageButton
            baseSrc="https://play.rosebud.ai/assets/Shop.PNG?uXu9"
            dimSrc="https://play.rosebud.ai/assets/Shop dim.PNG?y6xs"
            alt="Store"
            onClick={openStoreModal}
            title="Store"
          />
          <ImageButton
            baseSrc={isMuted ? "https://play.rosebud.ai/assets/sounddimmed.png?NpJ5" : "https://play.rosebud.ai/assets/sound.png?t4JR"}
            dimSrc="https://play.rosebud.ai/assets/sounddimmed.png?NpJ5"
            alt="Sound"
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            externalHoverState={soundHovered}
            setExternalHoverState={setSoundHovered}
          />
          <ImageButton
            baseSrc={HelpIcon}
            dimSrc={HelpDimIcon}
            alt="Help"
            onClick={openHelpModal}
            title="Help"
            externalHoverState={helpHovered}
            setExternalHoverState={setHelpHovered}
          />
          <ImageButton
            baseSrc={AboutIcon}
            dimSrc={AboutDimIcon}
            alt="About"
            onClick={openAboutModal}
            title="About"
            externalHoverState={aboutHovered}
            setExternalHoverState={setAboutHovered}
          />
          <ImageButton
            baseSrc={ResetIcon}
            dimSrc={ResetDimIcon}
            alt="Reset"
            onClick={openResetModal}
            title="Reset"
          />
        </div>
      )}

      {/* Modals */}
      <OutfitModal isOpen={isOutfitModalOpen} onClose={closeOutfitModal} onSelectColor={onSelectColor} ownedItems={ownedItems} onSelectHat={onSelectHat} />
      <StoreModal isOpen={isStoreModalOpen} onClose={closeStoreModal} score={score} ownedItems={ownedItems} onPurchase={onPurchase} />
      <ResetConfirmationModal isOpen={isResetModalOpen} onClose={closeResetModal} onConfirm={handleConfirmReset} />
      <HelpModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />
      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
    </>
  );
};
