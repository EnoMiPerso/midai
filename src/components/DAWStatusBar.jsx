import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function DAWStatusBar({ allDone, bpm, musicalKey, timeSignature, onSend }) {
  return (
    <footer className="shrink-0 flex items-center justify-between h-11 px-4 border-t border-[#111] bg-[#040404]">
      {/* Left: DAW readouts */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className={['w-1.5 h-1.5 rounded-full shrink-0', allDone ? 'bg-[#FF5500]' : 'bg-[#1A1A1A]'].join(' ')} />
          <span className="text-[8px] font-mono uppercase tracking-wider text-[#333]">
            {allDone ? 'MIDI Ready' : 'Awaiting'}
          </span>
        </div>

        <div className="w-px h-3 bg-[#1A1A1A]" />

        <div className="flex items-center gap-3">
          <Readout label="BPM"  value={bpm} />
          <Readout label="Key"  value={musicalKey} />
          <Readout label="Sig"  value={timeSignature} />
        </div>
      </div>

      {/* Right: Send button */}
      <motion.button
        onClick={allDone ? onSend : undefined}
        disabled={!allDone}
        whileTap={allDone ? { scale: 0.96 } : {}}
        animate={allDone ? {
          boxShadow: [
            '0 0 0px 0px rgba(255,85,0,0)',
            '0 0 18px 4px rgba(255,85,0,0.35)',
            '0 0 0px 0px rgba(255,85,0,0)',
          ],
        } : { boxShadow: '0 0 0px 0px rgba(255,85,0,0)' }}
        transition={allDone ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
        className={[
          'flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors',
          allDone
            ? 'bg-[#FF5500] text-black hover:bg-[#FF7733] cursor-pointer'
            : 'bg-transparent border border-[#141414] text-[#222] cursor-not-allowed',
        ].join(' ')}
      >
        <Zap size={10} />
        Send MIDI to DAW
      </motion.button>
    </footer>
  )
}

function Readout({ label, value }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[7px] font-mono uppercase tracking-wider text-[#2A2A2A]">{label}</span>
      <span className="text-[10px] font-mono text-[#555]">{value}</span>
    </div>
  )
}
