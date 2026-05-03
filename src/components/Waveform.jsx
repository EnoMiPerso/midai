import { motion } from 'framer-motion'

const PATHS = {
  Kick:  'M 4 52 C 12 52 16 4 24 4 C 32 4 36 44 48 48 C 60 52 76 52 92 52',
  Snare: 'M 4 28 L 8 14 L 12 40 L 16 10 L 20 44 L 24 18 L 28 36 L 32 22 L 36 38 L 40 30 L 44 34 L 50 32 L 56 33 L 64 32 L 80 32 L 92 32',
  Hats:  'M 4 32 L 10 18 L 14 42 L 18 20 L 22 40 L 26 24 L 30 38 L 34 28 L 38 36 L 42 26 L 46 36 L 50 28 L 54 36 L 58 28 L 62 36 L 66 30 L 70 34 L 74 30 L 78 34 L 82 32 L 88 32 L 92 32',
  Bass:  'M 4 32 C 16 32 16 10 28 10 C 40 10 40 54 52 54 C 64 54 64 10 76 10 C 88 10 88 32 92 32',
  Synth: 'M 4 32 L 4 14 L 20 14 L 20 50 L 36 50 L 36 14 L 52 14 L 52 50 L 68 50 L 68 14 L 84 14 L 84 50 L 92 50',
  Piano: 'M 4 38 C 14 38 14 22 24 22 C 34 22 34 44 44 38 C 54 32 54 18 64 24 C 74 30 74 44 84 38 C 88 35 90 33 92 32',
  FX:    'M 4 32 C 8 20 12 44 16 28 C 20 12 24 48 28 32 C 32 16 36 48 40 24 C 44 0 48 56 52 32 C 56 8 60 52 64 36 C 68 20 72 44 76 32 C 80 20 86 38 92 32',
  Vox:   'M 4 32 C 12 32 12 20 22 20 C 32 20 32 44 42 38 C 52 32 52 22 62 26 C 72 30 72 38 82 34 C 87 32 90 32 92 32',
}

function Spinner() {
  return (
    <motion.div
      className="w-6 h-6 rounded-full border-2 border-[#333] border-t-[#FF6600]"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export default function Waveform({ name, isGenerating, progress }) {
  const path = PATHS[name] ?? PATHS.FX

  if (isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#181818] rounded">
        <Spinner />
      </div>
    )
  }

  if (progress === 0) {
    return <div className="flex-1 bg-[#181818] rounded" />
  }

  return (
    <div className="flex-1 bg-[#181818] rounded overflow-hidden flex items-center justify-center p-2">
      <svg viewBox="0 0 96 56" className="w-full h-full" preserveAspectRatio="none">
        <motion.path
          d={path}
          fill="none"
          stroke="#FF6600"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(255,102,0,0.15)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
    </div>
  )
}
