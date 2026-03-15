import React from "react";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">CourseForge AI</h2>

      <ul className="menu">
        <li>🏠 Dashboard</li>
        <li>✨ Generate Course</li>
        <li>📚 Saved Courses</li>
        <li>⚙ Settings</li>
      </ul>
    </div>
  );
}
