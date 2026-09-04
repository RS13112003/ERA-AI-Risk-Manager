import { useEffect, useState } from 'react'

const API_URL = 'http://127.0.0.1:8000/api/assess-risk'


// ============================================================
// CURRENT MODEL FEATURE SCHEMA
// ============================================================
//
// Exact feature names expected by the current XGBoost model.
//
// IMPORTANT:
// We do NOT rename arbitrary user columns to V1, V2, etc.
// Uploaded CSV files must use this exact schema.
//

const MODEL_FEATURES = [
  'Time',  'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 
  'V15', 'V16', 'V17', 'V18','V19', 'V20', 'V21', 'V22','V23', 'V24', 'V25', 'V26', 'V27', 'V28','Amount',
]

const OPTIONAL_LABEL_COLUMNS = [
  'Class',
]


// ============================================================
// CREATE EMPTY CUSTOM TRANSACTION
// ============================================================

function createEmptyTransaction() {
  return MODEL_FEATURES.reduce(
    (transaction, feature) => {
      transaction[feature] = ''
      return transaction
    },
    {},
  )
}


// ============================================================
// USE RISK MANAGER
// ============================================================

function useRiskManager() {

  // ============================================================
  // DEMO TRANSACTION STATE
  // ============================================================

  const [demoTransactions, setDemoTransactions] =  useState(null)

  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const [dataLoading, setDataLoading] = useState(true)

  const [dataError, setDataError] = useState(null)

  const [apiOnline, setApiOnline] = useState(false)


  // ============================================================
  // API / RISK STATE
  // ============================================================

  const [riskResult, setRiskResult] =
    useState(null)

  const [analyzing, setAnalyzing] =
    useState(false)

  const [apiError, setApiError] =
    useState(null)


  // ============================================================
  // ACTION STATE
  // ============================================================

  const [reviewOpen, setReviewOpen] =  useState(false)

  const [reviewed, setReviewed] =  useState(false)

  const [approved, setApproved] =  useState(false)
  const [reviewedBatchRows, setReviewedBatchRows] = useState([])

  // ============================================================
  // NEW ASSESSMENT STATE
  // ============================================================

  const [newAssessment, setNewAssessment] =
    useState(false)

  const [assessmentMode, setAssessmentMode] =
    useState(null)


  // ============================================================
  // CUSTOM TRANSACTION STATE
  // ============================================================

  const [customTransaction, setCustomTransaction] =
    useState(createEmptyTransaction())

  const [customError, setCustomError] =
    useState(null)


  // ============================================================
  // CSV UPLOAD / VALIDATION STATE
  // ============================================================

  const [uploadedFile, setUploadedFile] =  useState(null)

  const [csvValidation, setCsvValidation] =  useState(null)

  const [csvError, setCsvError] =  useState(null)

  const [csvRows, setCsvRows] =  useState([])

  const [batchResult, setBatchResult] =  useState(null)

  const [batchLoading, setBatchLoading] =  useState(false)

  const [batchError, setBatchError] =  useState(null)

  const [selectedBatchRow, setSelectedBatchRow] = useState(null)

  const [batchProgress, setBatchProgress] = useState(null)


  // ============================================================
  // LOAD DEMO TRANSACTIONS
  // ============================================================

  useEffect(() => {
    fetch('/demo-transactions.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            'Failed to load demo transactions',
          )
        }

        return response.json()
      })
      .then((data) => {
        setDemoTransactions(data)
        setDataLoading(false)
      })
      .catch((error) => {
        console.error(
          'Demo transaction loading error:',
          error,
        )

        setDataError(
          'Unable to load demo transactions.',
        )

        setDataLoading(false)
      })
  }, [])


  // ============================================================
  // API HEALTH CHECK
  // ============================================================

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/health',
        )

        if (!response.ok) {
          throw new Error(
            'API health check failed',
          )
        }

        setApiOnline(true)
      } catch (error) {
        console.error(
          'API health check error:',
          error,
        )

        setApiOnline(false)
      }
    }

    checkApiHealth()

    const interval = setInterval(
      checkApiHealth,
      10000,
    )

    return () => clearInterval(interval)
  }, [])


  // ============================================================
  // START NEW ASSESSMENT
  // ============================================================

  const startNewAssessment = () => {
    setNewAssessment(true)

    setAssessmentMode(null)

    setSelectedTransaction(null)

    setRiskResult(null)

    setApiError(null)

    setCustomError(null)

    setReviewOpen(false)

    setReviewed(false)

    setApproved(false)

    setCustomTransaction(
      createEmptyTransaction(),
    )

    setUploadedFile(null)

    setCsvValidation(null)

    setCsvError(null)
    setCsvRows([])
    setBatchResult(null)
    setBatchError(null)
    setBatchLoading(false)
  }


  // ============================================================
  // SELECT DEMO TRANSACTION
  // ============================================================

  const selectTransaction = (type) => {
    if (
      !demoTransactions ||
      !demoTransactions[type]
    ) {
      return
    }

    setSelectedTransaction({
      type,
      data: demoTransactions[type],
    })

    setRiskResult(null)

    setApiError(null)

    setCustomError(null)

    setReviewOpen(false)

    setReviewed(false)

    setApproved(false)

    setNewAssessment(false)

    setAssessmentMode('demo')
  }


  // ============================================================
  // OPEN CUSTOM TRANSACTION
  // ============================================================

  const openCustomTransaction = () => {
    setAssessmentMode('custom')

    setSelectedTransaction(null)

    setRiskResult(null)

    setApiError(null)

    setCustomError(null)

    setReviewOpen(false)

    setReviewed(false)

    setApproved(false)

    setCustomTransaction(
      createEmptyTransaction(),
    )

    setUploadedFile(null)
    setCsvValidation(null)
    setCsvError(null)
    setCsvRows([])
    setBatchResult(null)
    setBatchError(null)
    setBatchLoading(false)
  }


  // ============================================================
  // HANDLE CUSTOM INPUT
  // ============================================================

  const handleCustomInputChange = (
    feature,
    value,
  ) => {
    setCustomTransaction((previous) => ({
      ...previous,
      [feature]: value,
    }))

    setCustomError(null)

    setApiError(null)

    setRiskResult(null)

    setReviewed(false)

    setApproved(false)
  }


  // ============================================================
  // VALIDATE CUSTOM TRANSACTION
  // ============================================================

  const validateCustomTransaction = () => {

    // ----------------------------------------------------------
    // MISSING VALUES
    // ----------------------------------------------------------

    const missingFeatures =
      MODEL_FEATURES.filter(
        (feature) =>
          customTransaction[feature] === '' ||
          customTransaction[feature] === null ||
          customTransaction[feature] === undefined,
      )

    if (missingFeatures.length > 0) {
      setCustomError(
        `Missing required values: ${missingFeatures.join(', ')}`,
      )

      return false
    }


    // ----------------------------------------------------------
    // NON-NUMERIC VALUES
    // ----------------------------------------------------------

    const invalidFeatures =
      MODEL_FEATURES.filter(
        (feature) =>
          !Number.isFinite(
            Number(
              customTransaction[feature],
            ),
          ),
      )

    if (invalidFeatures.length > 0) {
      setCustomError(
        `These fields must contain numeric values: ${invalidFeatures.join(', ')}`,
      )

      return false
    }


    return true
  }


  // ============================================================
  // BUILD CUSTOM PAYLOAD
  // ============================================================

  const buildCustomPayload = () => {
    return MODEL_FEATURES.reduce(
      (payload, feature) => {
        payload[feature] = Number(
          customTransaction[feature],
        )

        return payload
      },
      {},
    )
  }


  // ============================================================
  // CSV PARSER
  // ============================================================

  const parseCsvLine = (line) => {
    const values = []
    let current = ''
    let inQuotes = false

    for (let index = 0; index < line.length; index += 1) {
      const character = line[index]
      const nextCharacter = line[index + 1]

      if (character === '"') {
        if (inQuotes && nextCharacter === '"') {
          current += '"'
          index += 1
        } else {
          inQuotes = !inQuotes
        }
      } else if (character === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += character
      }
    }

    values.push(current.trim())
    return values
  }


  const parseCsvText = (text) => {
    const lines = text
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0)

    if (lines.length < 2) {
      throw new Error(
        'The CSV does not contain any transaction rows.'
      )
    }

    const headers = parseCsvLine(lines[0]).map((header) =>
      header.trim()
    )

    if (headers.some((header) => !header)) {
      throw new Error(
        'The CSV contains an empty column name.'
      )
    }

    const rows = lines.slice(1).map((line, lineIndex) => {
      const values = parseCsvLine(line)

      if (values.length !== headers.length) {
        throw new Error(
          `Row ${lineIndex + 2} contains ${values.length} values, but the header contains ${headers.length} columns.`
        )
      }

      const row = {}

      headers.forEach((header, index) => {
        row[header] = values[index]
      })

      return row
    })

    return {
      headers,
      rows,
    }
  }


  // ============================================================
  // VALIDATE UPLOADED CSV
  // ============================================================

  const validateCsvFile = async (file) => {
    setUploadedFile(null)
    setCsvValidation(null)
    setCsvError(null)
    setCsvRows([])
    setBatchResult(null)
    setBatchError(null)
    setBatchLoading(false)
    setSelectedBatchRow(null)
    setBatchProgress(null)

    if (!file)   return

    setAssessmentMode('csv')

    setUploadedFile(file)

    if(!file.name.toLowerCase().endsWith('.csv')) {
        setCsvError( 'Invalid file type. Please upload a CSV file (.csv).' )
        return
    }

    try{
      const text = await file.text()

      if (!text.trim()) {
        setCsvError(  'The uploaded CSV file is empty.')
        return
      }

      const { headers, rows } = parseCsvText(text)

      const uniqueColumns = [...new Set(headers)]

      const hasDuplicateColumns =
        headers.length !== uniqueColumns.length

      const missingFeatures = MODEL_FEATURES.filter(
        (feature) => !uniqueColumns.includes(feature)
      )

      const hasClassColumn =
        uniqueColumns.includes('Class')

      const unexpectedColumns = uniqueColumns.filter(
        (column) =>
          !MODEL_FEATURES.includes(column) &&
          !OPTIONAL_LABEL_COLUMNS.includes(column)
      )

      const compatible =
        missingFeatures.length === 0 &&
        unexpectedColumns.length === 0 &&
        !hasDuplicateColumns

      let csvType = null

      if (compatible && hasClassColumn) {
        csvType = 'evaluation'
      } else if (compatible) {
        csvType = 'prediction'
      }

      if (compatible) {
        setCsvRows(rows)
      }

      setCsvValidation({
        compatible,
        csvType,
        columns: uniqueColumns,
        missingFeatures,
        unexpectedColumns,
        hasDuplicateColumns,
        hasClassColumn,
        featureCount: uniqueColumns.length,
        requiredCount: MODEL_FEATURES.length,
        rowCount: rows.length,
        optionalColumns: OPTIONAL_LABEL_COLUMNS,
      })

    } catch (error) {
      console.error(
        'CSV validation error:',
        error
      )

      setCsvError(
        error.message ||
        'Unable to read the uploaded CSV file.'
      )
    }
  }


  // ============================================================
  // ANALYZE UPLOADED CSV
  // ============================================================

  const analyzeCsv = async () => {
    if (!csvValidation?.compatible) {
        setBatchError(
        'Please upload a compatible CSV file first.'
        )
        return
    }

    if (!csvRows.length) {
        setBatchError(
        'The CSV does not contain any transaction rows.'
        )
        return
    }

    const CHUNK_SIZE = 500

    const totalRows = csvRows.length

    const totalChunks =    Math.ceil(totalRows / CHUNK_SIZE)

    setBatchLoading(true)
    setBatchError(null)
    setBatchResult(null)
    setSelectedBatchRow(null)

    setBatchProgress({
        currentChunk: 0,
        totalChunks,
        processedRows: 0,
        totalRows,
    })

    try {
        const allResults = []

        let totalTransactions = 0
        let totalHighRisk = 0
        let totalLowRisk = 0
        let totalReviewRequired = 0
        let totalAllow = 0

        let truePositive = 0
        let trueNegative = 0
        let falsePositive = 0
        let falseNegative = 0

        let hasEvaluation = false

        for (
        let start = 0;
        start < totalRows;
        start += CHUNK_SIZE
        ) {
        const end = Math.min(
            start + CHUNK_SIZE,
            totalRows
        )

        const chunkRows =
            csvRows.slice(start, end)

        const transactions =
            chunkRows.map((row, index) => {
            const transaction = {}

            MODEL_FEATURES.forEach((feature) => {
                const rawValue = row[feature]

                const numericValue =
                Number(rawValue)

                if (
                rawValue === '' ||
                rawValue === null ||
                rawValue === undefined ||
                !Number.isFinite(numericValue)
                ) {
                throw new Error(
                    `Row ${start + index + 2}: ${feature} must contain a numeric value.`
                )
                }

                transaction[feature] =
                numericValue
            })

            if (csvValidation.hasClassColumn) {
                const classValue =
                Number(row.Class)

                if (
                !Number.isInteger(classValue) ||
                ![0, 1].includes(classValue)
                ) {
                throw new Error(
                    `Row ${start + index + 2}: Class must be 0 or 1.`
                )
                }

                transaction.Class =
                classValue
            }

            return transaction
            })

        setBatchProgress({
            currentChunk:
            Math.floor(start / CHUNK_SIZE) + 1,
            totalChunks,
            processedRows: start,
            totalRows,
        })

        const response =
            await fetch(
            'http://127.0.0.1:8000/api/assess-batch',
            {
                method: 'POST',
                headers: {
                'Content-Type':
                    'application/json',
                },
                body: JSON.stringify({
                transactions,
                }),
            }
            )

        let data

        try {
            data =
            await response.json()
        } catch {
            throw new Error(
            `Batch API returned an invalid response (${response.status}).`
            )
        }

        if (!response.ok) {
            const detail =
            data?.detail

            throw new Error(
            typeof detail === 'string'
                ? detail
                : detail
                ? JSON.stringify(detail)
                : `Batch assessment failed with HTTP ${response.status}.`
            )
        }

        if (
            !data?.success ||
            !data?.result
        ) {
            throw new Error(
            'The batch API did not return a valid result.'
            )
        }

        const chunkResult =
            data.result

        // ----------------------------------------------------------
        // CONVERT CHUNK ROW NUMBERS TO GLOBAL ROW NUMBERS
        // ----------------------------------------------------------

        const globalResults =
            chunkResult.results.map(
            (item) => ({
                ...item,
                row_number:  Number(item.row_number) +  start,
            })
            )

        allResults.push(
            ...globalResults
        )

        // ----------------------------------------------------------
        // AGGREGATE SUMMARY
        // ----------------------------------------------------------

        totalTransactions +=
            Number(
            chunkResult.summary.total_transactions
            )

        totalHighRisk +=
            Number(
            chunkResult.summary.high_risk
            )

        totalLowRisk +=
            Number(
            chunkResult.summary.low_risk
            )

        totalReviewRequired +=
            Number(
            chunkResult.summary.review_required
            )

        totalAllow +=
            Number(
            chunkResult.summary.allow
            )

        // ----------------------------------------------------------
        // AGGREGATE EVALUATION
        // ----------------------------------------------------------

        if (chunkResult.evaluation) {
            hasEvaluation = true

            truePositive +=
            Number(
                chunkResult.evaluation
                .true_positive
            )

            trueNegative +=
            Number(
                chunkResult.evaluation
                .true_negative
            )

            falsePositive +=
            Number(
                chunkResult.evaluation
                .false_positive
            )

            falseNegative +=
            Number(
                chunkResult.evaluation
                .false_negative
            )
        }

        setBatchProgress({
            currentChunk:
            Math.floor(end / CHUNK_SIZE) ||
            totalChunks,
            totalChunks,
            processedRows: end,
            totalRows,
        })
        }

        // ------------------------------------------------------------
        // FINAL EVALUATION METRICS
        // ------------------------------------------------------------

        let evaluation = null

        if (hasEvaluation) {
        const precisionDenominator =
            truePositive +
            falsePositive

        const recallDenominator =
            truePositive +
            falseNegative

        const accuracyDenominator =
            truePositive +
            trueNegative +
            falsePositive +
            falseNegative

        const precision =
            precisionDenominator > 0
            ? truePositive /
                precisionDenominator
            : 0

        const recall =
            recallDenominator > 0
            ? truePositive /
                recallDenominator
            : 0

        const accuracy =
            accuracyDenominator > 0
            ? (
                truePositive +
                trueNegative
                ) /
                accuracyDenominator
            : 0

        evaluation = {
            precision,
            recall,
            accuracy,
            true_positive:
            truePositive,
            true_negative:
            trueNegative,
            false_positive:
            falsePositive,
            false_negative:
            falseNegative,
        }
        }

        // ------------------------------------------------------------
        // SAVE FINAL AGGREGATED RESULT
        // ------------------------------------------------------------

        setBatchResult({
        summary: {
            total_transactions:
            totalTransactions,

            high_risk:
            totalHighRisk,

            low_risk:
            totalLowRisk,

            review_required:
            totalReviewRequired,

            allow:
            totalAllow,
        },

        evaluation,

        results:
            allResults,
        })

        setBatchProgress({
        currentChunk: totalChunks,
        totalChunks,
        processedRows: totalRows,
        totalRows,
        })

    } catch (error) {
        console.error(
        'CSV assessment error:',
        error
        )

        setBatchError(
        error.message ||
        'Unable to analyze the uploaded CSV.'
        )

        setBatchResult(null)

    } finally {
        setBatchLoading(false)
    }
  }


  // ============================================================
  // SELECT CSV TRANSACTION FOR INVESTIGATION
  // ============================================================

  const selectBatchTransaction = (resultItem) => {
    const rowIndex = Number(resultItem.row_number) - 1

    const originalRow = csvRows[rowIndex]

    if (!originalRow) {
      setBatchError(
        `Unable to locate the original CSV row #${resultItem.row_number}.`
      )
      return
    }

    const transaction = {}

    MODEL_FEATURES.forEach((feature) => {
      transaction[feature] = Number(
        originalRow[feature]
      )
    })

    setSelectedBatchRow({
      result: resultItem,
      transaction,
    })

    setSelectedTransaction({
      type: 'csv',
      data: transaction,
      rowNumber: resultItem.row_number,
    })

    setRiskResult(null)
    setApiError(null)
    setReviewOpen(false)
    setReviewed(false)
    setApproved(false)
  }

  const markCurrentTransactionReviewed = () => {
    setReviewed(true)

    if (
      selectedTransaction?.type === 'csv' &&
      selectedBatchRow?.result?.row_number
    ) {
      const rowNumber =
        Number(selectedBatchRow.result.row_number)

      setReviewedBatchRows((previous) => {
        if (previous.includes(rowNumber)) {
          return previous
        }

        return [...previous, rowNumber]
      })
    }

    setReviewOpen(false)
  }
  // ============================================================
  // ANALYZE SELECTED CSV TRANSACTION
  // ============================================================

  const analyzeSelectedBatchTransaction = async () => {

    if (!selectedBatchRow?.transaction) {
      return
    }

    setAnalyzing(true)
    setApiError(null)
    setRiskResult(null)

    setReviewOpen(false)
    setReviewed(false)
    setApproved(false)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/assess-risk',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            selectedBatchRow.transaction
          ),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          `API request failed (${response.status}): ${errorText}`
        )
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(
          data.message ||  'Transaction investigation failed.'
        )
      }

      setRiskResult(data.result)

    } catch (error) {
      console.error(
        'Selected transaction analysis error:',
        error
      )

      setApiError(
        error.message ||    'Unable to investigate the selected transaction.'
      )

    } finally {
      setAnalyzing(false)
    }
  }


  // ============================================================
  // ANALYZE TRANSACTION
  // ============================================================

  const analyzeTransaction = async () => {
    let payload = null
    let transactionType = null

    // =========================================================
    // CUSTOM TRANSACTION
    // ==========================================================

    if (assessmentMode === 'custom') {

      const isValid =    validateCustomTransaction()

        if (!isValid) {
            return
        }

      payload =    buildCustomPayload()

      transactionType =
        'custom'

      setSelectedTransaction({
        type: 'custom',
        data: payload,
      })
    }


    // ==========================================================
    // DEMO TRANSACTION
    // ==========================================================

    else {

        if (!selectedTransaction?.data) {
            return
        }

      payload =  selectedTransaction.data

      transactionType =  selectedTransaction.type
    }


    // ==========================================================
    // START ANALYSIS
    // ==========================================================

    setAnalyzing(true)

    setApiError(null)

    setRiskResult(null)

    setReviewOpen(false)

    setReviewed(false)

    setApproved(false)


    try {

      // --------------------------------------------------------
      // SEND TO FASTAPI
      // --------------------------------------------------------

        const response =
        await fetch(API_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(payload),
          },
        )


      // --------------------------------------------------------
      // HTTP ERROR
      // --------------------------------------------------------

      if (!response.ok) {
        const errorText =  await response.text()

        throw new Error(  `API request failed (${response.status}): ${errorText}`,
        )
      }


      // --------------------------------------------------------
      // READ JSON
      // --------------------------------------------------------

      const data = await response.json()


      // --------------------------------------------------------
      // APPLICATION ERROR
      // --------------------------------------------------------

        if (!data.success) {
            throw new Error(  data.message ||  'Risk assessment failed.',)
        }


      // --------------------------------------------------------
      // STORE RESULT
      // --------------------------------------------------------

      setRiskResult( data.result, )


      // --------------------------------------------------------
      // KEEP CUSTOM TRANSACTION
      // --------------------------------------------------------

        if ( transactionType ==='custom' ) {
            setSelectedTransaction({
            type: 'custom',
            data: payload,
            })
        }

    } 
    catch (error) {
      console.error('Risk assessment error:', error,)

      setApiError(error.message || 'Unable to connect to the Risk Manager API.', )

      setRiskResult(null)
    } 
    finally {
        setAnalyzing(false)
    }
  }


  // ============================================================
  // DISPLAY HELPERS
  // ============================================================

    const isHighRisk = riskResult?.risk_level ==='HIGH'

    const probability = riskResult ? Number(  riskResult.fraud_percentage, ): 0

    const probabilityWidth = Math.min(  Math.max( probability, 0, ), 100,)

    const positiveFeatures = riskResult?.top_features?.filter(  (item) => Number(  item.shap_value, ) > 0, ) || []

    const negativeFeatures = riskResult?.top_features?.filter((item) => Number(item.shap_value,)<0,) || []


    // ============================================================
    // LARGE CSV — HIGH-RISK TRANSACTIONS
    // ============================================================

    const highRiskTransactions =
    batchResult?.results ?.filter(
        (item) => item.recommended_action === 'REVIEW')
        ?.sort((a, b) => Number(b.fraud_probability) - Number(a.fraud_probability)) || []

    const isLargeBatch = Number( batchResult?.summary?.total_transactions || 0) > 500


    return {
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
    assessmentMode,

    customTransaction,
    customError,

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
    buildCustomPayload,
    parseCsvLine,
    parseCsvText,
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
    setSelectedBatchRow,
    setBatchProgress,
    setCustomTransaction,
    reviewedBatchRows,
    markCurrentTransactionReviewed,
  }
}

export default useRiskManager