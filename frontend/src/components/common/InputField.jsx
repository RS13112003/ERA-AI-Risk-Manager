/* ============================================================
   INPUT FIELD
   ============================================================ */

function InputField({
  feature,
  value,
  onChange,
}) {
  return (

    <div>

      <label
        htmlFor={`custom-${feature}`}
        className="mb-2 block text-sm font-medium text-slate-300"
      >

        {feature}

        <span className="ml-1 text-red-400">
          *
        </span>

      </label>


      <input
        id={`custom-${feature}`}
        name={feature}
        type="number"
        step="any"
        value={value}
        onChange={(event) =>
          onChange(
            feature,
            event.target.value,
          )
        }
        placeholder={`Enter ${feature}`}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
      />

    </div>
  )
}

export default InputField