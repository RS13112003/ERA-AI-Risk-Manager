function ImpactRow({
  label,
  value,
}) {
  return (

    <div className="flex items-center justify-between border-b border-slate-800 pb-3">

      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  )
}

export default ImpactRow