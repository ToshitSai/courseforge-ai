import React from "react";

export default function SimpleLessonCard({ title, description }) {
  return (
    <div className="lesson-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
