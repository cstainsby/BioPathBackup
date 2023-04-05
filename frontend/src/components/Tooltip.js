import React, { useState } from "react";

function Tooltip({ children, text }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div style={{ position: "relative" }}>
      <span onMouseEnter={toggleTooltip} onMouseLeave={toggleTooltip}>
        {children}
      </span>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "black",
            color: "white",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

export default Tooltip;