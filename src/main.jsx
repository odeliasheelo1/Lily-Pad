import React from 'react';
import { createRoot } from 'react-dom/client';
import {App} from './App' // ✅ Corrected // Import the new App component
// Add CSS to ensure menu visibility and proper styling
const addGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes menuAppear {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .main-menu-panel h4 {
       font-family: 'Arial', sans-serif; /* Ensure consistent font */
       font-weight: 600;
       color: #444;
    }
    .menu-button:hover {
       background-color: #45a049 !important; /* Ensure hover styles apply */
    }
    /* Style modal option hover effects */
    .color-option:hover {
      background-color: rgba(0, 0, 0, 0.03) !important; /* Ensure hover background applies */
      border-color: #ccc !important; /* Ensure hover border applies */
    }
    .color-option.selected:hover {
      /* Prevent hover style overrides when selected */
      background-color: inherit !important; 
      border-color: inherit !important;
    }
    /* Improve mobile responsiveness */
    @media (max-width: 768px) {
      .outfit-container {
        top: 10px !important;
      }
      
      .outfit-button {
        width: 80px !important;
      }
      
      .color-menu {
        top: 50px !important;
        padding: 10px !important;
      }
    }
  `;
  document.head.appendChild(style);
};
// Initialize saved color from localStorage if available
const initializeColorPreference = () => {
  if (!localStorage.getItem('frogColor')) {
    localStorage.setItem('frogColor', 'green');
  }
};
// Setup the game
const initializeGame = () => {
  addGlobalStyles();
  initializeColorPreference();
  
// Mount the main App component
const root = createRoot(document.getElementById('renderDiv'));
root.render(<App />); // Render the App component instead of LilyPadGame directly
};
// Start the game
initializeGame();