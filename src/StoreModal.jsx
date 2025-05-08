import React, { useState } from 'react';

// Define item costs (can be moved elsewhere later)
const ITEM_COSTS = {
  color_red: 10,
  color_yellow: 15,
  // hat_placeholder: 25, // Basic Hat - REMOVED
  hat_cowboy: 50, // Cowboy Hat - More expensive
  hat_strawberry: 30, // Strawberry Hat
  hat_la: 35, // LA Hat
  hat_chef: 40, // Chef Hat
  hat_crown: 60, // Crown Hat - premium!
  trampoline_main: 75, // Trampoline cost
  // level_area2 cost removed
};
export const StoreModal = ({ isOpen, onClose, score, ownedItems = {}, onPurchase }) => {
  const [notification, setNotification] = useState('');

  const handlePurchaseAttempt = (itemId, cost) => {
    if (score >= cost) {
      if (ownedItems[itemId]) {
        setNotification('You already own this item!');
      } else {
        onPurchase(itemId, cost); // Notify parent to handle purchase logic
        // Create a user-friendly name for the notification
        let friendlyName = itemId.replace('_', ' ');
        // if (itemId === 'hat_placeholder') friendlyName = 'Basic Hat'; // REMOVED
        if (itemId === 'hat_cowboy') friendlyName = 'Cowboy Hat';
        if (itemId === 'hat_strawberry') friendlyName = 'Strawberry Hat';
        if (itemId === 'hat_la') friendlyName = 'LA Hat';
        if (itemId === 'hat_chef') friendlyName = 'Chef Hat';
        if (itemId === 'hat_crown') friendlyName = 'Crown Hat';
        if (itemId === 'trampoline_main') friendlyName = 'Bouncy Trampoline';
        // Removed friendlyName logic for level_area2
        if (itemId.startsWith('color_')) friendlyName = `${friendlyName.charAt(0).toUpperCase() + friendlyName.slice(1)} Color`;
        setNotification(`Purchased ${friendlyName}!`);
      }
    } else {
      setNotification('Not enough flies!');
    }
    // Clear notification after a delay
    setTimeout(() => setNotification(''), 2500);
  };

  if (!isOpen) return null;

  // Basic styling - can be enhanced later
  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  };
  const contentStyle = {
    backgroundColor: '#D2B48C', padding: '20px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)', width: 'clamp(350px, 90vw, 600px)', maxHeight: '85vh', overflowY: 'auto', position: 'relative', fontFamily: "'Arial', sans-serif",
  };
   const closeButtonStyle = {
    position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#aaa', lineHeight: 1, padding: '5px', borderRadius: '50%', transition: 'color 0.2s ease, background-color 0.2s ease',
  };
  const titleStyle = {
    textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '20px', color: '#333',
  };
  const itemsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Responsive grid
    gap: '20px', // Spacing between items
  };
  const itemCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#F5F5DC', // Beige, a light tan color
    textAlign: 'center',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };
  const itemImageStyle = {
    width: '60px', height: '60px', objectFit: 'contain', marginBottom: '10px',
  };
  const itemNameStyle = {
     fontWeight: '600', fontSize: '1rem', marginBottom: '5px', color: '#444', minHeight: '40px', // Ensure consistent height for names
  };
  const itemCostStyle = {
    color: '#555', fontSize: '0.9rem', marginBottom: '10px',
  };
  const buttonStyle = {
    padding: '8px 12px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white', transition: 'background-color 0.2s ease', width: '100%',
  };
  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };
  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => { e.target.style.color = '#333'; e.target.style.backgroundColor = '#f0f0f0';}}
          onMouseLeave={(e) => { e.target.style.color = '#aaa'; e.target.style.backgroundColor = 'transparent';}}
        >
          &times;
        </button>
        <div style={titleStyle}>Fly Store</div>
        <div style={{ marginBottom: '15px', textAlign: 'center', color: '#555', fontSize: '1rem', fontWeight: '500' }}>Your Flies: {score}</div>
        {notification && <div style={{ textAlign: 'center', color: notification.includes('Purchased') ? 'green' : 'red', marginBottom: '10px', height: '20px', fontSize: '0.9rem', fontWeight: '500' }}>{notification}</div>}
        {/* Items List - Grid */}
        <div style={itemsGridStyle}>
          {/* Red Color */}
          <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/Red Frog 1.PNG?9ocr" alt="Red Frog" style={itemImageStyle} />
            <span style={itemNameStyle}>Red Frog Color</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.color_red} Flies</span>
            <button 
              style={ownedItems['color_red'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('color_red', ITEM_COSTS.color_red)}
              disabled={ownedItems['color_red']}
            >
              {ownedItems['color_red'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Yellow Color */}
           <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/Yellow Frog 1.png?OXP4" alt="Yellow Frog" style={itemImageStyle} />
            <span style={itemNameStyle}>Yellow Frog Color</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.color_yellow} Flies</span>
            <button 
              style={ownedItems['color_yellow'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('color_yellow', ITEM_COSTS.color_yellow)}
              disabled={ownedItems['color_yellow']}
            >
              {ownedItems['color_yellow'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Basic Hat - REMOVED */}
          {/* Cowboy Hat */}
          <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/Cowboy Hat.png?KP7E" alt="Cowboy Hat" style={itemImageStyle} />
            <span style={itemNameStyle}>Cowboy Hat</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.hat_cowboy} Flies</span>
             <button 
              style={ownedItems['hat_cowboy'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('hat_cowboy', ITEM_COSTS.hat_cowboy)}
              disabled={ownedItems['hat_cowboy']}
             >
               {ownedItems['hat_cowboy'] ? 'Owned' : 'Buy'}
             </button>
          </div>
          {/* Strawberry Hat */}
          <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/Strawberry hat.PNG?pdTd" alt="Strawberry Hat" style={itemImageStyle} />
            <span style={itemNameStyle}>Strawberry Hat</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.hat_strawberry} Flies</span>
            <button 
              style={ownedItems['hat_strawberry'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('hat_strawberry', ITEM_COSTS.hat_strawberry)}
              disabled={ownedItems['hat_strawberry']}
            >
              {ownedItems['hat_strawberry'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* LA Hat */}
          <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/LA hat.PNG?mzqj" alt="LA Hat" style={itemImageStyle} />
            <span style={itemNameStyle}>LA Hat</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.hat_la} Flies</span>
            <button 
              style={ownedItems['hat_la'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('hat_la', ITEM_COSTS.hat_la)}
              disabled={ownedItems['hat_la']}
            >
              {ownedItems['hat_la'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Chef Hat */}
          <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/Chef hat.PNG?fGDe" alt="Chef Hat" style={itemImageStyle} />
            <span style={itemNameStyle}>Chef Hat</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.hat_chef} Flies</span>
            <button 
              style={ownedItems['hat_chef'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('hat_chef', ITEM_COSTS.hat_chef)}
              disabled={ownedItems['hat_chef']}
            >
              {ownedItems['hat_chef'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Crown Hat */}
          <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/CrownHat.PNG?9Z7Q" alt="Crown Hat" style={itemImageStyle} />
            <span style={itemNameStyle}>Crown Hat</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.hat_crown} Flies</span>
            <button 
              style={ownedItems['hat_crown'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('hat_crown', ITEM_COSTS.hat_crown)}
              disabled={ownedItems['hat_crown']}
            >
              {ownedItems['hat_crown'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Trampoline Item */}
          <div style={itemCardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src="https://play.rosebud.ai/assets/Trampoline.PNG?43CL" alt="Trampoline" style={itemImageStyle} />
            <span style={itemNameStyle}>Bouncy Trampoline</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.trampoline_main} Flies</span>
            <button 
              style={ownedItems['trampoline_main'] ? disabledButtonStyle : buttonStyle}
              onClick={() => handlePurchaseAttempt('trampoline_main', ITEM_COSTS.trampoline_main)}
              disabled={ownedItems['trampoline_main']}
            >
              {ownedItems['trampoline_main'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Add more items here following the new grid structure */}
        </div>
      </div>
    </div>
  );
};