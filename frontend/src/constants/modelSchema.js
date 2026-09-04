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

export {
  MODEL_FEATURES,
  OPTIONAL_LABEL_COLUMNS,
}