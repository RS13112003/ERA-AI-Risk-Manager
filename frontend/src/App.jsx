import Header from './components/Header'

import DashboardHeader from './components/dashboard/DashboardHeader'
import DemoTransactions from './components/dashboard/DemoTransactions'
import SelectedTransaction from './components/dashboard/SelectedTransaction'
import RiskAssessment from './components/dashboard/RiskAssessment'
import ShapExplanation from './components/dashboard/ShapExplanation'
import ModelPerformance from './components/dashboard/ModelPerformance'
import BusinessImpact from './components/dashboard/BusinessImpact'

import NewAssessment from './components/assessment/NewAssessment'
import AssessmentOptions from './components/assessment/AssessmentOptions'
import CustomTransactionForm from './components/assessment/CustomTransactionForm'
import CsvValidation from './components/assessment/CsvValidation'
import BatchAssessment from './components/assessment/BatchAssessment'
import BatchResults from './components/assessment/BatchResults'
import HighRiskQueue from './components/assessment/HighRiskQueue'
import TransactionResultsTable from './components/assessment/TransactionResultsTable'
import BatchInvestigation from './components/assessment/BatchInvestigation'

import ReviewModal from './components/risk/ReviewModal'

import useRiskManager from './hooks/useRiskManager'


// ============================================================
// APP
// ============================================================

function App() {
  const {
    demoTransactions,
    selectedTransaction,
    dataLoading,
    dataError,
    apiOnline,

    riskResult,
    analyzing,
    apiError,

    reviewOpen,
    reviewed,
    approved,

    newAssessment,
    setNewAssessment,
    assessmentMode,
    setAssessmentMode,

    customTransaction,
    customError,
    setCustomTransaction,

    uploadedFile,
    csvValidation,
    csvError,
    csvRows,

    batchResult,
    batchLoading,
    batchError,
    selectedBatchRow,
    batchProgress,

    startNewAssessment,
    selectTransaction,
    openCustomTransaction,
    handleCustomInputChange,
    validateCustomTransaction,
    validateCsvFile,
    analyzeCsv,
    selectBatchTransaction,
    analyzeSelectedBatchTransaction,
    analyzeTransaction,

    isHighRisk,
    probability,
    probabilityWidth,
    positiveFeatures,
    negativeFeatures,
    highRiskTransactions,
    isLargeBatch,

    setReviewOpen,
    setReviewed,
    setApproved,
    reviewedBatchRows,
    markCurrentTransactionReviewed,

    setSelectedTransaction,
    setRiskResult,
    setApiError,
    setCustomError,
    setUploadedFile,
    setCsvValidation,
    setCsvError,
    setCsvRows,
    setBatchResult,
    setBatchLoading,
    setBatchError,
    setSelectedBatchRow,
    setBatchProgress,
  } = useRiskManager()

  return (

    <div className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
        style={{
            backgroundImage: "url('/RiskBackground.png')",
        }}
    >
    <div className="pointer-events-none fixed inset-0 -z-0 bg-slate-950/75" />
     <div className="relative z-10">
      <Header
        apiOnline={apiOnline}
      />

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">

        {newAssessment ? (

          <NewAssessment
            newAssessment={newAssessment}
            setNewAssessment={setNewAssessment}
            setAssessmentMode={setAssessmentMode}
            setSelectedTransaction={setSelectedTransaction}
            setRiskResult={setRiskResult}
            setApiError={setApiError}
            setCustomError={setCustomError}
            setReviewOpen={setReviewOpen}
            setReviewed={setReviewed}
            setApproved={setApproved}
            setCustomTransaction={setCustomTransaction}
            setUploadedFile={setUploadedFile}
            setCsvValidation={setCsvValidation}
            setCsvError={setCsvError}
            setCsvRows={setCsvRows}
            setBatchResult={setBatchResult}
            setBatchError={setBatchError}
            setBatchLoading={setBatchLoading}
            setSelectedBatchRow={setSelectedBatchRow}
            setBatchProgress={setBatchProgress}
            startNewAssessment={startNewAssessment}
            onBack={() => setNewAssessment(false)}
          >

            <AssessmentOptions
              demoTransactions={demoTransactions}
              dataLoading={dataLoading}
              dataError={dataError}
              assessmentMode={assessmentMode}
              setAssessmentMode={setAssessmentMode}
              selectTransaction={selectTransaction}
              openCustomTransaction={openCustomTransaction}
              validateCsvFile={validateCsvFile}
              onSelectTransaction={selectTransaction}
              onOpenCustomTransaction={openCustomTransaction}
              onUploadCsv={validateCsvFile}
            />

            {uploadedFile && (
              <CsvValidation
                uploadedFile={uploadedFile}
                csvValidation={csvValidation}
                csvError={csvError}
                csvRows={csvRows}
                setCsvValidation={setCsvValidation}
                validateCsvFile={validateCsvFile}
              />
            )}

            {csvValidation?.compatible && csvRows.length > 0 && (
              <BatchAssessment
                csvValidation={csvValidation}
                csvRows={csvRows}
                batchLoading={batchLoading}
                batchProgress={batchProgress}
                apiOnline={apiOnline}
                analyzeCsv={analyzeCsv}
                batchError={batchError}
              />
            )}

            {batchResult && (
              <BatchResults
                batchResult={batchResult}
                batchError={batchError}
                isLargeBatch={isLargeBatch}
                selectedBatchRow={selectedBatchRow}
                selectBatchTransaction={selectBatchTransaction}
              />
            )}

            {batchResult && (
  <>
              {isLargeBatch ? (
                <HighRiskQueue
                  batchResult={batchResult}
                  highRiskTransactions={highRiskTransactions}
                  selectedBatchRow={selectedBatchRow}
                  selectBatchTransaction={selectBatchTransaction}
                  reviewedBatchRows={reviewedBatchRows}
                />
              ) : (
                <TransactionResultsTable
                  batchResult={batchResult}
                  selectedBatchRow={selectedBatchRow}
                  selectBatchTransaction={selectBatchTransaction}
                />
              )}
            </>
          )}

            {selectedBatchRow && (
              <BatchInvestigation
                selectedBatchRow={selectedBatchRow}
                analyzing={analyzing}
                apiOnline={apiOnline}
                apiError={apiError}
                riskResult={riskResult}
                analyzeSelectedBatchTransaction={
                  analyzeSelectedBatchTransaction
                }
                isHighRisk={isHighRisk}
                probability={probability}
                probabilityWidth={probabilityWidth}
                positiveFeatures={positiveFeatures}
                negativeFeatures={negativeFeatures}
                reviewed={reviewed}
                approved={approved}
                setReviewOpen={setReviewOpen}
                setApproved={setApproved}
              />
            )}

            {assessmentMode === 'custom' && (
              <CustomTransactionForm
                customTransaction={customTransaction}
                customError={customError}
                handleCustomInputChange={handleCustomInputChange}
                analyzing={analyzing}
                apiOnline={apiOnline}
                apiError={apiError}
                riskResult={riskResult}
                analyzeTransaction={analyzeTransaction}
                isHighRisk={isHighRisk}
                probability={probability}
                probabilityWidth={probabilityWidth}
                reviewed={reviewed}
                approved={approved}
                setReviewOpen={setReviewOpen}
                setApproved={setApproved}
              />
            )}

          </NewAssessment>

        ) : (

          <>

            <DashboardHeader
              startNewAssessment={startNewAssessment}
              onNewAssessment={startNewAssessment}
            />

            <section className="grid gap-6 lg:grid-cols-2">

              <div className="rounded-2xl border border border-white/10 bg-slate-900/65 backdrop-blur-xl p-6 shadow-2xl">

                <DemoTransactions
                  demoTransactions={demoTransactions}
                  dataLoading={dataLoading}
                  dataError={dataError}
                  selectedTransaction={selectedTransaction}
                  selectTransaction={selectTransaction}
                />

                <SelectedTransaction
                  selectedTransaction={selectedTransaction}
                  analyzing={analyzing}
                  apiOnline={apiOnline}
                  apiError={apiError}
                  riskResult={riskResult}
                  analyzeTransaction={analyzeTransaction}
                  isHighRisk={isHighRisk}
                  probability={probability}
                  probabilityWidth={probabilityWidth}
                  reviewed={reviewed}
                  approved={approved}
                  setReviewOpen={setReviewOpen}
                  setApproved={setApproved}
                />

              </div>


              <RiskAssessment
                riskResult={riskResult}
                analyzing={analyzing}
                apiError={apiError}
                isHighRisk={isHighRisk}
                probability={probability}
                probabilityWidth={probabilityWidth}
                reviewed={reviewed}
                approved={approved}
                setReviewOpen={setReviewOpen}
                setApproved={setApproved}
              />

            </section>

            

            <ShapExplanation
              riskResult={riskResult}
              positiveFeatures={positiveFeatures}
              negativeFeatures={negativeFeatures}
            />

            <section className="mt-6 grid gap-6 lg:grid-cols-2">

                <ModelPerformance />

                <BusinessImpact />

            </section>

          </>

        )}

      </main>
      
        <div className="mt-10 border-t border-slate-800">

            <footer className="mx-auto max-w-7xl py-6 text-center">

                <p className="text-sm font-semibold text-slate-400">
                    AI Risk Manager | XGBoost + SHAP | Razorpay AI Buildathon
                </p>

            </footer>

        </div>

      <ReviewModal
        reviewOpen={reviewOpen}
        riskResult={riskResult}
        setReviewOpen={setReviewOpen}
        // setReviewed={setReviewed}
        setReviewed={markCurrentTransactionReviewed}
      />
    </div>
    </div>
  )
}


export default App
