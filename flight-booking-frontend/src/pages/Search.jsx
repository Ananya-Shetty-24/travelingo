import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'

export default function Search() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ dep_iata: '', arr_iata: '', date: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleIataChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value.toUpperCase() }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(form).toString()
    navigate(`/results?${params}`)
  }

  return (
    <div className="min-h-screen bg-runway-900 flex flex-col items-center px-6 py-16">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-amber-signal text-lg">✈</span>
        <span className="font-display text-lg font-semibold tracking-tight text-cloud-50">
          Travelingo
        </span>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-cloud-50 text-center mb-2">
        Where to next?
      </h1>
      <p className="text-fog-200 text-sm mb-10 text-center max-w-sm">
        Search flights between airports and pick the one that fits your plans.
      </p>

      <div className="w-full max-w-2xl bg-runway-800 rounded-2xl shadow-2xl shadow-black/30 px-6 sm:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
          <FormField
            label="From"
            type="text"
            name="dep_iata"
            placeholder="Destination"
            maxLength={3}
            value={form.dep_iata}
            onChange={handleIataChange}
            required
          />
          <FormField
            label="To"
            type="text"
            name="arr_iata"
            placeholder="Arrival"
            maxLength={3}
            value={form.arr_iata}
            onChange={handleIataChange}
            required
          />
          <FormField
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="sm:col-span-3 mt-2 bg-amber-signal text-runway-900 font-display font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
          >
            Search flights
          </button>
        </form>
      </div>
    </div>
  )
}
