import {
  formatAmount,
  getDemoTransactionId,
} from '../../utils/formatting'

function SelectedTransaction({
  selectedTransaction,
  apiError,
  analyzing,
  apiOnline,
  analyzeTransaction,
}) {
  return (
    <>
      	{/* =================================================
          	SELECTED TRANSACTION
      	================================================= */}

      {selectedTransaction && (

        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">

          	<div className="flex items-start justify-between">

				<div>

					<p className="text-xs uppercase tracking-wider text-slate-500">
						Selected Transaction
					</p>

					<p className="mt-1 font-semibold text-cyan-300">

						{selectedTransaction.type ===
						'legitimate'
						? 'Legitimate Transaction'
						: selectedTransaction.type ===
							'fraudulent'
							? 'Fraudulent Transaction'
							: 'Custom Transaction'}

					</p>

				</div>


				<span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">

					{selectedTransaction.type == 'custom' ? 'Custom' : 'Demo'}

				</span>

          	</div>


          {/* TRANSACTION INFORMATION */}

          {selectedTransaction.data && (

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">


              	{/* Transaction ID */}

              	<div className="rounded-lg border border-slate-800 bg-slate-950 p-3">

                	<p className="text-xs text-slate-600">
                  		Transaction ID
                	</p>

					<p className="mt-1 font-mono text-sm text-slate-300">

					{selectedTransaction.type ===
					'custom'
						? 'CUSTOM-TXN'
						: getDemoTransactionId(
							selectedTransaction.type,
						)}

					</p>

              	</div>


              {/* Amount */}

              	<div className="rounded-lg border border-slate-800 bg-slate-950 p-3">

					<p className="text-xs text-slate-600">
						Amount
					</p>

					<p className="mt-1 font-semibold text-slate-200">

						{formatAmount(
							selectedTransaction.data?.Amount,
						)}

					</p>

              	</div>


              {/* TIME */}

              	<div className="rounded-lg border border-slate-800 bg-slate-950 p-3">

					<p className="text-xs text-slate-600"> Transaction  Time </p>

					<p className="mt-1 font-mono text-sm text-slate-300">

						{Number(selectedTransaction.data?.Time ??    0, ).toFixed(0)}{' '} sec
					
					</p>

              	</div>


              	{/* DATA SOURCE */}

              	<div className="rounded-lg border border-slate-800 bg-slate-950 p-3">

					<p className="text-xs text-slate-600">
					Data Source
					</p>

					<p className="mt-1 text-sm text-slate-300">

					{selectedTransaction.type ===
					'custom'
						? 'User Input'
						: 'Credit Card Fraud Dataset'}

					</p>

              	</div>

            </div>

          )}


          	<p className="mt-4 text-xs text-slate-600">

				{selectedTransaction.type ===
				'custom'  ? 'Custom transaction supplied by the user'
				: 'Real transaction values loaded from creditcard.csv'}

          	</p>

        </div>

      )}


      {/* API ERROR */}

      {apiError && (

        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

          	<p className="text-xs font-semibold uppercase tracking-wider text-red-400">
            	API Error
          	</p>

          	<p className="mt-2 text-sm leading-6 text-red-300">
            	{apiError}
          	</p>

        </div>

      )}


      {/* ANALYZE */}

      <button
        type="button"
        onClick={
          analyzeTransaction
        }
        disabled={
          !selectedTransaction ||
          analyzing ||
          !apiOnline
        }
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-500 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
      >

        {analyzing ? (

          <>

            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

            Analyzing Transaction...

          </>

        ) : !apiOnline ? (

          'Waiting for API...'

        ) : (

          'Analyze Transaction'

        )}

      </button>

    </>
  )
}

export default SelectedTransaction