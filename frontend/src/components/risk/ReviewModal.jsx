function ReviewModal({
  reviewOpen,
  riskResult,
  setReviewOpen,
  setReviewed,
}) {
  return (

    <>
      {/* ======================================================
          REVIEW MODAL
      ====================================================== */}

      {reviewOpen && riskResult && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6">

          <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl sm:p-6">


            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                  Risk Review
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Transaction Review
                </h3>

              </div>


              <button
                type="button"
                onClick={() =>
                  setReviewOpen(false)
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                ×
              </button>

            </div>


            {/* RISK SUMMARY */}

            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Transaction Risk
                  </p>

                  <p className="mt-1 text-2xl font-bold text-red-400">
                    {riskResult.risk_level} RISK
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-sm text-slate-500">
                    Fraud Probability
                  </p>

                  <p className="mt-1 text-2xl font-bold">

                    {Number(
                      riskResult.fraud_percentage,
                    ).toFixed(4)}%

                  </p>

                </div>

              </div>

            </div>


            {/* ACTION */}

            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">

              <p className="text-sm text-slate-500">
                Recommended Action
              </p>

              <p className="mt-1 text-xl font-bold text-amber-300">
                REVIEW
              </p>

            </div>


            {/* SHAP DETAILS */}

            <div className="mt-6">

              <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
                Explainability
              </p>

              <h4 className="mt-2 text-lg font-semibold">
                Why was this transaction flagged?
              </h4>


              <div className="mt-5 space-y-4">

                {(riskResult.top_features ?? []).map(
                  (item) => (

                    <div
                      key={item.feature}
                      className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div>

                          <span className="font-semibold">
                            {item.feature}
                          </span>

                          <span className="ml-3 text-sm text-slate-500">
                            {item.direction}
                          </span>

                        </div>


                        <span
                          className={
                            Number(
                              item.shap_value,
                            ) > 0
                              ? 'shrink-0 font-mono text-red-400'
                              : 'shrink-0 font-mono text-emerald-400'
                          }
                        >

                          {Number(
                            item.shap_value,
                          ) >= 0
                            ? '+'
                            : ''}

                          {Number(
                            item.shap_value,
                          ).toFixed(4)}

                        </span>

                      </div>

                    </div>

                  ),
                )}

              </div>

            </div>


            {/* MODAL ACTIONS */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  setReviewOpen(false)
                }
                className="flex-1 rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Close
              </button>


              <button
                type="button"
                onClick={() => {
                  setReviewed(true)
                  setReviewOpen(false)
                }}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                ✓ Mark as Reviewed
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  )
}

export default ReviewModal