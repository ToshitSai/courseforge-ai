import { useLanguage } from '../LanguageContext';

export default function Navbar(){
  const { t } = useLanguage();
  return(
    <div className="navbar">
      <div className="logo">{t("CourseForge AI")}</div>

      <div className="status">
        <span className="beta">BETA</span>
        <span className="live">● Live</span>
      </div>
    </div>
  )
}
