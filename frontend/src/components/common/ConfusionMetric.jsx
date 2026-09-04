function ConfusionMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-300">
        {value}
      </p>
    </div>
  )
}

export default ConfusionMetric