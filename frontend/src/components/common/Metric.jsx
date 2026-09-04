function Metric({
  label,
  value,
}) {
  return (

    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

      <p className="text-xs uppercase tracking-wide text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>

  ) 
}

export default Metric