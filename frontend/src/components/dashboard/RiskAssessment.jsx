import RiskResultCard from '../risk/RiskResultCard'

function RiskAssessment({
  riskResult,
  analyzing,
  isHighRisk,
  probability,
  probabilityWidth,
  reviewed,
  approved,
  setReviewOpen,
  setApproved,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">

        <div className="mb-6 flex items-start justify-between">

            <div>

            <h3 className="text-lg font-semibold">
                Risk Assessment
            </h3>

            <p className="mt-1 text-sm text-slate-500">
                AI-powered transaction decision
            </p>

            </div>


            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">

            {riskResult  ? 'Live'  : 'Awaiting Analysis'}

            </span>

        </div>


      {/* NO RESULT */}

      {!riskResult && !analyzing && (

        <div className="flex min-h-[330px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/50">

            <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900">

                    <span className="text-2xl text-slate-600">   ?  </span>

                </div>

                <p className="mt-4 font-semibold text-slate-400">
                    No assessment yet
                </p>

                <p className="mt-2 text-sm text-slate-600">
                    Select a transaction and click Analyze.
                </p>

            </div>

        </div>

      )}


      {/* ANALYZING */}

      {analyzing && (

        <div className="flex min-h-[330px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">

            <div className="text-center">

                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-400" />

                    <p className="mt-5 font-semibold text-slate-300">
                        Running AI risk assessment...
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                        XGBoost + SHAP
                    </p>

            </div>

        </div>

      )}


      {/* REAL RESULT */}

      {riskResult && !analyzing && (

        <RiskResultCard
          riskResult={riskResult}
          isHighRisk={
            isHighRisk
          }
          probability={
            probability
          }
          probabilityWidth={
            probabilityWidth
          }
          reviewed={
            reviewed
          }
          approved={
            approved
          }
          setReviewOpen={
            setReviewOpen
          }
          setApproved={
            setApproved
          }
        />

      )}

    </div>
  )
}

export default RiskAssessment