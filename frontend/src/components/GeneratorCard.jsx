import {useState} from "react"
import FeaturePill from "./FeaturePill"
import { useLanguage } from "../LanguageContext"

export default function GeneratorCard({ onGenerate }){

  const [topic,setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Beginner")
  const { language, setLanguage, t } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && onGenerate) {
      onGenerate({ topic: topic.trim(), difficulty, language });
    }
  }

  return(
    <form className="glass-card" onSubmit={handleSubmit}>

      <div className="features">

        <FeaturePill icon="🧠" text={t("AI Generated Syllabus")}/>
        <FeaturePill icon="📘" text={t("Detailed Explanations")}/>
        <FeaturePill icon="🎥" text={t("YouTube Videos")}/>
        <FeaturePill icon="✅" text={t("MCQ Quiz")}/>
        <FeaturePill icon="🔑" text={t("Key Terms Glossary")}/>
        <FeaturePill icon="⚡" text={t("Instant Generation")}/>

      </div>

      <div className="input-section">

        <div className="input-group">
          <label>{t("COURSE TOPIC")}</label>

          <input
          placeholder={t("placeholder")}
          value={topic}
          onChange={(e)=>setTopic(e.target.value)}
          required
          />
        </div>

        <div className="input-group">
          <label>{t("DIFFICULTY")}</label>

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Beginner">{t("Beginner")}</option>
            <option value="Intermediate">{t("Intermediate")}</option>
            <option value="Advanced">{t("Advanced")}</option>
          </select>
        </div>

        <div className="input-group">
          <label>{t("LANGUAGE")}</label>

          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">{t("English")}</option>
            <option value="Hindi">{t("Hindi")}</option>
            <option value="Telugu">{t("Telugu")}</option>
          </select>
        </div>

      </div>

      <button type="submit" className="generate-btn" disabled={!topic.trim()}>
        {t("Generate My Course")}
      </button>

    </form>
  )
}
