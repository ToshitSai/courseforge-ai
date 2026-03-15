import React from "react";

export default function Header() {
  return (
    <div className="header">
      <h1>AI Course Generator</h1>

      <div className="status">
        <span className="beta">BETA</span>
        <span className="live">● Live</span>
      </div>
    </div>
  );
}
