import { useLanguage } from '../LanguageContext';

export default function Stats(){
  const { t } = useLanguage();
  return(
    <div className="stats">

      <div className="stat">
        <h2>4</h2>
        <p>{t("Lessons Generated")}</p>
      </div>

      <div className="stat">
        <h2>20</h2>
        <p>{t("Quiz Questions")}</p>
      </div>

      <div className="stat">
        <h2>4</h2>
        <p>{t("YouTube Videos")}</p>
      </div>

      <div className="stat">
        <h2>~60s</h2>
        <p>{t("Generation Time")}</p>
      </div>

    </div>
  )
}
