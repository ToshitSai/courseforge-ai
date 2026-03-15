export default function HeroSection() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-eyebrow">
          <span>✨</span>
          Powered by Google Gemini AI + YouTube
        </div>
        <h1 className="hero-title">
          Build Your{' '}
          <span className="hero-title-gradient">Perfect Course</span>
          <br />in Seconds
        </h1>
        <p className="hero-subtitle">
          Enter any topic and our AI instantly creates a structured 4-lesson course complete
          with rich explanations, curated YouTube videos, and 5-question quizzes per lesson.
        </p>
      </section>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value">4</div>
          <div className="stat-label">Lessons Generated</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">20</div>
          <div className="stat-label">Quiz Questions</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">4</div>
          <div className="stat-label">YouTube Videos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">~60s</div>
          <div className="stat-label">Generation Time</div>
        </div>
      </div>

      <div className="features-strip">
        {[
          { icon: '🧠', label: 'AI-Generated Syllabus' },
          { icon: '📖', label: 'Detailed Explanations' },
          { icon: '🎬', label: 'Curated YouTube Videos' },
          { icon: '✅', label: '5 MCQ Quiz per Lesson' },
          { icon: '🔑', label: 'Key Terms Glossary' },
          { icon: '⚡', label: 'Instant Generation' },
        ].map((f) => (
          <div key={f.label} className="feature-chip">
            <span className="feature-chip-icon">{f.icon}</span>
            {f.label}
          </div>
        ))}
      </div>
    </>
  );
}
