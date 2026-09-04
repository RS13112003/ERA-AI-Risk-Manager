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
   SHAP ROW
   ============================================================ */

function ShapRow({
  feature,
  description,
  value,
  direction,
}) {
  const isTowardFraud =
    direction === 'toward fraud'

  const numericValue =
    Number(value)

  const absoluteValue =
    Math.abs(numericValue)

  const width =
    Math.min(
      (absoluteValue / 4.1) * 100,
      100,
    )

  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-4">

        <div>

          <span className="font-semibold">
            {feature}
          </span>

          <span className="ml-3 text-sm text-slate-500">
            {description}
          </span>

        </div>


        <span
          className={
            isTowardFraud
              ? 'shrink-0 font-mono text-sm text-red-400'
              : 'shrink-0 font-mono text-sm text-emerald-400'
          }
        >
          {numericValue >= 0 ? '+' : ''}
          {numericValue.toFixed(4)}
        </span>

      </div>


      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className={
            isTowardFraud
              ? 'h-full rounded-full bg-red-500 transition-all duration-700'
              : 'h-full rounded-full bg-emerald-500 transition-all duration-700'
          }
          style={{
            width: `${width}%`,
          }}
        />

      </div>

    </div>
  )
}

export default ShapRow

export {
  getShapDescription,
}