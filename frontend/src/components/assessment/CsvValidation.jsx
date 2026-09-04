function CsvValidation({
  uploadedFile,
  csvValidation,
  csvError,
}) {
  return (
    <>
      {uploadedFile && (

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">


          {/* =================================================
              CSV HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                CSV Compatibility Check
              </p>

              <h3 className="mt-2 break-all text-xl font-semibold">
                {uploadedFile.name}
              </h3>

            </div>


            {csvValidation && (

              <span
                className={
                  csvValidation.compatible
                    ? 'rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300'
                    : 'rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300'
                }
              >

                {csvValidation.compatible
                  ? csvValidation.csvType === 'evaluation'
                    ? '✓ EVALUATION READY'
                    : '✓ PREDICTION READY'
                  : '✕ NOT COMPATIBLE'}

              </span>

            )}

          </div>


          {/* FILE ERROR */}

          {csvError && (

            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-5">

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-400">
                File Error
              </p>

              <p className="mt-2 text-sm leading-6 text-red-300">
                {csvError}
              </p>

            </div>

          )}


          {/* VALIDATION DETAILS */}

          {csvValidation && (

            <div className="mt-6">


              {/* SUMMARY */}

              <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    Columns Found
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {csvValidation.featureCount}
                  </p>

                </div>


                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    Columns Required
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {csvValidation.requiredCount}
                  </p>

                </div>


                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    Status
                  </p>

                  <p
                    className={
                      csvValidation.compatible
                        ? 'mt-2 text-lg font-bold text-emerald-400'
                        : 'mt-2 text-lg font-bold text-red-400'
                    }
                  >
                    {csvValidation.compatible
                      ? csvValidation.csvType === 'evaluation'
                        ? 'EVALUATION'
                        : 'PREDICTION'
                      : 'REJECTED'}
                  </p>

                </div>

              </div>


              {/* =================================================
                  FOUND COLUMNS
              ================================================= */}

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-5">

                <p className="text-sm font-semibold text-slate-300">
                  Columns Found
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {csvValidation.columns.map(
                    (column) => (

                      <span
                        key={column}
                        className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-300"
                      >
                        {column}
                      </span>

                    ),
                  )}

                </div>

              </div>


              {/* =================================================
                  MISSING FEATURES
              ================================================= */}

              {csvValidation.missingFeatures.length > 0 && (

                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-5">

                  <p className="text-sm font-semibold text-red-300">
                    Missing Required Features
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    These features are required by the
                    current XGBoost model but are missing
                    from the uploaded CSV.
                  </p>


                  <div className="mt-4 flex flex-wrap gap-2">

                    {csvValidation.missingFeatures.map(
                      (feature) => (

                        <span
                          key={feature}
                          className="rounded-md bg-red-500/10 px-3 py-1.5 text-xs text-red-300"
                        >
                          {feature}
                        </span>

                      ),
                    )}

                  </div>

                </div>

              )}


              {/* =================================================
                  UNEXPECTED COLUMNS
              ================================================= */}

              {csvValidation.unexpectedColumns.length > 0 && (

                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">

                  <p className="text-sm font-semibold text-amber-300">
                    Unexpected Columns
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    These columns are not part of the current
                    model schema.
                  </p>


                  <div className="mt-4 flex flex-wrap gap-2">

                    {csvValidation.unexpectedColumns.map(
                      (column) => (

                        <span
                          key={column}
                          className="rounded-md bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300"
                        >
                          {column}
                        </span>

                      ),
                    )}

                  </div>

                </div>

              )}


              {/* =================================================
                  DUPLICATES
              ================================================= */}

              {csvValidation.hasDuplicateColumns && (

                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-5">

                  <p className="text-sm font-semibold text-red-300">
                    Duplicate Column Names
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    The uploaded CSV contains duplicate
                    column names. Remove the duplicates
                    and upload the file again.
                  </p>

                </div>

              )}


              {/* =================================================
                  SUCCESS
              ================================================= */}

              {csvValidation.compatible && (

                <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">

                      <span className="text-emerald-400">
                        ✓
                      </span>

                    </div>


                    <div>

                      <p className="font-semibold text-emerald-300">

                        {csvValidation.csvType === 'evaluation'
                          ? 'Evaluation dataset is compatible'
                          : 'Prediction dataset is compatible'}

                      </p>


                      <p className="mt-1 text-sm leading-6 text-slate-500">

                        {csvValidation.csvType === 'evaluation'
                          ? 'The model features are valid and the Class column is available as ground truth for later evaluation.'
                          : 'The CSV contains the exact model features required for fraud-risk prediction.'}

                      </p>

                    </div>

                  </div>

                </div>

              )}


              {/* =================================================
                  CLASS COLUMN INFORMATION
              ================================================= */}

              {csvValidation.compatible &&
                csvValidation.hasClassColumn && (

                  <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">

                    <p className="text-sm font-semibold text-violet-300">
                      Ground-Truth Label Detected
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      This CSV contains a <span className="font-semibold text-violet-300">Class</span> column.
                      It will be treated as the actual transaction label for
                      evaluation only and will NOT be used as a model input.
                    </p>

                  </div>

              )}

            </div>

          )}

        </section>

      )}

    </>
  )
}

export default CsvValidation