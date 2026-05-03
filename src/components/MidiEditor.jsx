import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, Check, ZoomIn, ZoomOut } from 'lucide-react'
import { NOTE_LABELS, COLS, toggleNote, saveNotes } from '../utils/midi'

const BLACK_NOTES = new Set(['A#4','G#4','F#4','D#4','C#4','A#3','G#3'])
const ROWS = NOTE_LABELS.length

export default function MidiEditor({ stem, onClose, onSave, bpm, musicalKey }) {
  const [notes, setNotes] = useState(stem.notes ?? [])
  const [zoom, setZoom] = useState(1)
  const [saved, setSaved] = useState(false)

  const cellW = Math.round(30 * zoom)
  const cellH = 20
  const keyW = 36

  function handleCellClick(col, pitch) {
    setNotes((prev) => toggleNote(prev, col, pitch))
    setSaved(false)
  }

  function handleSave() {
    onSave(stem.id, notes)
    saveNotes(stem.name, notes, bpm, musicalKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const gridW = COLS * cellW
  const gridH = ROWS * cellH

  return (
    <motion.div
      key="midi-editor"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col h-full bg-[#060606]"
    >
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#111] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose}
            className="flex items-center gap-1 text-[#444] hover:text-[#999] transition-colors">
            <ArrowLeft size={12} />
            <span className="text-[9px] font-mono uppercase tracking-wider">Back</span>
          </button>
          <div className="w-px h-4 bg-[#1A1A1A]" />
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#FF5500]">{stem.name}</span>
            <span className="text-[8px] font-mono text-[#333] ml-2">
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-[#2A2A2A] uppercase tracking-wider">
            {bpm} BPM · {musicalKey} · 4/4
          </span>
          <div className="w-px h-4 bg-[#1A1A1A]" />

          {/* Zoom controls */}
          <button onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}
            className="w-6 h-6 flex items-center justify-center text-[#333] hover:text-[#888] transition-colors">
            <ZoomOut size={11} />
          </button>
          <span className="text-[8px] font-mono text-[#333] w-7 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.2).toFixed(1)))}
            className="w-6 h-6 flex items-center justify-center text-[#333] hover:text-[#888] transition-colors">
            <ZoomIn size={11} />
          </button>

          <div className="w-px h-4 bg-[#1A1A1A]" />

          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.96 }}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] transition-colors',
              saved ? 'bg-[#1A2A1A] text-[#44AA44]' : 'bg-[#FF5500] text-black hover:bg-[#FF7733]',
            ].join(' ')}
          >
            {saved ? <><Check size={10} /> Saved</> : <><Download size={10} /> Save</>}
          </motion.button>
        </div>
      </div>

      {/* Piano roll */}
      <div className="flex flex-1 overflow-auto min-h-0">
        {/* Piano keys */}
        <div className="shrink-0 border-r border-[#111]" style={{ width: keyW }}>
          {NOTE_LABELS.map((label, row) => {
            const isBlack = BLACK_NOTES.has(label)
            return (
              <div key={row}
                className="flex items-center justify-end pr-1 border-b border-[#0E0E0E]"
                style={{ height: cellH, background: isBlack ? '#0A0A0A' : '#0E0E0E' }}
              >
                <span className={[
                  'text-[7px] font-mono leading-none',
                  isBlack ? 'text-[#222]' : 'text-[#333]',
                ].join(' ')}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Grid + notes */}
        <div className="relative overflow-auto flex-1">
          <div style={{ width: gridW, height: gridH, position: 'relative' }}>
            {/* Horizontal row lines */}
            {NOTE_LABELS.map((label, row) => {
              const isBlack = BLACK_NOTES.has(label)
              return (
                <div key={row}
                  className="absolute w-full border-b border-[#0E0E0E]"
                  style={{
                    top: row * cellH, height: cellH,
                    background: isBlack ? '#080808' : '#0B0B0B',
                  }}
                />
              )
            })}

            {/* Beat dividers */}
            {[4, 8, 12].map((c) => (
              <div key={c} className="absolute top-0 bottom-0 bg-[#141414]"
                style={{ left: c * cellW, width: 1 }} />
            ))}

            {/* Cell click targets */}
            {Array.from({ length: ROWS }, (_, row) =>
              Array.from({ length: COLS }, (_, col) => (
                <div
                  key={`${col}-${row}`}
                  onClick={() => handleCellClick(col, row)}
                  className="absolute hover:bg-[#FF5500]/10 transition-colors cursor-pointer"
                  style={{ left: col * cellW, top: row * cellH, width: cellW, height: cellH }}
                />
              ))
            )}

            {/* Notes */}
            <AnimatePresence>
              {notes.map((n, i) => (
                <motion.div
                  key={`note-${n.col}-${n.pitch}-${i}`}
                  initial={{ opacity: 0, scaleX: 0.5 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.5 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => handleCellClick(n.col, n.pitch)}
                  className="absolute cursor-pointer z-10"
                  style={{
                    left: n.col * cellW + 1,
                    top: n.pitch * cellH + 2,
                    width: n.dur * cellW - 2,
                    height: cellH - 4,
                    background: '#FF5500',
                    transformOrigin: 'left center',
                  }}
                  title="Click to remove"
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Beat labels footer */}
      <div className="flex shrink-0 border-t border-[#0E0E0E] bg-[#050505]" style={{ paddingLeft: keyW }}>
        {Array.from({ length: COLS }, (_, c) => (
          <div key={c} className="flex items-center justify-center border-r border-[#0E0E0E] text-[7px] font-mono text-[#222]"
            style={{ width: cellW, height: 14 }}>
            {c % 4 === 0 ? c / 4 + 1 : ''}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
