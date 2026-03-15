import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

function getResultConfig(score, total, t) {
  const pct = (score / total) * 100;
  if (pct >= 80) return { label: t('Excellent!'), emoji: '🏆', className: 'excellent', color: 'var(--accent-green)' };
  if (pct >= 60) return { label: t('Good Job!'), emoji: '👍', className: 'good', color: 'var(--accent-orange)' };
  return { label: t('Keep Practicing!'), emoji: '💪', className: 'needs-work', color: 'var(--accent-pink)' };
}

export default function QuizCard({ quiz, lessonTitle }) {
  const { t } = useLanguage();
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);

  // Reset when quiz changes (lesson switch)
  useEffect(() => {
    setCurrentQ(0);
    setUserAnswers({});
    setSubmitted({});
    setQuizDone(false);
    setScore(0);
  }, [quiz]);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="quiz-card">
        <div className="quiz-body" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          {t("No quiz questions available")}
        </div>
      </div>
    );
  }

  const q = quiz[currentQ];
  const options = Object.entries(q?.options || {});
  const isAnswered = submitted[currentQ] !== undefined;
  const selectedKey = userAnswers[currentQ];
  const isLast = currentQ === quiz.length - 1;

  function handleOptionSelect(key) {
    if (isAnswered) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ]: key }));
  }

  function handleSubmitAnswer() {
    if (!selectedKey) return;
    const isCorrect = selectedKey === q.correctAnswer;
    setSubmitted((prev) => ({ ...prev, [currentQ]: isCorrect }));
    if (isCorrect) setScore((s) => s + 1);
  }

  function handleNext() {
    if (currentQ < quiz.length - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setQuizDone(true);
    }
  }

  function handlePrev() {
    if (currentQ > 0) setCurrentQ((c) => c - 1);
  }

  function handleRetry() {
    setCurrentQ(0);
    setUserAnswers({});
    setSubmitted({});
    setQuizDone(false);
    setScore(0);
  }

  function getDotClass(idx) {
    if (idx === currentQ) return 'active';
    if (submitted[idx] === true) return 'correct';
    if (submitted[idx] === false) return 'wrong';
    if (userAnswers[idx]) return 'answered';
    return '';
  }

  const result = getResultConfig(score, quiz.length, t);

  return (
    <div className="quiz-card" role="main" aria-label="Quiz section">
      <div className="quiz-header">
        <h2 className="quiz-title">
          {t("Knowledge Check")} — <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{lessonTitle}</span>
        </h2>
        <span className="quiz-progress-text">
          {t("Question")} {currentQ + 1} {t("of")} {quiz.length}
        </span>
      </div>

      <div className="quiz-body">
        {/* Score result banner */}
        {quizDone && (
          <div className={`quiz-result-banner ${result.className}`} role="alert">
            <span className="result-icon">{result.emoji}</span>
            <div>
              <div className="result-score" style={{ color: result.color }}>
                {score}/{quiz.length} {t("Correct")}
              </div>
              <div className="result-label">{result.label}</div>
            </div>
            <button className="retry-btn" onClick={handleRetry} id="quiz-retry-btn">
              {t("Retry Quiz")}
            </button>
          </div>
        )}

        {/* Progress dots */}
        <div className="quiz-dots" role="navigation" aria-label="Quiz progress">
          {quiz.map((_, idx) => (
            <div
              key={idx}
              className={`quiz-dot ${getDotClass(idx)}`}
              onClick={() => setCurrentQ(idx)}
              role="button"
              aria-label={`Go to question ${idx + 1}`}
              title={`Question ${idx + 1}`}
            />
          ))}
        </div>

        {/* Question */}
        <div className="quiz-question-block">
          <div className="question-number">{t("Question")} {currentQ + 1}</div>
          <p className="question-text">{q.question}</p>

          <div className="options-grid" role="radiogroup" aria-label="Answer options">
            {options.map(([key, text]) => {
              let extraClass = '';
              if (isAnswered) {
                if (key === q.correctAnswer) extraClass = 'correct';
                else if (key === selectedKey) extraClass = 'wrong';
              } else if (key === selectedKey) {
                extraClass = 'selected';
              }

              return (
                <button
                  key={key}
                  id={`option-${currentQ}-${key}`}
                  className={`option-btn ${extraClass}`}
                  onClick={() => handleOptionSelect(key)}
                  disabled={isAnswered}
                  role="radio"
                  aria-checked={selectedKey === key}
                  aria-label={`Option ${key}: ${text}`}
                >
                  <span className="option-key">{key}</span>
                  <span className="option-text">{text}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Explanation */}
          {isAnswered && q.explanation && (
            <div className={`answer-explanation ${submitted[currentQ] ? 'correct-bg' : 'wrong-bg'}`} role="alert">
              <strong>{submitted[currentQ] ? '✅ ' + t('Correct') + '!' : `❌ ` + t('Incorrect') + `. The answer is ${q.correctAnswer}.`}</strong>
              <br />
              {q.explanation}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            id="quiz-prev-btn"
            className="quiz-nav-btn"
            onClick={handlePrev}
            disabled={currentQ === 0}
            aria-label="Previous question"
          >
            {t("Prev")}
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isAnswered ? (
              <button
                id="quiz-check-btn"
                className="quiz-submit-btn"
                onClick={handleSubmitAnswer}
                disabled={!selectedKey}
                aria-label="Check answer"
              >
                {t("Check Answer")}
              </button>
            ) : (
              <button
                id="quiz-next-btn"
                className="quiz-submit-btn"
                onClick={handleNext}
                aria-label={isLast ? 'Finish quiz' : 'Next question'}
              >
                {isLast ? t('Finish Quiz') : t('Next')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
