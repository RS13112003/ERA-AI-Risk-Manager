function AssessmentOptions({
  demoTransactions,
  setAssessmentMode,
  selectTransaction,
  openCustomTransaction,
  validateCsvFile,
}) {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">


      {/* =================================================
          DEMO LEGITIMATE
      ================================================= */}

      <button
        type="button"
        onClick={() => {
          setAssessmentMode('demo')
          selectTransaction(
            'legitimate',
          )
        }}
        disabled={!demoTransactions}
        className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-2xl transition hover:border-emerald-500/50 hover:bg-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
          <span className="text-xl text-emerald-400">
            ✓
          </span>
        </div>


        <h3 className="mt-5 text-lg font-semibold">
          Demo Legitimate
        </h3>


        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use the real legitimate transaction from
          the current fraud dataset.
        </p>


        <p className="mt-5 font-semibold text-emerald-400">
          Use Demo →
        </p>

      </button>


      {/* =================================================
          DEMO FRAUDULENT
      ================================================= */}

      <button
        type="button"
        onClick={() => {
          setAssessmentMode('demo')
          selectTransaction(
            'fraudulent',
          )
        }}
        disabled={!demoTransactions}
        className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-2xl transition hover:border-red-500/50 hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
          <span className="text-xl font-bold text-red-400">
            !
          </span>
        </div>


        <h3 className="mt-5 text-lg font-semibold">
          Demo Fraudulent
        </h3>


        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use the real fraudulent transaction from
          the current fraud dataset.
        </p>


        <p className="mt-5 font-semibold text-red-400">
          Use Demo →
        </p>

      </button>


      {/* =================================================
          CUSTOM TRANSACTION
      ================================================= */}

      <button
        type="button"
        onClick={() => {
          openCustomTransaction()
        }}
        className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-2xl transition hover:border-cyan-500/50 hover:bg-cyan-500/5"
      >

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
          <span className="text-xl text-cyan-400">
            +
          </span>
        </div>


        <h3 className="mt-5 text-lg font-semibold">
          Custom Transaction
        </h3>


        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter a new transaction using the feature
          schema expected by the trained model.
        </p>


        <p className="mt-5 font-semibold text-cyan-400">
          Enter Data →
        </p>

      </button>


      {/* =================================================
          UPLOAD CSV
      ================================================= */}

      <label 
        onClick={() => setAssessmentMode('csv')}
        className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl transition hover:border-violet-500/50 hover:bg-violet-500/5">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">

          <span className="text-xl text-violet-400">    ↑ </span>

        </div>


        <h3 className="mt-5 text-lg font-semibold">    Upload CSV    </h3>


        <p className="mt-2 text-sm leading-6 text-slate-500">
          Upload a CSV and check whether its columns match the current fraud model.
        </p>


        <span className="mt-5 inline-flex cursor-pointer font-semibold text-violet-400 transition hover:text-violet-300">

          Choose CSV →

          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {

              const file = event.target.files?.[0]

              validateCsvFile(file)

              // Allow selecting the same file again.
              event.target.value = ''

            }}
          />

        </span>

      </label>

    </section>
  )
}

export default AssessmentOptions