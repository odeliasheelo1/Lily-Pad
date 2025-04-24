import React, { useState } from 'react';

// Define item costs (can be moved elsewhere later)
const ITEM_COSTS = {
  color_red: 10,
  color_yellow: 15,
  hat_placeholder: 25, // Basic Hat
  hat_cowboy: 50, // Cowboy Hat - More expensive
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
        if (itemId === 'hat_placeholder') friendlyName = 'Basic Hat';
        if (itemId === 'hat_cowboy') friendlyName = 'Cowboy Hat';
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
    backgroundColor: 'white', padding: '30px 40px', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)', minWidth: '400px', position: 'relative', fontFamily: "'Arial', sans-serif",
  };
   const closeButtonStyle = {
    position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#aaa', lineHeight: 1, padding: '0', transition: 'color 0.2s ease',
  };
  const titleStyle = { // Added missing const titleStyle = {
    textAlign: 'center', fontWeight: '600', fontSize: '1.4rem', marginBottom: '25px', color: '#333',
  };
  const itemStyle = {
    display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee', gap: '15px', // Added gap, increased padding
  };
  const itemImageStyle = { // Style for the item icons
    width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0,
  };
  const itemNameStyle = { // Style for the item name to allow flex grow
     flexGrow: 1, // Allow name to take up available space
  };
  const itemCostStyle = { // Style for the cost span
    color: '#555', fontSize: '0.9rem', whiteSpace: 'nowrap', marginRight: '15px', // Added margin
  };
  const buttonStyle = {
    padding: '5px 10px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', flexShrink: 0, minWidth: '60px', textAlign: 'center', // Ensure button doesn't shrink
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <button 
          onClick={onClose} 
          style={closeButtonStyle}
          onMouseEnter={(e) => e.target.style.color = '#555'}
          onMouseLeave={(e) => e.target.style.color = '#aaa'}
        >
          &times;
        </button>
        <div style={titleStyle}>Fly Store</div>
        <div style={{ marginBottom: '15px', textAlign: 'center', color: '#555' }}>Your Flies: {score}</div>
        
        {notification && <div style={{ textAlign: 'center', color: 'red', marginBottom: '10px', height: '20px' }}>{notification}</div>}

        {/* Items List */}
        <div>
          {/* Red Color */}
          <div style={itemStyle}>
            <img src="https://play.rosebud.ai/assets/Red Frog 1.PNG?9ocr" alt="Red Frog" style={itemImageStyle} />
            <span style={itemNameStyle}>Red Frog Color</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.color_red} Flies</span>
            <button 
              style={buttonStyle} 
              onClick={() => handlePurchaseAttempt('color_red', ITEM_COSTS.color_red)}
              disabled={ownedItems['color_red']}
            >
              {ownedItems['color_red'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Yellow Color */}
           <div style={itemStyle}>
            <img src="https://play.rosebud.ai/assets/Yellow Frog 1.png?OXP4" alt="Yellow Frog" style={itemImageStyle} />
            <span style={itemNameStyle}>Yellow Frog Color</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.color_yellow} Flies</span>
            <button 
              style={buttonStyle} 
              onClick={() => handlePurchaseAttempt('color_yellow', ITEM_COSTS.color_yellow)}
              disabled={ownedItems['color_yellow']}
            >
              {ownedItems['color_yellow'] ? 'Owned' : 'Buy'}
            </button>
          </div>
          {/* Placeholder Hat */}
           <div style={itemStyle}>
            <img src="https://play.rosebud.ai/assets/8 bit hat.png?oXIp" alt="Basic Hat" style={itemImageStyle} />
            <span style={itemNameStyle}>Basic Hat</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.hat_placeholder} Flies</span>
             <button 
              style={buttonStyle} 
              onClick={() => handlePurchaseAttempt('hat_placeholder', ITEM_COSTS.hat_placeholder)}
              disabled={ownedItems['hat_placeholder']}
             >
               {ownedItems['hat_placeholder'] ? 'Owned' : 'Buy'}
             </button>
          </div>
          {/* Cowboy Hat */}
          <div style={itemStyle}>
            <img src="https://play.rosebud.ai/assets/Cowboy Hat.png?KP7E" alt="Cowboy Hat" style={itemImageStyle} />
            <span style={itemNameStyle}>Cowboy Hat</span>
            <span style={itemCostStyle}>Cost: {ITEM_COSTS.hat_cowboy} Flies</span>
             <button 
              style={buttonStyle} 
              onClick={() => handlePurchaseAttempt('hat_cowboy', ITEM_COSTS.hat_cowboy)}
              disabled={ownedItems['hat_cowboy']}
             >
               {ownedItems['hat_cowboy'] ? 'Owned' : 'Buy'}
             </button>
          </div>
          {/* Add more items here */}
        </div>
      </div>
    </div>
  );
};