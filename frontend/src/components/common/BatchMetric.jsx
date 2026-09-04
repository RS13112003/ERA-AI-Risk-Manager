function BatchMetric({
  label,
  value,
  valueClass = 'text-white',
}) {
  const normalizedLabel = label.toLowerCase()

  const isHighRisk = normalizedLabel === 'high risk'
  const isLowRisk = normalizedLabel === 'low risk'
  const isReview = normalizedLabel === 'review required'

  const icon = isHighRisk ? '!' : isLowRisk ? '✓' : isReview  ? '!'  : '↗'

  const iconClass = isHighRisk
    ? 'border-red-500/20 bg-red-500/10 text-red-400'
    : isLowRisk
    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
    : isReview
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
        : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-950 p-5 transition duration-200 hover:border-slate-700 hover:bg-slate-950/80">

      <div className="flex items-start justify-between gap-4">

        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
          {label}
        </p>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${iconClass}`}
        >
          {icon}
        </div> 

      </div>

      <p className={`mt-4 text-3xl font-bold tracking-tight ${valueClass}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      <div className="mt-3 h-px bg-slate-900 transition group-hover:bg-slate-800" />

    </div>
  )
}

export default BatchMetric