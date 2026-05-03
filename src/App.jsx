import { useState, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import PluginTitleBar from './components/PluginTitleBar'
import PromptPanel from './components/PromptPanel'
import StemTrack from './components/StemTrack'
import StemPanel from './components/StemPanel'
import MidiEditor from './components/MidiEditor'
import DAWStatusBar from './components/DAWStatusBar'
import { generateNotes } from './utils/midi'

const STEM_NAMES = ['Kick', 'Snare', 'Hats', 'Bass', 'Synth', 'Piano', 'FX', 'Vox']

const DEFAULT_INSTRUMENTS = {
  Kick: 'Drum Rack', Snare: 'Drum Rack', Hats: 'Drum Rack',
  Bass: 'Bass Guitar', Synth: 'Wavetable', Piano: 'Grand Piano',
  FX: 'Operator', Vox: 'Vocoder',
}

function makeStems() {
  return STEM_NAMES.map((name, id) => ({
    id, name, progress: 0, isMuted: false, isSolo: false,
    isGenerating: false, notes: [],
    instrument: DEFAULT_INSTRUMENTS[name] ?? 'Instrument',
  }))
}

export default function App() {
  const [prompt, setPrompt]             = useState('')
  const [activeTags, setActiveTags]     = useState([])
  const [activePreset, setActivePreset] = useState(null)
  const [presetIndex, setPresetIndex]   = useState(0)
  const [stems, setStems]               = useState(makeStems)
  const [tweaks, setTweaks]             = useState(() =>
    Object.fromEntries(STEM_NAMES.map((_, id) => [id, { complexity: 50, humanization: 50, aiInfluence: 50 }]))
  )
  const [selectedId, setSelectedId]     = useState(null)
  const [expandedId, setExpandedId]     = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const timersRef = useRef([])

  const allDone = stems.every((s) => s.progress >= 100)
  const expandedStem = stems.find((s) => s.id === expandedId) ?? null

  function clearTimers() {
    timersRef.current.forEach(clearInterval)
    timersRef.current = []
  }

  function toggleTag(tag) {
    setActiveTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag])
  }

  function selectPreset(preset) {
    const same = activePreset?.id === preset.id
    setActivePreset(same ? null : preset)
    if (!same) setPrompt(preset.prompt)
  }

  const startGeneration = useCallback(() => {
    const full = [prompt, ...activeTags].filter(Boolean).join(', ')
    if (!full.trim()) return
    clearTimers()
    setIsGenerating(true)
    setExpandedId(null)
    setStems(makeStems().map((s) => ({ ...s, isGenerating: true })))

    const done = Array(STEM_NAMES.length).fill(false)

    STEM_NAMES.forEach((_, i) => {
      const t = setTimeout(() => {
        const iv = setInterval(() => {
          setStems((prev) => prev.map((s) => {
            if (s.id !== i) return s
            const p = Math.min(100, s.progress + Math.random() * 8 + 2)
            if (p >= 100) {
              done[i] = true
              clearInterval(iv)
              if (done.every(Boolean)) setIsGenerating(false)
              return { ...s, progress: 100, isGenerating: false, notes: generateNotes(s.name) }
            }
            return { ...s, progress: Math.round(p) }
          }))
        }, 60)
        timersRef.current.push(iv)
      }, i * 220)
      timersRef.current.push(t)
    })
  }, [prompt, activeTags])

  function refreshStem(id) {
    const name = STEM_NAMES[id]
    setStems((p) => p.map((s) => s.id === id ? { ...s, progress: 0, isGenerating: true, notes: [] } : s))
    const iv = setInterval(() => {
      setStems((prev) => prev.map((s) => {
        if (s.id !== id) return s
        const p = Math.min(100, s.progress + Math.random() * 11 + 3)
        if (p >= 100) {
          clearInterval(iv)
          return { ...s, progress: 100, isGenerating: false, notes: generateNotes(name) }
        }
        return { ...s, progress: Math.round(p) }
      }))
    }, 60)
    timersRef.current.push(iv)
  }

  function toggleMute(id) {
    setStems((p) => p.map((s) => s.id === id ? { ...s, isMuted: !s.isMuted } : s))
  }

  function toggleSolo(id) {
    setStems((p) => p.map((s) => s.id === id ? { ...s, isSolo: !s.isSolo } : s))
  }

  function saveEditorNotes(stemId, notes) {
    setStems((p) => p.map((s) => s.id === stemId ? { ...s, notes } : s))
  }

  function changeInstrument(stemId, instrument) {
    setStems((p) => p.map((s) => s.id === stemId ? { ...s, instrument } : s))
  }

  function handleTweakChange(stemId, key, val) {
    setTweaks((p) => ({ ...p, [stemId]: { ...p[stemId], [key]: val } }))
  }

  return (
    <div
      className="flex flex-col bg-[#070707] overflow-hidden"
      style={{ width: 800, height: 600 }}
    >
      <PluginTitleBar
        presetIndex={presetIndex}
        onPresetPrev={() => setPresetIndex((p) => (p - 1 + 6) % 6)}
        onPresetNext={() => setPresetIndex((p) => (p + 1) % 6)}
        dawConnected
      />

      <div className="flex flex-1 overflow-hidden">
        <PromptPanel
          prompt={prompt}
          onChange={setPrompt}
          onGenerate={startGeneration}
          isGenerating={isGenerating}
          activeTags={activeTags}
          onTagToggle={toggleTag}
          activePresetId={activePreset?.id}
          onPresetSelect={selectPreset}
        />

        <div className="flex flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {expandedStem ? (
              <MidiEditor
                key="editor"
                stem={expandedStem}
                onClose={() => setExpandedId(null)}
                onSave={saveEditorNotes}
                bpm="128"
                musicalKey="Am"
              />
            ) : (
              <div key="tracklist" className="flex flex-1 overflow-hidden">
                <div className="flex flex-col gap-px flex-1 overflow-y-auto p-2">
                  {stems.map((stem) => (
                    <StemTrack
                      key={stem.id}
                      stem={stem}
                      isSelected={stem.id === selectedId}
                      onClick={() => setSelectedId(stem.id === selectedId ? null : stem.id)}
                      onSolo={() => toggleSolo(stem.id)}
                      onMute={() => toggleMute(stem.id)}
                      onRefresh={() => refreshStem(stem.id)}
                      onExpand={() => setExpandedId(stem.id)}
                    />
                  ))}
                </div>

                <StemPanel
                  stem={stems.find((s) => s.id === selectedId) ?? null}
                  tweaks={selectedId != null ? tweaks[selectedId] : null}
                  onTweakChange={handleTweakChange}
                  onInstrumentChange={changeInstrument}
                  onClose={() => setSelectedId(null)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DAWStatusBar
        allDone={allDone}
        bpm="128"
        musicalKey="Am"
        timeSignature="4/4"
        onSend={() => alert('Sending MIDI to Ableton Live…')}
      />
    </div>
  )
}
