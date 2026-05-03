import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'

const DAW_INSTRUMENTS = [
  'Drum Rack', 'Impulse', 'Simpler', 'Sampler',
  'Analog', 'Collision', 'Electric', 'Operator',
  'Tension', 'Wavetable', 'Meld', 'Drift',
  'Grand Piano', 'Electric Piano', 'Rhodes',
  'Bass Guitar', 'Upright Bass', 'Sub Bass',
  'String Section', 'Brass Section', 'Choir',
  'Vocoder', 'Flute', 'Marimba', 'Acoustic Guitar',
]

const SLIDERS = [
  { id: 'complexity',    label: 'Complexity',  hint: 'Note density' },
  { id: 'humanization', label: 'Humanize',     hint: 'Timing drift' },
  { id: 'aiInfluence',  label: 'AI Drive',     hint: 'Creative range' },
]

function InstrumentPicker({ instrument, isDone, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(instrument)
  const inputRef = useRef(null)

  useEffect(() => { setDraft(instrument) }, [instrument])
  useEffect(() => { if (editing) inputRef.current?.select() }, [editing])

  function commit() {
    const v = draft.trim()
    if (v) onChange(v)
    setEditing(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setDraft(instrument); setEditing(false) }
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-3 border-b border-[#111]">
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-mono uppercase tracking-[0.18em] text-[#333]">Instrument</p>
        <div className="flex items-center gap-1">
          <div className={['w-1.5 h-1.5 rounded-full', isDone ? 'bg-[#FF5500]' : 'bg-[#1E1E1E]'].join(' ')} />
          <span className="text-[7px] font-mono uppercase tracking-wider text-[#2A2A2A]">
            {isDone ? 'found' : 'pending'}
          </span>
        </div>
      </div>

      {editing ? (
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="text"
            list="stem-panel-instruments"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={commit}
            className="w-full bg-[#0C0C0C] border border-[#FF5500]/40 text-[10px] font-mono text-[#DDD] outline-none px-2 py-1"
            aria-label="Change instrument"
          />
          <datalist id="stem-panel-instruments">
            {DAW_INSTRUMENTS.map((i) => <option key={i} value={i} />)}
          </datalist>
          <div className="flex gap-1">
            <button onClick={commit}
              className="flex-1 py-1 text-[8px] font-black uppercase tracking-wider bg-[#FF5500] hover:bg-[#FF7733] text-black transition-colors">
              Set
            </button>
            <button onClick={() => { setDraft(instrument); setEditing(false) }}
              className="px-2 py-1 text-[8px] font-mono text-[#444] hover:text-[#888] transition-colors border border-[#1A1A1A]">
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center justify-between w-full group border border-[#141414] hover:border-[#FF5500]/30 px-2 py-1.5 transition-colors bg-[#0A0A0A]"
          title="Click to change instrument"
        >
          <span className="text-[10px] font-mono text-[#888] group-hover:text-[#DDD] transition-colors truncate text-left">
            {instrument}
          </span>
          <ChevronDown size={9} className="text-[#2A2A2A] group-hover:text-[#FF5500] transition-colors shrink-0 ml-1" />
        </button>
      )}
    </div>
  )
}

function SliderRow({ id, label, hint, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[8px] font-mono uppercase tracking-[0.16em] text-[#555]">
          {label}
        </label>
        <span className="text-[9px] font-mono text-[#FF5500]">{value}</span>
      </div>
      <input id={id} type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
      <p className="text-[7px] font-mono text-[#1E1E1E] uppercase tracking-wider">{hint}</p>
    </div>
  )
}

export default function StemPanel({ stem, tweaks, onTweakChange, onInstrumentChange, onClose }) {
  return (
    <AnimatePresence>
      {stem && (
        <motion.aside
          key="stem-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 164, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          className="shrink-0 flex flex-col overflow-hidden border-l border-[#111] bg-[#050505]"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-3 pt-3 pb-2 border-b border-[#111] shrink-0">
            <div>
              <p className="text-[7px] font-mono uppercase tracking-[0.2em] text-[#2A2A2A]">Selected</p>
              <p className="text-[13px] font-black uppercase tracking-wider text-[#FF5500] leading-tight">
                {stem.name}
              </p>
              <p className="text-[7px] font-mono text-[#222] mt-0.5">
                Ch.{stem.ch ?? '—'}
              </p>
            </div>
            <button onClick={onClose} aria-label="Close panel"
              className="w-5 h-5 flex items-center justify-center text-[#222] hover:text-[#888] transition-colors mt-0.5">
              <X size={11} />
            </button>
          </div>

          {/* Instrument picker */}
          <InstrumentPicker
            instrument={stem.instrument}
            isDone={stem.progress >= 100}
            onChange={(inst) => onInstrumentChange(stem.id, inst)}
          />

          {/* Tweak sliders */}
          <div className="flex flex-col gap-4 px-3 py-3 flex-1 overflow-y-auto">
            <p className="text-[8px] font-mono uppercase tracking-[0.18em] text-[#333]">Tweak</p>
            {SLIDERS.map(({ id, label, hint }) => (
              <SliderRow key={id} id={id} label={label} hint={hint}
                value={tweaks?.[id] ?? 50}
                onChange={(val) => onTweakChange(stem.id, id, val)} />
            ))}
          </div>

          {/* Apply */}
          <div className="px-3 py-3 border-t border-[#111] shrink-0">
            <button className="w-full py-1.5 text-[9px] font-black uppercase tracking-[0.15em] bg-[#FF5500] hover:bg-[#FF7733] text-black transition-colors">
              Apply
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
