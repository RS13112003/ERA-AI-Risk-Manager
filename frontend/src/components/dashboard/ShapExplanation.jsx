import ShapRow from '../risk/ShapRow'
import { getShapDescription } from '../../utils/formatting'
function ShapExplanation({
  riskResult,
  positiveFeatures,
  negativeFeatures,
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">

        <div className="mb-8">

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
                Explainability
            </p>

            <h3 className="mt-2 text-xl font-semibold">
                Why did the AI make this decision?
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                SHAP explains how individual transaction features influenced the model's fraud prediction.
            </p>

        </div>


      {/* NO RESULT */}

      {!riskResult && (

        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">

            <p className="text-sm text-slate-600">
                Run an assessment to see the AI explanation.
            </p>

        </div>

      )}


      {/* REAL RESULT */}

      {riskResult && (

        <>

          {/* SUMMARY CARDS */}

            <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                        Increasing Risk
                    </p>

                    <p className="mt-2 text-3xl font-bold text-red-400">
                        {positiveFeatures.length}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                        factor
                        {positiveFeatures.length === 1
                        ? ''
                        : 's'} pushed toward fraud

                    </p>

                </div>


                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                    <p className="text-xs uppercase tracking-wider text-slate-500">
                        Reducing Risk
                    </p>

                    <p className="mt-2 text-3xl font-bold text-emerald-400">
                        {negativeFeatures.length}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                        factor
                        {negativeFeatures.length === 1
                        ? ''
                        : 's'} pushed away from fraud

                    </p>

                </div>
            </div>


          {/* INCREASING RISK */}

          {positiveFeatures.length > 0 && (

            <div className="mt-8">

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <h4 className="font-semibold">
                            Factors increasing fraud risk
                        </h4>

                        <p className="mt-1 text-xs text-slate-600">
                            Positive SHAP values increase the model's
                            fraud score.
                        </p>

                    </div>


                    <span className="rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 text-xs text-red-300">
                        Higher risk
                    </span>

                </div>


                <div className="space-y-5">

                    {positiveFeatures.map(
                    (item) => (

                        <ShapRow
                        key={item.feature}
                        feature={
                            item.feature
                        }
                        description={getShapDescription(
                            item.shap_value,
                        )}
                        value={
                            item.shap_value
                        }
                        direction="toward fraud"
                        />

                    ),
                    )}

                </div>

            </div>

          )}


          {/* REDUCING RISK */}

          {negativeFeatures.length > 0 && (

            <div className="mt-8">

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <h4 className="font-semibold">
                            Factors reducing fraud risk
                        </h4>

                        <p className="mt-1 text-xs text-slate-600">
                            Negative SHAP values reduce the model's
                            fraud score.
                        </p>

                    </div>


                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-300">
                    Lower risk
                    </span>

                </div>


                <div className="space-y-5">

                    {negativeFeatures.map(
                    (item) => (

                        <ShapRow
                        key={item.feature}
                        feature={
                            item.feature
                        }
                        description={getShapDescription(
                            item.shap_value,
                        )}
                        value={
                            item.shap_value
                        }
                        direction="away from fraud"
                        />

                    ),
                    )}

                </div>

            </div>

          )}

        </>

      )}

    </section>
  )
}

export default ShapExplanation