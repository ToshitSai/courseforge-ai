import { useState } from 'react';
import LessonCard from './LessonCard';
import QuizCard from './QuizCard';
import { useLanguage } from '../LanguageContext';

const DIFFICULTY_BADGE = {
  Beginner: 'badge-beginner',
  Intermediate: 'badge-intermediate',
  Advanced: 'badge-advanced',
};

const DIFFICULTY_EMOJI = {
  Beginner: '🟢',
  Intermediate: '🟡',
  Advanced: '🔴',
};

export default function CourseView({ course, onBack }) {
  const { t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'quiz'

  const lesson = course.lessons?.[activeLesson];
  const badgeClass = DIFFICULTY_BADGE[course.difficulty] || 'badge-beginner';
  const diffEmoji = DIFFICULTY_EMOJI[course.difficulty] || '🟢';

  return (
    <div className="course-container">
      {/* Back button */}
      <button className="back-btn" onClick={onBack} id="back-to-home-btn" aria-label="Back to home">
        {t("Back to Home")}
      </button>

      {/* Course Header */}
      <header className="course-header">
        <div className="course-title-block">
          <div className={`course-difficulty-badge ${badgeClass}`}>
            {diffEmoji} {t(course.difficulty || 'Beginner')}
          </div>
          <h1 className="course-main-title">{course.courseTitle}</h1>
          <p className="course-description">{course.description}</p>

          <div className="course-meta-grid">
            <div className="course-meta-item">
              📚 <span>{course.lessons?.length || 4} {t("Lessons")}</span>
            </div>
            <div className="course-meta-item">
              ⏱️ <span>{course.estimatedDuration || '4-6 hours'}</span>
            </div>
            <div className="course-meta-item">
              ❓ <span>{(course.lessons?.length || 4) * 5} {t("Quiz Questions")}</span>
            </div>
            {course.prerequisites?.length > 0 && (
              <div className="course-meta-item">
                🔑 <span>{t("Prerequisites")}: {course.prerequisites.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Lesson Tabs */}
      <div className="lesson-tabs" role="tablist" aria-label="Course lessons">
        {course.lessons?.map((l, idx) => (
          <button
            key={idx}
            id={`lesson-tab-${idx + 1}`}
            className={`lesson-tab ${activeLesson === idx ? 'active' : ''}`}
            onClick={() => { setActiveLesson(idx); setActiveTab('lesson'); }}
            role="tab"
            aria-selected={activeLesson === idx}
          >
            {t("Lesson")} {idx + 1}: {l.title}
          </button>
        ))}
      </div>

      {/* Content + Quiz Toggle */}
      {lesson && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              id="lesson-content-tab"
              className={`lesson-tab ${activeTab === 'lesson' ? 'active' : ''}`}
              onClick={() => setActiveTab('lesson')}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {t("Lesson Content")}
            </button>
            <button
              id="lesson-quiz-tab"
              className={`lesson-tab ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {t("Quiz")} ({lesson.quiz?.length || 5})
            </button>
          </div>

          {activeTab === 'lesson' && <LessonCard lesson={lesson} />}
          {activeTab === 'quiz' && <QuizCard quiz={lesson.quiz || []} lessonTitle={lesson.title} />}
        </>
      )}
    </div>
  );
}
