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
  children,
}) {
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
          BACK
      ================================================= */}

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
        className="mt-8 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
      >
        ← Back to Dashboard
      </button>

    </div>
  )
}

export default NewAssessment