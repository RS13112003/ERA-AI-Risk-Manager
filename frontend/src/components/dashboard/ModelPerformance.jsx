import Metric from '../common/Metric'

function ModelPerformance() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">

        <div className="mb-6">

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
                Model Performance
            </p>

            <h3 className="mt-2 text-xl font-semibold">
                Final Held-Out Test
            </h3>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Metric
            label="Precision"
            value="62.22%"
            />

            <Metric
            label="Recall"
            value="85.71%"
            />

            <Metric
            label="F1 Score"
            value="72.10%"
            />

            <Metric
            label="PR-AUC"
            value="86.81%"
            />

            <Metric
            label="ROC-AUC"
            value="97.93%"
            />

            <Metric
            label="Threshold"
            value="3.00%"
            />

        </div>

    </div>
  )
}

export default ModelPerformance