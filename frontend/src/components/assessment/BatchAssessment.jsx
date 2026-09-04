function BatchAssessment({
  csvValidation,
  csvRows,
  analyzeCsv,
  batchLoading,
  apiOnline,
  batchProgress,
  batchError,
}) {
  return (
    <>
      {csvValidation?.compatible && csvRows.length > 0 && (

        <section className="mt-8 rounded-2xl border border-violet-500/20 bg-slate-900/70 p-6 shadow-2xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                Batch Assessment
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Analyze Uploaded Transactions
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {csvValidation.rowCount} transaction{csvValidation.rowCount === 1 ? '' : 's'} ready for the live XGBoost risk engine.
              </p>

            </div>


            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">

              {csvValidation.csvType === 'evaluation'
                ? 'Ground Truth Available'
                : 'Prediction Mode'}

            </span>

          </div>


          <button
            type="button"
            onClick={analyzeCsv}
            disabled={batchLoading || !apiOnline}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-violet-500 px-5 py-4 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {batchLoading ? (

              <>

                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                {batchProgress
                  ? `Analyzing ${batchProgress.processedRows.toLocaleString()} of ${batchProgress.totalRows.toLocaleString()} transactions...`
                  : `Preparing ${csvValidation.rowCount.toLocaleString()} transactions...`}

              </>

            ) : !apiOnline ? (

              'Waiting for API...'

            ) : (

              'Analyze CSV →'

            )}

          </button>


          {batchLoading && batchProgress && (

            <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">


              {/* PROGRESS HEADER */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">
                    Processing Transactions
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Running fraud-risk analysis through the live XGBoost engine.
                  </p>

                </div>


                <div className="shrink-0 rounded-lg border border-violet-500/20 bg-slate-950/60 px-3 py-2">

                  <p className="text-xs font-mono text-violet-300">
                    Chunk {batchProgress.currentChunk} / {batchProgress.totalChunks}
                  </p>

                </div>

              </div>


              {/* PROGRESS DETAILS */}

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    {batchProgress.processedRows.toLocaleString()} of{' '}
                    {batchProgress.totalRows.toLocaleString()} transactions
                  </span>

                  <span className="text-sm font-semibold text-violet-300">

                    {batchProgress.totalRows > 0
                      ? (
                          (batchProgress.processedRows /
                          batchProgress.totalRows) *
                          100
                        ).toFixed(0)
                      : 0}

                    %

                  </span>

                </div>


                {/* PROGRESS BAR */}

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        batchProgress.totalRows > 0
                          ? (
                              batchProgress.processedRows /
                              batchProgress.totalRows
                            ) * 100
                          : 0
                      }%`,
                    }}
                  />

                </div>


                {/* STATUS */}

                <div className="mt-3 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">

                  <span className="text-slate-600">
                    Processing batch {batchProgress.currentChunk} of{' '}
                    {batchProgress.totalChunks}
                  </span>

                  <span className="font-mono text-slate-500">
                    {batchProgress.processedRows.toLocaleString()} /{' '}
                    {batchProgress.totalRows.toLocaleString()} processed
                  </span>

                </div>

              </div>

            </div>

          )}


          {batchError && (

            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-5">

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-400">
                CSV Analysis Failed
              </p>

              <p className="mt-2 text-sm leading-6 text-red-300">
                {batchError}
              </p>

            </div>

          )}

        </section>

      )}

    </>
  )
}

export default BatchAssessment