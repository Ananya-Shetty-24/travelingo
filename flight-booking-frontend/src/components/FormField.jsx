export default function FormField({ label, ...props }) {
  return (
    <label className="block mb-5">
      <span className="block font-mono text-[10px] tracking-widest text-fog-400 uppercase mb-1.5">
        {label}
      </span>
      <input
        {...props}
        className="w-full bg-runway-900 border border-fog-400/30 rounded-lg px-3.5 py-2.5 text-cloud-50 placeholder:text-fog-400/60 outline-none transition-colors focus:border-amber-signal focus:ring-2 focus:ring-amber-signal/20"
      />
    </label>
  )
}
