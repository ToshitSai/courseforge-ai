import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const STEPS = [
  { id: 1, icon: '🧠', label: 'Analyzing topic with Gemini AI...' },
  { id: 2, icon: '📝', label: 'Generating course outline & syllabus...' },
  { id: 3, icon: '📖', label: 'Writing lesson content & explanations...' },
  { id: 4, icon: '❓', label: 'Creating quiz questions & answers...' },
  { id: 5, icon: '🎬', label: 'Curating YouTube videos for each lesson...' },
  { id: 6, icon: '🎉', label: 'Finalizing and packaging your course...' },
];

export default function LoadingScreen() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    const intervals = [];
    STEPS.forEach((_, idx) => {
      const delay = idx * 9000; // Space steps ~9s apart
      const t = setTimeout(() => {
        setCurrentStep(idx);
        if (idx > 0) {
          setCompletedSteps((prev) => [...prev, idx - 1]);
        }
      }, delay);
      intervals.push(t);
    });
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-orb" aria-hidden="true" />
      <h2 className="loading-title">{t("Building Your Course...")}</h2>
      <p className="loading-subtitle">
        {t("Our AI is crafting a personalized learning experience for you.")}
        <br />
        {t("This usually takes 30–60 seconds.")}
      </p>

      <div className="loading-steps" role="status" aria-live="polite">
        {STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(idx);
          const isActive = currentStep === idx;
          return (
            <div
              key={step.id}
              className={`loading-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            >
              <div className="step-icon">
                {isDone ? '✓' : isActive ? '◉' : '○'}
              </div>
              <span>{step.icon} {t(step.label)}</span>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        {t("Tip")}
      </p>
    </div>
  );
}
