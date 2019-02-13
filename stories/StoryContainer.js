import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const StoryContainer = ({ bg, children }) => {
  // Modals need this portal element in place _before_ they render.
  const modalPortal = document.createElement('div');
  modalPortal.id = 'modal-portal';
  document.body.appendChild(modalPortal);

  return <Router>
    <div>
      <div
        style={{
          padding: '30px',
          minHeight: '100vh',
          background: bg || '#f2f2f5'
        }}
      >
        {children}
      </div>
    </div>
  </Router>;
};

export default StoryContainer;
