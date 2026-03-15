import { useLanguage } from '../LanguageContext';

export default function LessonCard({ lesson }) {
  const { t } = useLanguage();
  if (!lesson) return null;

  return (
    <div className="lesson-content">
      {/* Card: Lesson Header + Content */}
      <article className="lesson-card" aria-label={`Lesson ${lesson.lessonNumber}: ${lesson.title}`}>
        <div className="lesson-card-header">
          <div className="lesson-number-badge" aria-hidden="true">
            {String(lesson.lessonNumber || 1).padStart(2, '0')}
          </div>
          <div className="lesson-header-text">
            <h2>{lesson.title}</h2>
            <p>{lesson.objectives?.length || 0} {t("Learning Objectives")} • {lesson.keyTerms?.length || 0} {t("Key Terms")}</p>
          </div>
        </div>

        <div className="lesson-body">
          {/* Learning Objectives */}
          {lesson.objectives?.length > 0 && (
            <div className="objectives-list" role="list" aria-label="Learning objectives">
              <div className="section-title">{t("Learning Objectives")}</div>
              {lesson.objectives.map((obj, i) => (
                <div key={i} className="objective-item" role="listitem">
                  <div className="objective-dot" aria-hidden="true" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          <div className="section-title">{t("Lesson Content")}</div>
          <div className="explanation-text">
            {lesson.explanation?.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>
            ))}
          </div>

          {/* Key Terms */}
          {lesson.keyTerms?.length > 0 && (
            <>
              <div className="section-title">{t("Key Terms")}</div>
              <div className="key-terms-grid">
                {lesson.keyTerms.map((kt, i) => (
                  <div key={i} className="key-term-card">
                    <div className="key-term-name">{kt.term}</div>
                    <div className="key-term-def">{kt.definition}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* YouTube Video */}
          {lesson.video && (
            <div className="video-section">
              <div className="section-title">{t("Video Lesson")}</div>
              <div className="video-wrapper">
                <iframe
                  id={`video-lesson-${lesson.lessonNumber}`}
                  src={lesson.video.embedUrl}
                  title={lesson.video.title || `Lesson ${lesson.lessonNumber} Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="video-meta">
                <div className="video-info">
                  <span className="video-title-text">{lesson.video.title}</span>
                  <span className="video-channel">📺 {lesson.video.channelTitle}</span>
                </div>
                <a
                  href={lesson.video.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-link-btn"
                  aria-label="Watch on YouTube"
                >
                  {t("Watch on YouTube")}
                </a>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
