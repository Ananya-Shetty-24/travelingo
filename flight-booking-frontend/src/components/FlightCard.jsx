function formatTime(iso) {
  const d = new Date(iso)
  if (isNaN(d)) return '--:--'
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(dep, arr) {
  const ms = new Date(arr) - new Date(dep)
  if (isNaN(ms) || ms < 0) return ''
  const hrs = Math.floor(ms / 3600000)
  const mins = Math.round((ms % 3600000) / 60000)
  return `${hrs}h ${mins}m`
}

export default function FlightCard({ flight, onSelect }) {
  const {
    flightNumber,
    departure,
    arrival,
    departureTime,
    arrivalTime,
    status,
    pricing,
  } = flight

  return (
    <div className="relative bg-runway-800 rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-dashed border-fog-400/30">
        <span className="font-mono text-[11px] tracking-widest text-fog-400 uppercase">
          Flight {flightNumber}
        </span>
        {status && (
          <span className="font-mono text-[11px] tracking-widest text-amber-signal uppercase">
            {status}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-6 gap-4">
        <div className="text-left">
          <div className="font-display text-2xl font-semibold text-cloud-50">
            {formatTime(departureTime)}
          </div>
          <div className="text-fog-200 text-sm">{departure?.code ?? '—'}</div>
        </div>

        <div className="flex-1 flex flex-col items-center px-2">
          <span className="text-fog-400 text-xs font-mono">
            {formatDuration(departureTime, arrivalTime)}
          </span>
          <div className="relative w-full h-px bg-fog-400/30 my-2">
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-amber-signal text-xs">
              ✈
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="font-display text-2xl font-semibold text-cloud-50">
            {formatTime(arrivalTime)}
          </div>
          <div className="text-fog-200 text-sm">{arrival?.code ?? '—'}</div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-dashed border-fog-400/30">
        <span className="font-display text-lg text-cloud-50">
          ₹{pricing?.economy ?? '—'}
          <span className="text-fog-400 text-xs font-mono ml-1">/ economy</span>
        </span>
        <button
          onClick={() => onSelect(flight)}
          className="bg-amber-signal text-runway-900 font-display font-semibold text-sm px-5 py-2 rounded-lg transition-opacity hover:opacity-90"
        >
          Select
        </button>
      </div>
    </div>
  )
}
