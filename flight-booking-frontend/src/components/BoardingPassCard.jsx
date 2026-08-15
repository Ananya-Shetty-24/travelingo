/**
 * Wraps auth forms to look like a boarding pass stub:
 * a card with a punched-hole perforated divider and a
 * barcode-style footer strip.
 */
export default function BoardingPassCard({ pnr, children, footerNote }) {
  return (
    <div className="w-full max-w-md">
      <div className="relative bg-runway-800 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
        {/* Top strip: PNR-style label row */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-fog-400/30">
          <span className="font-mono text-[11px] tracking-widest text-fog-400 uppercase">
            Boarding Pass
          </span>
          <span className="font-mono text-[11px] tracking-widest text-amber-signal">
            PNR {pnr}
          </span>
        </div>

        {/* Perforation notches on the sides, at the divider level */}
        <div className="px-6 py-8">{children}</div>

        {/* Footer: barcode-style stub */}
        <div className="relative border-t border-dashed border-fog-400/30 px-6 py-4">
          <div
            className="h-6 w-full opacity-70"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #C9D3DE 0 2px, transparent 2px 5px, #C9D3DE 5px 6px, transparent 6px 11px, #C9D3DE 11px 14px, transparent 14px 18px)',
            }}
          />
          {footerNote && (
            <p className="mt-2 text-center text-[11px] text-fog-400 font-mono">
              {footerNote}
            </p>
          )}
        </div>

        {/* Punched notches, left and right, at the top-strip divider */}
        <div className="absolute left-0 top-[57px] -translate-x-1/2 w-6 h-6 rounded-full bg-runway-900" />
        <div className="absolute right-0 top-[57px] translate-x-1/2 w-6 h-6 rounded-full bg-runway-900" />
      </div>
    </div>
  )
}
