import InputField from '../common/InputField'
import RiskResultCard from '../risk/RiskResultCard'
import { MODEL_FEATURES } from '../../constants/modelSchema'



function CustomTransactionForm({
  customTransaction,
  customError,
  handleCustomInputChange,
  analyzing,
  apiOnline,
  apiError,
  riskResult,
  analyzeTransaction,
  isHighRisk,
  probability,
  probabilityWidth,
  reviewed,
  approved,
  setReviewOpen,
  setApproved,
}) {
  return (
    <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-2xl">


      {/* FORM HEADER */}

      <div className="mb-8">

        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
          Custom Transaction
        </p>

        <h3 className="mt-2 text-2xl font-semibold">
          Model-Compatible Transaction Input
        </h3>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Enter the values for one transaction.
          The current XGBoost model accepts exactly
          30 numeric inputs: Time, V1–V28 and Amount.
        </p>

      </div>


      {/* VALIDATION ERROR */}

      {customError && (

        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Input Not Compatible
          </p>

          <p className="mt-2 text-sm leading-6 text-red-300">
            {customError}
          </p>

        </div>

      )}


      {/* TRANSACTION INFO */}

      <div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Transaction Information
        </p>


        <div className="grid gap-4 sm:grid-cols-2">

          <InputField
            feature="Time"
            value={
              customTransaction.Time
            }
            onChange={
              handleCustomInputChange
            }
          />


          <InputField
            feature="Amount"
            value={
              customTransaction.Amount
            }
            onChange={
              handleCustomInputChange
            }
          />

        </div>

      </div>


      {/* MODEL FEATURES */}

      <div className="mt-8">

        <div className="mb-4">

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Model Features
          </p>

          <p className="mt-1 text-xs text-slate-600">
            PCA feature values required by the current
            fraud detection model.
          </p>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {MODEL_FEATURES
            .filter(
              (feature) =>
                feature !== 'Time' &&
                feature !== 'Amount',
            )
            .map((feature) => (

              <InputField
                key={feature}
                feature={feature}
                value={
                  customTransaction[
                    feature
                  ]
                }
                onChange={
                  handleCustomInputChange
                }
              />

            ))}

        </div>

      </div>


      {/* COMPATIBILITY NOTE */}

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/70 p-5">

        <div className="flex items-start gap-3">

          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">

            <span className="text-sm text-cyan-400">
              i
            </span>

          </div>


          <div>

            <p className="text-sm font-semibold text-slate-300">
              Model Compatibility
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              This model accepts the exact feature
              representation used during training.
              Missing values or non-numeric values
              are rejected before analysis.
            </p>

          </div>

        </div>

      </div>


      {/* ANALYZE CUSTOM */}

      <button
        type="button"
        onClick={
          analyzeTransaction
        }
        disabled={
          analyzing ||
          !apiOnline
        }
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-500 px-5 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >

        {analyzing ? (

          <>

            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

            Analyzing Transaction...

          </>

        ) : !apiOnline ? (

          'Waiting for API...'

        ) : (

          'Analyze Custom Transaction'

        )}

      </button>


      {/* API ERROR */}

      {apiError && (

        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
            API Error
          </p>

          <p className="mt-2 text-sm leading-6 text-red-300">
            {apiError}
          </p>

        </div>

      )}


      {/* CUSTOM RESULT */}

      {riskResult && !analyzing && (

        <div className="mt-8">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Assessment Result
          </p>

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

        </div>

      )}

    </section>
  )
}

export default CustomTransactionForm
