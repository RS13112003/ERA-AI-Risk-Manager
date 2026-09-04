RiskResultCard.jsx


function RiskResultCard({
  riskResult,
  isHighRisk,
  probability,
  probabilityWidth,
  reviewed,
  approved,
  setReviewOpen,
  setApproved,
}) {
  const thresholdPercent =
    Number(riskResult.threshold) * 100

  const thresholdPosition = Math.min(
    Math.max(thresholdPercent, 0),
    100,
  )

  return (
    <>
      {/* ========================================================
          RISK STATUS
      ======================================================== */}

      <div
        className={
          isHighRisk
            ? 'rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-red-500/5 to-slate-950 p-6'
            : 'rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-slate-950 p-6'
        }
      >
        <div className="flex items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <span
                className={
                  isHighRisk
                    ? 'h-2 w-2 rounded-full bg-red-400'
                    : 'h-2 w-2 rounded-full bg-emerald-400'
                }
              />

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Transaction Risk
              </p>

            </div>

            <p
              className={
                isHighRisk
                  ? 'mt-2 text-3xl font-bold tracking-tight text-red-400'
                  : 'mt-2 text-3xl font-bold tracking-tight text-emerald-400'
              }
            >
              {riskResult.risk_level} RISK
            </p>

            <p className="mt-2 text-xs text-slate-600">
              {isHighRisk
                ? 'This transaction exceeds the configured risk threshold.'
                : 'This transaction remains below the configured risk threshold.'}
            </p>

          </div>


          <div
            className={
              isHighRisk
                ? 'flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10'
                : 'flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10'
            }
          >

            <span
              className={
                isHighRisk
                  ? 'text-2xl font-bold text-red-400'
                  : 'text-2xl font-bold text-emerald-400'
              }
            >
              {isHighRisk ? '!' : '✓'}
            </span>

          </div>

        </div>
      </div>


      {/* ========================================================
          FRAUD PROBABILITY
      ======================================================== */}

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-6">

        <div className="flex items-end justify-between gap-4">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Fraud Probability
            </p>

            <p
              className={
                isHighRisk
                  ? 'mt-2 text-4xl font-bold tracking-tight text-red-400'
                  : 'mt-2 text-4xl font-bold tracking-tight text-emerald-400'
              }
            >
              {probability.toFixed(4)}%
            </p>

          </div>


          <div className="text-right">

            <p className="text-xs uppercase tracking-wide text-slate-600">
              Decision Threshold
            </p>

            <p className="mt-1 text-sm font-semibold text-cyan-400">
              {thresholdPercent.toFixed(2)}%
            </p>

          </div>

        </div>


        {/* PROBABILITY BAR */}

        <div className="mt-6">

          <div className="relative">

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">

              <div
                className={
                  isHighRisk
                    ? 'h-full rounded-full bg-red-500 transition-all duration-700 ease-out'
                    : 'h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out'
                }
                style={{
                  width: `${probabilityWidth}%`,
                }}
              />

            </div>


            {/* THRESHOLD MARKER */}

            <div
              className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]"
              style={{
                left: `${thresholdPosition}%`,
              }}
            />

          </div>


          <div className="mt-3 flex items-center justify-between text-[11px]">

            <span className="text-slate-600">
              0%
            </span>

            <span className="text-cyan-400">
              Threshold {thresholdPercent.toFixed(2)}%
            </span>

            <span className="text-slate-600">
              100%
            </span>

          </div>

        </div>

      </div>


      {/* ========================================================
          RECOMMENDED ACTION
      ======================================================== */}

      <div
        className={
          riskResult.recommended_action === 'REVIEW'
            ? 'mt-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-slate-950 p-6'
            : 'mt-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-slate-950 p-6'
        }
      >

        <div className="flex items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <span
                className={
                  riskResult.recommended_action === 'REVIEW'
                    ? 'h-2 w-2 rounded-full bg-amber-400'
                    : 'h-2 w-2 rounded-full bg-emerald-400'
                }
              />

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Recommended Action
              </p>

            </div>

            <p
              className={
                riskResult.recommended_action === 'REVIEW'
                  ? 'mt-2 text-2xl font-bold text-amber-300'
                  : 'mt-2 text-2xl font-bold text-emerald-300'
              }
            >
              {reviewed
                ? 'REVIEWED'
                : approved
                ? 'APPROVED'
                : riskResult.recommended_action}
            </p>

          </div>


          <span
            className={
              riskResult.recommended_action === 'REVIEW'
                ? 'text-2xl text-amber-400'
                : 'text-2xl text-emerald-400'
            }
          >
            →
          </span>

        </div>


        {/* REVIEW BUTTON */}

        {riskResult.recommended_action === 'REVIEW' &&
        !reviewed && (

          <button
            type="button"
            onClick={() => setReviewOpen(true)}
            className="mt-5 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5 font-semibold text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-500/20"
          >
            Review Transaction
          </button>

        )}


        {/* APPROVE BUTTON */}

        {riskResult.recommended_action === 'ALLOW' &&
        !approved && (

          <button
            type="button"
            onClick={() => setApproved(true)}
            className="mt-5 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 font-semibold text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-500/20"
          >
            Approve Transaction
          </button>

        )}


        {/* REVIEWED */}

        {reviewed && (

          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-center text-sm font-semibold text-emerald-300">
            ✓ Transaction reviewed successfully
          </div>

        )}


        {/* APPROVED */}

        {approved && (

          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-center text-sm font-semibold text-emerald-300">
            ✓ Transaction approved successfully
          </div>

        )}

      </div>

    </>
  )
}

export default RiskResultCard