import ImpactRow from '../common/ImpactRow'

function BusinessImpact() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">

        <div className="mb-6">

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">  Business Impact  </p>

            <h3 className="mt-2 text-xl font-semibold">   Cost-Sensitive Risk Policy </h3>

        </div>


        <div className="space-y-4">

            <ImpactRow  label="False Positive Cost"  value="₹100"  />

            <ImpactRow  label="False Negative Cost"  value="₹5,000" />

            <ImpactRow
            label="Default Threshold Cost"
            value="₹81,000"
            />

            <ImpactRow
            label="Risk Threshold Cost"
            value="₹75,100"
            />

        </div>


        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

            <p className="text-sm text-slate-400">
                Estimated cost reduction
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
                ₹5,900
            </p>

            <p className="mt-1 text-sm text-emerald-300">
                7.28% improvement over the default threshold
            </p>

        </div>

    </div>
  )
}

export default BusinessImpact