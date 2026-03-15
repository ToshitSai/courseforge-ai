import { useLanguage } from '../LanguageContext';

export default function ErrorScreen({ error, onRetry }) {
  const { t } = useLanguage();
  const isApiKey = error?.toLowerCase().includes('api_key') ||
    error?.toLowerCase().includes('gemini') ||
    error?.toLowerCase().includes('not configured');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <button
        className="back-btn"
        onClick={onRetry}
        style={{ marginBottom: '2rem' }}
        id="error-back-btn"
      >
        {t("Back to Home")}
      </button>
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">
          {isApiKey ? t('API Key Required') : t('Course Generation Failed')}
        </h2>
        <p className="error-message">
          {isApiKey ? (
            <>
              Please configure your <strong>GEMINI_API_KEY</strong> in the backend{' '}
              <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                .env
              </code>{' '}
              file before generating a course.
            </>
          ) : (
            typeof error === 'string' && error !== '' ? error : t('An unexpected error occurred. Please try again.')
          )}
        </p>

        {isApiKey && (
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}
          >
            <strong style={{ color: 'var(--text-primary)' }}>Quick Setup:</strong>
            <br />
            1. Copy <code>backend/.env.example</code> to <code>backend/.env</code>
            <br />
            2. Get your free Gemini API key at{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-purple-light)' }}
            >
              aistudio.google.com
            </a>
            <br />
            3. Paste it as <code>GEMINI_API_KEY=your_key</code> in the .env file
            <br />
            4. Restart the backend server
          </div>
        )}

        <button className="retry-full-btn" onClick={onRetry} id="try-again-btn">
          {t("Try Again")}
        </button>
      </div>
    </div>
  );
}
