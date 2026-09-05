import { useState } from 'react'
function NewAssessment({
  
  setNewAssessment,
  setAssessmentMode,
  setSelectedTransaction,
  setRiskResult,
  setApiError,
  setCustomError,
  setUploadedFile,
  setCsvValidation,
  setCsvError,
  setCsvRows,
  setBatchResult,
  setBatchError,
  setBatchLoading,
  loadDataset,
  children,
}) {
  const [selectedDataset, setSelectedDataset] = useState('')
  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
          New Assessment
        </p>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Assess a New Transaction
        </h2>

        <p className="mt-3 max-w-2xl text-slate-400">
          Choose how you want to provide the transaction
          for fraud-risk analysis.
        </p>
      </div>

      {children}

      {/* =================================================
          BOTTOM ACTIONS
      ================================================= */}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* BACK TO DASHBOARD */}
        <button
          type="button"
          onClick={() => {
            setNewAssessment(false)
            setAssessmentMode(null)
            setSelectedTransaction(null)
            setRiskResult(null)
            setApiError(null)
            setCustomError(null)
            setUploadedFile(null)
            setCsvValidation(null)
            setCsvError(null)
            setCsvRows([])
            setBatchResult(null)
            setBatchError(null)
            setBatchLoading(false)
          }}
          className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
        >
          ← Back to Dashboard
        </button>


        {/* DATASET SELECTOR */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          <select
            value={selectedDataset}
            onChange={(event) => setSelectedDataset(event.target.value)}
            className="min-w-[280px] rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          >
            <option value="" disabled>
              Use Sample Datasets
            </option>

            <option value="synthetic">
              Synthetic_fraud_transactions_10000.csv
            </option>

            <option value="invalid">
              Invalid_fraud_test.csv
            </option>

            <option value="sample">
              Sample Demo Dataset
            </option>
          </select>

          <button
            type="button"
            onClick={() => loadDataset(selectedDataset)}
            className="rounded-lg border border-violet-500/40 px-5 py-3 text-sm font-semibold text-violet-400 transition hover:border-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
          >
            Load Dataset →
          </button>

        </div>

      </div>

    </div>
  )
}

export default NewAssessment
