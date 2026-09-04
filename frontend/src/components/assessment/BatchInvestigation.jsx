import { formatAmount } from '../../utils/formatting'
import RiskResultCard from '../risk/RiskResultCard'

function BatchInvestigation({
  selectedBatchRow,
  analyzing,
  apiOnline,
  apiError,
  riskResult,
  analyzeSelectedBatchTransaction,
  isHighRisk,
  probability,
  probabilityWidth,
  reviewed,
  approved,
  setReviewOpen,
  setApproved,
}) {
  return (
    <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-400">  Transaction Investigation  </p>

          <h4 className="mt-2 text-xl font-semibold text-white">  Transaction #{selectedBatchRow.result.row_number}  </h4>

          <p className="mt-2 text-sm text-slate-500">  Inspect the selected transaction using the live risk engine and SHAP explainability.  </p>

        </div>


        <button
          type="button"
          onClick={analyzeSelectedBatchTransaction}
          disabled={
            analyzing ||    !apiOnline ||    !selectedBatchRow
          }className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {analyzing ? (

            <>

              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              Analyzing...

            </>

          ) : !apiOnline ? (

            'Waiting for API...'

          ) : (

            'Investigate Transaction →'

          )}

        </button>

      </div>


      {/* SELECTED TRANSACTION SUMMARY */}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

          <p className="text-xs uppercase tracking-wide text-slate-600">  Amount </p>

          <p className="mt-2 text-lg font-semibold text-slate-200">
            {formatAmount(    selectedBatchRow.result.amount  )}
          </p>

        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

          <p className="text-xs uppercase tracking-wide text-slate-600">  Fraud Probability </p>

          <p className="mt-2 text-lg font-semibold text-slate-200">
            {Number(  selectedBatchRow.result.fraud_percentage  ).toFixed(4)}%
          </p>

        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

          <p className="text-xs uppercase tracking-wide text-slate-600">  Recommended Action  </p>

          <p className={`mt-2 text-lg font-semibold ${
                selectedBatchRow.result.recommended_action === 'ALLOW'
                ? 'text-emerald-400'
                : 'text-amber-400'
                }`}>  {selectedBatchRow.result.recommended_action}
          </p>

        </div>

      </div>


      {/* API ERROR */}

      {apiError && (

        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Investigation Error
          </p>

          <p className="mt-2 text-sm leading-6 text-red-300">
            {apiError}
          </p>

        </div>

      )}


      {riskResult && !analyzing && (

        <div className="mt-6">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-violet-400">
            SHAP Investigation
          </p>

          <RiskResultCard
            riskResult={riskResult}
            isHighRisk={isHighRisk}
            probability={probability}
            probabilityWidth={probabilityWidth}
            reviewed={reviewed}
            approved={approved}
            setReviewOpen={setReviewOpen}
            setApproved={setApproved}
          />

        </div>

      )}

    </div>
  )
}

export default BatchInvestigation
