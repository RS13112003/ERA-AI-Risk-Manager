import { formatAmount } from '../../utils/formatting'

function HighRiskQueue({
  batchResult,
  highRiskTransactions,
  selectedBatchRow,
  selectBatchTransaction,
  reviewedBatchRows,
}) {
  return (
    <>
                    <div className="mt-8 overflow-hidden rounded-2xl border border-red-500/20 bg-slate-950">

                        {/* QUEUE HEADER */}
                        <div className="border-b border-red-500/10 bg-gradient-to-r from-red-500/5 via-red-500/[0.02] to-transparent px-5 py-5">

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <div className="flex items-center gap-2">

                                        <span className="h-2 w-2 rounded-full bg-red-400" />

                                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-400">
                                        High-Risk Investigation Queue
                                        </p>

                                    </div>

                                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">    Transactions requiring attention</h3>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                    Review the highest-risk transactions identified in this large batch.    Select a transaction to run live risk analysis and SHAP explainability.
                                </p>

                            </div>

                            <div className="flex shrink-0 items-center gap-3">

                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600"> High Risk </p>

                                    <p className="mt-1 text-2xl font-bold text-red-400">
                                    {highRiskTransactions.length}
                                    </p>

                                </div>

                                <div className="hidden rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 sm:block">

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                                    Queue
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-300">
                                    Investigation Ready
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* NO HIGH-RISK TRANSACTIONS */}
                    {/* HIGH-RISK TRANSACTION TABLE */}

                    {highRiskTransactions.length === 0 ? (

                    <div className="px-5 py-8">
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                        <p className="font-semibold text-emerald-400">
                            No high-risk transactions detected
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            The risk engine did not classify any transaction in this file
                            above the configured high-risk threshold.
                        </p>

                        </div>
                    </div>

                    ) : (

                    <div className="max-h-[520px] overflow-y-auto">

                        <div className="w-full min-w-0 overflow-x-auto">

                        <table className="w-full min-w-[650px] text-left">

                            {/* TABLE HEADER */}

                            <thead className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900">

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


                            {/* TABLE BODY */}

                            <tbody>

                                {highRiskTransactions.map((item) => {

                                    const isRowReviewed = reviewedBatchRows?.includes(Number(item.row_number))
                                    return (
                                    <tr
                                    key={item.row_number}
                                    onClick={() => selectBatchTransaction(item)}
                                    className={
                                    selectedBatchRow?.result?.row_number === item.row_number
                                        ? 'cursor-pointer border-b border-violet-500/30 bg-violet-500/10 transition hover:bg-violet-500/15'
                                        : isRowReviewed
                                        ? 'cursor-pointer border-b border-violet-400/20 bg-violet-400/5 transition hover:bg-violet-400/10'
                                        : 'cursor-pointer border-b border-slate-900 transition hover:bg-slate-900/70'
                                    }
                                >

                                {/* ROW */}

                                <td className="px-5 py-4 text-sm font-mono font-semibold text-slate-300">
                                    #{item.row_number}
                                </td>


                                {/* AMOUNT */}

                                <td className="px-5 py-4 text-sm font-semibold text-slate-200">
                                    {formatAmount(item.amount)}
                                </td>


                                {/* FRAUD PROBABILITY */}

                                <td className="px-5 py-4 text-sm font-mono font-semibold text-red-400">
                                    {Number(item.fraud_percentage).toFixed(4)}%
                                </td>


                                {/* RISK */}

                                <td className="px-5 py-4">

                                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                                    HIGH
                                    </span>

                                </td>


                                {/* ACTION */}

                                <td className="px-5 py-4">

                                    <span
                                        className={
                                        isRowReviewed
                                            ? 'font-semibold text-violet-400'
                                            : item.recommended_action === 'REVIEW'
                                            ? 'font-semibold text-amber-400'
                                            : 'font-semibold text-emerald-400'
                                        }
                                    >
                                        {isRowReviewed
                                        ? 'Marked as Review'
                                        : item.recommended_action}
                                    </span>

                                </td>

                                </tr>

                            )})}

                            </tbody>

                        </table>

                        </div>

                    </div>

                    )}

                </div>
    </>
  )
}

export default HighRiskQueue
