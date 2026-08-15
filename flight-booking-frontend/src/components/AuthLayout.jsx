// A small animated flight path: a dot travels along a dashed line
// between two airport codes, looping quietly in the background.
function FlightPath() {
  return (
    <div className="relative w-full max-w-xs h-2 my-10">
      <div className="absolute inset-0 border-t-2 border-dashed border-fog-400/40" />
      <div className="absolute -top-1.5 left-0 w-2 h-2 rounded-full bg-fog-200" />
      <div className="absolute -top-1.5 right-0 w-2 h-2 rounded-full bg-fog-200" />
      <div
        className="absolute -top-[7px] w-4 h-4 text-amber-signal"
        style={{ animation: 'fly 4s ease-in-out infinite' }}
      >
        ✈
      </div>
      <style>{`
        @keyframes fly {
          0%   { left: 0%;   transform: translateX(0) rotate(90deg); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 100%; transform: translateX(-100%) rotate(90deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/**
 * Shared split layout for Login / Signup.
 * Left: hero panel with route + tagline.
 * Right: boarding-pass styled auth card (passed as children).
 */
export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const origin = 'Destination'
  const destination = 'Arrivial'

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-runway-900">
      {/* Wordmark — fixed top-left, sits above both panels */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <span className="text-amber-signal text-lg">✈</span>
        <span className="font-display text-lg font-semibold tracking-tight text-cloud-50">
          Travelingo
        </span>
      </div>

      {/* Left hero panel */}
      <div className="relative lg:w-1/2 flex flex-col justify-center items-center px-8 py-16 overflow-hidden bg-gradient-to-br from-runway-900 via-runway-800 to-runway-900">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="font-mono text-xs tracking-[0.3em] text-amber-signal uppercase mb-4">
            {eyebrow}
          </span>

          <div className="flex items-center gap-4 font-display text-5xl sm:text-6xl font-semibold text-cloud-50">
            <span>{origin}</span>
            <span className="text-fog-400 text-3xl">—</span>
            <span className="text-fog-400">{destination}</span>
          </div>

          <FlightPath />

          <h1 className="font-display text-2xl sm:text-3xl font-medium text-cloud-50 max-w-sm">
            {title}
          </h1>
          <p className="mt-3 text-fog-200 max-w-sm text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="lg:w-1/2 flex items-center justify-center px-6 py-16 bg-runway-900">
        {children}
      </div>
    </div>
  )
}
