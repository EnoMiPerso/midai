import { motion } from 'framer-motion'
import { Volume2, VolumeX, RefreshCw, Maximize2 } from 'lucide-react'
import { COLS, ROWS } from '../utils/midi'

const STEM_META = {
  Kick:  { ch: '10', color: '#FF5500' },
  Snare: { ch: '10', color: '#FF7733' },
  Hats:  { ch: '10', color: '#FFAA44' },
  Bass:  { ch: '02', color: '#FF5500' },
  Synth: { ch: '03', color: '#FF7733' },
  Piano: { ch: '04', color: '#FFAA44' },
  FX:    { ch: '05', color: '#FF5500' },
  Vox:   { ch: '06', color: '#FF7733' },
}

function MiniRoll({ notes, isGenerating, progress, color }) {
  if (isGenerating) {
    return (
      <div className="flex items-center gap-0.5 h-full px-1">
        {[0,1,2,3,4,5,6,7].map((i) => (
          <motion.div key={i} className="w-0.5 rounded-full"
            style={{ background: color }}
            animate={{ height: ['2px', '14px', '2px'] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }} />
        ))}
      </div>
    )
  }
  if (progress < 100) {
    return (
      <div className="flex items-center h-full px-2">
        <div className="h-0.5 bg-[#1A1A1A]" style={{ width: `${progress}%` }} />
      </div>
    )
  }
  return (
    <svg viewBox={`0 0 ${COLS} ${ROWS}`} className="w-full h-full" preserveAspectRatio="none">
      {[4, 8, 12].map((c) => (
        <line key={c} x1={c} y1={0} x2={c} y2={ROWS} stroke="#111" strokeWidth="0.15" />
      ))}
      {notes.map((n, i) => (
        <motion.rect key={i}
          x={n.col + 0.08} y={n.pitch + 0.12} width={n.dur - 0.16} height={0.76}
          fill={color} rx="0.12"
          initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
          transition={{ delay: i * 0.03 }} />
      ))}
    </svg>
  )
}

export default function StemTrack({ stem, isSelected, onClick, onSolo, onMute, onRefresh, onExpand }) {
  const { name, progress, isMuted, isSolo, isGenerating, notes = [], instrument } = stem
  const meta = STEM_META[name] ?? { ch: '01', color: '#FF5500' }
  const isDone = progress >= 100

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        'flex items-stretch h-14 shrink-0 overflow-hidden border cursor-pointer transition-colors duration-100 select-none',
        isSelected ? 'border-[#FF5500] bg-[#0D0900]'
          : 'border-[#111] bg-[#080808] hover:border-[#1E1E1E]',
        isMuted ? 'opacity-40' : '',
      ].join(' ')}
    >
      <div className="w-0.5 shrink-0" style={{ background: isDone ? meta.color : '#1A1A1A' }} />

      <div className="flex flex-col justify-center px-2.5 w-36 shrink-0 border-r border-[#111]">
        <span className={[
          'text-[10px] font-black tracking-[0.18em] uppercase',
          isSelected ? 'text-[#FF5500]' : isGenerating ? 'text-[#FF5500]/50' : 'text-[#888]',
        ].join(' ')}>
          {name}
        </span>
        <span className="text-[8px] font-mono text-[#333] mt-0.5 truncate">{instrument}</span>
        <span className="text-[7px] font-mono text-[#1E1E1E] mt-0.5">Ch.{meta.ch}</span>
      </div>

      <div className="flex-1 py-2 px-1 min-w-0">
        <MiniRoll notes={notes} isGenerating={isGenerating} progress={progress} color={meta.color} />
      </div>

      <div className="flex items-center gap-1 px-2 border-l border-[#111] shrink-0"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onSolo}
          className={['w-5 h-5 flex items-center justify-center text-[8px] font-black transition-colors', isSolo ? 'text-[#FF5500]' : 'text-[#2A2A2A] hover:text-[#666]'].join(' ')}>
          S
        </button>
        <button onClick={onMute}
          className={['w-5 h-5 flex items-center justify-center transition-colors', isMuted ? 'text-[#FF5500]' : 'text-[#2A2A2A] hover:text-[#666]'].join(' ')}>
          {isMuted ? <VolumeX size={9} /> : <Volume2 size={9} />}
        </button>
        <button onClick={onRefresh}
          className="w-5 h-5 flex items-center justify-center text-[#2A2A2A] hover:text-[#FF5500] transition-colors">
          <RefreshCw size={9} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onExpand() }}
          disabled={!isDone}
          title="Edit MIDI"
          className={['w-5 h-5 flex items-center justify-center transition-colors', isDone ? 'text-[#333] hover:text-[#FF5500]' : 'text-[#1A1A1A] cursor-not-allowed'].join(' ')}>
          <Maximize2 size={9} />
        </button>
      </div>
    </motion.div>
  )
}
