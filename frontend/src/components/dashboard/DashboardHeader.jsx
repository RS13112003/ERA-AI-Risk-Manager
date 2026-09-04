function DashboardHeader({
  startNewAssessment,
}) {
  return (
    <div className="mb-10">
      <div>
            <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">    Transaction Intelligence  </p>
            </div>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">  Fraud Risk Assessment </h2>

            {/* EXISTING NEW ASSESSMENT BUTTON */}

            <button  type="button"

                onClick={ startNewAssessment  }
                className="group inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
                <span className="text-lg font-bold transition-transform duration-300 group-hover:rotate-90"> + </span>
                <span>  New Assessment  </span>

            </button>
            </div>


            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
                Analyze a transaction using the trained XGBoost  fraud detection model and understand why the model  made its decision.
            </p>
      </div>
    </div>
  )
}

export default DashboardHeader