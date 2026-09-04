import { formatAmount } from '../../utils/formatting'
function TransactionResultsTable({
  batchResult,
  selectedBatchRow,
  selectBatchTransaction,
}) {
  return (
    <>
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">

          <div className="border-b border-slate-800 px-5 py-4">

            <p className="font-semibold text-slate-200">
              Transaction Results
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Click any transaction to inspect its full details and run a SHAP explanation.
            </p>

          </div>


          <div className="w-full min-w-0 overflow-x-auto">

            <table className="w-full min-w-[680px] text-left">

              <thead className="border-b border-slate-800 bg-slate-900">

                <tr>

                  <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                    Row
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                    Fraud Probability
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                    Risk
                  </th>

                  <th className="px-5 py-4 text-xs uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {batchResult.results
                  .slice(0, 500)
                  .map((item) => (

                  <tr
                    key={item.row_number}
                    onClick={() =>
                      selectBatchTransaction(item)
                    }
                    className={
                      selectedBatchRow?.result?.row_number === item.row_number
                      ? 'cursor-pointer border-b border-violet-500/30 bg-violet-500/10 transition duration-200 hover:bg-violet-500/15'
                      : 'cursor-pointer border-b border-slate-900 transition duration-200 hover:bg-slate-900/70'
                    }
                  >

                    <td className="px-5 py-4 text-sm font-mono text-slate-400">
                      #{item.row_number}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-200">
                      {formatAmount(item.amount)}
                    </td>

                    <td className="px-5 py-4 text-sm font-mono text-slate-200">
                      {Number(
                        item.fraud_percentage
                      ).toFixed(4)}%
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={
                          item.risk_level === 'HIGH'
                            ? 'rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400'
                            : 'rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400'
                        }
                      >
                        {item.risk_level}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={
                          item.recommended_action === 'REVIEW'
                            ? 'font-semibold text-amber-400'
                            : 'font-semibold text-emerald-400'
                        }
                      >
                        {item.recommended_action}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

    </>
  )
}

export default TransactionResultsTable