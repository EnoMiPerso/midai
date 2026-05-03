export const COLS = 16   // 16th notes per bar
export const ROWS = 16   // pitch rows displayed

// Chromatic note names for display (high → low)
export const NOTE_LABELS = [
  'B4','A#4','A4','G#4','G4','F#4','F4','E4',
  'D#4','D4','C#4','C4','B3','A#3','A3','G#3',
]

// Stem-specific pitch bias (top rows = high pitch)
const PITCH_BIAS = {
  Kick:  [12, 13, 14, 15],         // very low
  Snare: [10, 11, 12, 13],
  Hats:  [0, 1, 2, 3],             // high
  Bass:  [11, 12, 13, 14],
  Synth: [4, 5, 6, 7, 8],
  Piano: [3, 4, 5, 6, 7, 8],
  FX:    [1, 2, 3, 4],
  Vox:   [3, 4, 5, 6],
}

const NOTE_COUNTS = {
  Kick: 4, Snare: 4, Hats: 8, Bass: 5,
  Synth: 6, Piano: 7, FX: 4, Vox: 5,
}

function lcg(seed) {
  return ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0
}

/** Generate deterministic MIDI notes for a stem */
export function generateNotes(name) {
  const pitchBias = PITCH_BIAS[name] ?? [4, 5, 6, 7]
  const count = NOTE_COUNTS[name] ?? 5
  let s = name.split('').reduce((a, c) => a + c.charCodeAt(0), 17)
  const notes = []
  const used = new Set()

  for (let i = 0; i < count * 3; i++) {
    s = lcg(s)
    const col = s % COLS
    const pitchIndex = (lcg(s) % pitchBias.length)
    const pitch = pitchBias[pitchIndex]
    const dur = 1 + (lcg(lcg(s)) % 2)
    const key = `${col}-${pitch}`
    if (!used.has(key)) {
      used.add(key)
      notes.push({ col, pitch, dur })
    }
    if (used.size >= count) break
  }
  return notes
}

/**
 * Toggle a note in the notes array.
 * If a note exists at (col, pitch) → remove it.
 * Otherwise → add one with duration 1.
 */
export function toggleNote(notes, col, pitch) {
  const idx = notes.findIndex((n) => n.col === col && n.pitch === pitch)
  if (idx >= 0) return notes.filter((_, i) => i !== idx)
  return [...notes, { col, pitch, dur: 1 }]
}

/** Download notes as a JSON file */
export function saveNotes(stemName, notes, bpm, musicalKey) {
  const payload = {
    plugin: 'MIDAI v0.1',
    stem: stemName,
    bpm,
    key: musicalKey,
    resolution: '1/16',
    notes: notes.map((n) => ({
      note: NOTE_LABELS[n.pitch],
      start_16th: n.col,
      duration_16th: n.dur,
    })),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `midai_${stemName.toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
