function DemoTransactions({
  demoTransactions,
  dataLoading,
  dataError,
  selectedTransaction,
  analyzing,
  selectTransaction,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">
          Demo Transactions
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Select a real transaction from the fraud dataset.
        </p>
      </div>


      {/* Loading */}

      {dataLoading && (

        <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">
            Loading demo transactions...
          </p>
        </div>

      )}


      {/* Data error */}

      {dataError && (

        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-300">
            {dataError}
          </p>
        </div>

      )}


      <div className="space-y-4">


        {/* LEGITIMATE */}

        <button
          type="button"
          onClick={() =>
            selectTransaction(
              'legitimate',
            )
          }
          disabled={
            !demoTransactions ||
            analyzing
          }
          className={`
            group w-full rounded-xl border p-5 text-left transition
            disabled:cursor-not-allowed disabled:opacity-50

            ${
              selectedTransaction?.type ===
              'legitimate'
                ? 'border-emerald-500/60 bg-emerald-500/10'
                : 'border-slate-800 bg-slate-950 hover:border-emerald-500/40 hover:bg-emerald-500/5'
            }
          `}
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <span className="text-lg text-emerald-400">
                  ✓
                </span>
              </div>


              <div>
                <p className="font-semibold">
                  Legitimate Transaction
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Low-risk demonstration
                </p>
              </div>

            </div>


            <span className="text-slate-600 transition group-hover:text-emerald-400">
              →
            </span>

          </div>

        </button>


        {/* FRAUDULENT */}

        <button
          type="button"
          onClick={() =>
            selectTransaction(
              'fraudulent',
            )
          }
          disabled={
            !demoTransactions ||
            analyzing
          }
          className={`
            group w-full rounded-xl border p-5 text-left transition
            disabled:cursor-not-allowed disabled:opacity-50

            ${
              selectedTransaction?.type ===
              'fraudulent'
                ? 'border-red-500/60 bg-red-500/10'
                : 'border-slate-800 bg-slate-950 hover:border-red-500/40 hover:bg-red-500/5'
            }
          `}
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                <span className="text-lg font-bold text-red-400">
                  !
                </span>
              </div>


              <div>
                <p className="font-semibold">
                  Fraudulent Transaction
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  High-risk demonstration
                </p>
              </div>

            </div>


            <span className="text-slate-600 transition group-hover:text-red-400">
              →
            </span>

          </div>

        </button>

      </div>
    </div>
  )
}

export default DemoTransactions