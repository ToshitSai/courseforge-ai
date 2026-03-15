export default function FeaturePill({icon,text}){
  return(
    <div className="pill">
      <span>{icon}</span>
      {text}
    </div>
  )
}
