import { useLanguage } from '../LanguageContext';
import { AlertCircle, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';

export default function ErrorScreen({ error, onRetry }) {
  const { t } = useLanguage();
  const isApiKey = error?.toLowerCase().includes('api_key') ||
    error?.toLowerCase().includes('api key not valid') ||
    error?.toLowerCase().includes('not configured');

  return (
    <div style={{ maxWidth: 800, margin: '3rem auto', padding: '0 2rem' }}>
      <button
        onClick={onRetry}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginBottom: '2.5rem',
          transition: 'color 0.2s',
          padding: 0
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={16} /> {t("Back to Home")}
      </button>

      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          {isApiKey ? <KeyRound size={36} /> : <AlertCircle size={36} />}
        </div>
        
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          color: 'var(--text-primary)' 
        }}>
          {isApiKey ? t('API Key Required') : t('Course Generation Failed')}
        </h2>
        
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem auto'
        }}>
          {isApiKey ? (
            <>
              Please configure your <strong>GEMINI_API_KEY</strong> in your Google or Render dashboard.
            </>
          ) : (
            typeof error === 'string' && error !== '' ? error : t('An unexpected network error occurred while reaching the AI servers. Please try again.')
          )}
        </p>

        {isApiKey && (
          <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'left',
              marginBottom: '2.5rem',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              maxWidth: '550px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>How to fix this:</strong>
            <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>If testing locally, add it to <code>backend/.env</code></li>
              <li>Get your free Gemini API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-purple-light)' }}>Google AI Studio</a></li>
              <li>If you deployed to Render, go to your <strong>Render Dashboard → Environment Variables</strong></li>
              <li>Add <code>GEMINI_API_KEY</code> with your real key and Save</li>
            </ol>
          </div>
        )}

        <button 
          onClick={onRetry} 
          style={{
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
            color: 'white',
            border: 'none',
            padding: '0.875rem 2.5rem',
            borderRadius: '99px',
            fontSize: '1.05rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s, boxShadow 0.2s',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
          }}
        >
          <RefreshCw size={18} /> {t("Try Again")}
        </button>
      </div>
    </div>
  );
}
