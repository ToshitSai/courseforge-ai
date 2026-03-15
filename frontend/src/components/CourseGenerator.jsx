import { useState } from "react";

export default function CourseGenerator({ onGenerate }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && onGenerate) {
      onGenerate({ topic: topic.trim(), difficulty });
    }
  };

  return (
    <form className="generator-card" onSubmit={handleSubmit}>
      <h2>Create New Course</h2>

      <input
        type="text"
        placeholder="Enter topic (React, Data Structures...)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <button type="submit" className="generate-btn">Generate Course</button>
    </form>
  );
}
