import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const StoryContainer = ({ bg, children }) => {
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
