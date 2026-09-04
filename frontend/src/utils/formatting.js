/* ============================================================
   SHAP DESCRIPTION
   ============================================================ */

function getShapDescription(value) {
  const numericValue =
    Number(value)

  const absoluteValue =
    Math.abs(numericValue)

  if (
    numericValue > 0 &&
    absoluteValue >= 2
  ) {
    return 'Strongly increases fraud risk'
  }

  if (numericValue > 0) {
    return 'Increases fraud risk'
  }

  if (
    numericValue < 0 &&
    absoluteValue >= 2
  ) {
    return 'Strongly reduces fraud risk'
  }

  return 'Reduces fraud risk'
}


/* ============================================================
   FORMAT AMOUNT
   ============================================================ */

function formatAmount(value) {
  const numericValue =
    Number(value)

  if (
    !Number.isFinite(numericValue)
  ) {
    return '₹0.00'
  }

  return `₹${numericValue.toFixed(2)}`
}


/* ============================================================
   DEMO TRANSACTION ID
   ============================================================ */

function getDemoTransactionId(type) {
  if (type === 'legitimate') {
    return 'DEMO-LEG-001'
  }

  return 'DEMO-FRAUD-001'
}

export {
  getShapDescription,
  formatAmount,
  getDemoTransactionId,
}