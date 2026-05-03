import { motion } from 'framer-motion'

export default function ActionFooter({ allDone, onExport }) {
  return (
    <footer className="shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-[#1C1C1C] bg-[#070707]">
      <div className="flex items-center gap-2">
        <div className={['w-1.5 h-1.5 rounded-full', allDone ? 'bg-[#FF5500]' : 'bg-[#2A2A2A]'].join(' ')} />
        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#333]">
          {allDone ? 'All stems ready' : 'Awaiting generation'}
        </span>
      </div>

      <motion.button
        onClick={allDone ? onExport : undefined}
        disabled={!allDone}
        animate={allDone ? {
          boxShadow: [
            '0 0 0px 0px rgba(255,85,0,0)',
            '0 0 20px 4px rgba(255,85,0,0.4)',
            '0 0 0px 0px rgba(255,85,0,0)',
          ],
        } : { boxShadow: '0 0 0px 0px rgba(255,85,0,0)' }}
        transition={allDone ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : {}}
        whileTap={allDone ? { scale: 0.97 } : {}}
        className={[
          'px-5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors',
          allDone
            ? 'bg-[#FF5500] text-black hover:bg-[#FF7733] cursor-pointer'
            : 'bg-transparent border border-[#1C1C1C] text-[#2A2A2A] cursor-not-allowed',
        ].join(' ')}
      >
        Export Stems to DAW
      </motion.button>
    </footer>
  )
}
