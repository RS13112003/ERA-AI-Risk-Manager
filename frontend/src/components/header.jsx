function Header({ apiOnline }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95">
      
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">

        {/* BRANDING */}

        {/* <div className="flex items-center gap-3"> */}

          


          <div >

            <h1 className="text-lg font-bold tracking-wide ">    AI RISK MANAGER  </h1>

            <p className="text-xs text-slate-500">    Fraud Detection & Prevention  </p>

          </div>

        {/* </div> */}


        {/* API STATUS */}

        <div className="flex items-center gap-3">

          <div
            className={
              apiOnline
                ? 'flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2'
                : 'flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2'
            }
          >

            <span
              className={
                apiOnline
                  ? 'h-2 w-2 rounded-full bg-emerald-400'
                  : 'h-2 w-2 rounded-full bg-red-400'
              }
            />

            <span
              className={
                apiOnline
                  ? 'text-sm text-emerald-300'
                  : 'text-sm text-red-300'
              }
            >
              {apiOnline
                ? 'API Online'
                : 'API Offline'}
            </span>

          </div>

        </div>

      </div>

    </header>
  )
}

export default Header