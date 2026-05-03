import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function AppHeader({ prompt, onChange, onGenerate, isGenerating }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !isGenerating) onGenerate()
  }

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-[#1C1C1C] shrink-0">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 bg-[#FF5500] flex items-center justify-center">
          <span className="text-black font-black text-[13px] leading-none">S</span>
        </div>
        <span className="text-[#EEEEEE] font-black text-[13px] tracking-[0.12em] uppercase">
          Sona
        </span>
      </div>

      <div className="w-px h-5 bg-[#222] shrink-0" />

      <div className={[
        'flex items-center gap-2 flex-1 border-b transition-colors duration-150 pb-0.5',
        isGenerating ? 'border-[#FF5500]/50' : 'border-[#2A2A2A] focus-within:border-[#FF5500]',
      ].join(' ')}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your track…"
          aria-label="Track description"
          className="flex-1 bg-transparent text-[12px] text-[#CCCCCC] placeholder-[#333] outline-none font-mono"
        />
      </div>

      <motion.button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        whileTap={!isGenerating && prompt.trim() ? { scale: 0.95 } : {}}
        className={[
          'shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] transition-colors',
          isGenerating || !prompt.trim()
            ? 'text-[#333] cursor-not-allowed'
            : 'text-[#FF5500] hover:text-[#FF7733]',
        ].join(' ')}
      >
        {isGenerating ? 'Working…' : 'Generate'}
        {!isGenerating && <ArrowRight size={11} />}
      </motion.button>
    </header>
  )
}
