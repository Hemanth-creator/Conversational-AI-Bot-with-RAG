// MicAnimation.jsx
import React from 'react';
import './MicAnimation.css'; // Import the CSS file

const MicAnimation = () => {
  return (
    <div className="mic-container">
      <div className="mic">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="label">Listening...</div>
    </div>
  );
};

export default MicAnimation;
