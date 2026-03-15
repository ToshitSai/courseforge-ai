import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Stats from './components/Stats';
import GeneratorCard from './components/GeneratorCard';
import LoadingScreen from './components/LoadingScreen';
import CourseView from './components/CourseView';
import ErrorScreen from './components/ErrorScreen';
import axios from 'axios';
import { useLanguage } from './LanguageContext';

const API_BASE = import.meta.env.DEV
  ? `http://${window.location.hostname}:8000`
  : 'https://courseforge-ai-backend.onrender.com';
function App() {
  const { t } = useLanguage();
  const [view, setView] = useState('home'); // 'home' | 'loading' | 'course' | 'error'
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async ({ topic, difficulty, language }) => {
    setView('loading');
    setError(null);
    setCourseData(null);

    try {
      const response = await axios.post(`${API_BASE}/api/generate-course`, {
        topic,
        difficulty,
        language
      }, { timeout: 300000 });
      setCourseData(response.data);
      setView('course');
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.message
        || t('Failed to generate course. Please try again.');
      setError(msg);
      setView('error');
    }
  };

  const handleBack = () => {
    setView('home');
    setCourseData(null);
    setError(null);
  };

  return (
    <div className="app">
      <Navbar />

      {view === 'home' && (
        <>
          <Stats />
          <GeneratorCard onGenerate={handleGenerate} />
        </>
      )}

      {view === 'loading' && <LoadingScreen />}
      {view === 'course' && courseData && (
        <CourseView course={courseData} onBack={handleBack} />
      )}
      {view === 'error' && (
        <ErrorScreen error={error} onRetry={handleBack} />
      )}
    </div>
  );
}

export default App;
