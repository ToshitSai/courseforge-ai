import { useState } from 'react';

const EXAMPLE_TOPICS = [
  'React Hooks',
  'Data Structures',
  'Machine Learning',
  'TypeScript Generics',
  'Docker & Kubernetes',
  'SQL Fundamentals',
];

export default function CourseForm({ onGenerate }) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [charCount, setCharCount] = useState(0);

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate({ topic: topic.trim(), difficulty });
    }
  };

  const handleExampleClick = (ex) => {
    setTopic(ex);
    setCharCount(ex.length);
  };

  return (
    <div className="course-form-container" style={{ padding: '0 2rem 3rem' }}>
      <form className="course-form" onSubmit={handleSubmit} id="course-generator-form">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="topic-input">Course Topic</label>
            <input
              id="topic-input"
              className="form-input"
              type="text"
              placeholder="e.g., React Hooks, Data Structures, Machine Learning..."
              value={topic}
              onChange={handleTopicChange}
              maxLength={200}
              autoFocus
              required
              aria-label="Enter course topic"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {EXAMPLE_TOPICS.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => handleExampleClick(ex)}
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-glass)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-purple)';
                      e.currentTarget.style.color = 'var(--accent-purple-light)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                {charCount}/200
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty-select">Difficulty</label>
            <select
              id="difficulty-select"
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              aria-label="Select course difficulty"
            >
              <option value="Beginner">🟢 Beginner</option>
              <option value="Intermediate">🟡 Intermediate</option>
              <option value="Advanced">🔴 Advanced</option>
            </select>
          </div>
        </div>

        <button
          id="generate-course-btn"
          type="submit"
          className="generate-btn"
          disabled={!topic.trim()}
          aria-label="Generate AI course"
        >
          <span>✨</span>
          Generate My Course
          <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>→</span>
        </button>
      </form>
    </div>
  );
}
