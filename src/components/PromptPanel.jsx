import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { QUICK_TAGS } from '../data/tags'
import { STYLE_PRESETS } from '../data/presets'

export default function PromptPanel({
  prompt, onChange, onGenerate, isGenerating,
  activeTags, onTagToggle,
  activePresetId, onPresetSelect,
}) {
  function handleKey(e) {
    if (e.key === 'Enter' && e.metaKey && !isGenerating) onGenerate()
  }

  const canGenerate = (prompt.trim() || activeTags.length > 0) && !isGenerating

  return (
    <aside className="w-48 shrink-0 flex flex-col border-r border-[#111] bg-[#060606] overflow-hidden">
      {/* Prompt */}
      <div className="flex flex-col gap-2 p-3 border-b border-[#111]">
        <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#333]">Prompt</p>
        <textarea
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your track or pick a preset…"
          aria-label="Track description"
          rows={4}
          className="w-full bg-[#0C0C0C] border border-[#1A1A1A] text-[10px] text-[#CCCCCC] placeholder-[#2A2A2A] outline-none resize-none leading-relaxed font-mono p-2 focus:border-[#FF5500]/40 transition-colors"
        />
        <motion.button
          onClick={onGenerate}
          disabled={!canGenerate}
          whileTap={canGenerate ? { scale: 0.97 } : {}}
          className={[
            'flex items-center justify-center gap-1.5 w-full py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all',
            canGenerate
              ? 'bg-[#FF5500] text-black hover:bg-[#FF7733]'
              : 'bg-[#111] text-[#2A2A2A] cursor-not-allowed border border-[#1A1A1A]',
          ].join(' ')}
        >
          <Zap size={10} />
          {isGenerating ? 'Generating…' : 'Generate MIDI'}
        </motion.button>
      </div>

      {/* Quick Tags */}
      <div className="flex flex-col gap-2 p-3 border-b border-[#111]">
        <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#333]">Quick Tags</p>
        <div className="flex flex-wrap gap-1">
          {QUICK_TAGS.map((tag) => {
            const on = activeTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={[
                  'px-2 py-0.5 rounded-full text-[8px] font-mono border transition-colors leading-tight',
                  on
                    ? 'border-[#FF5500] text-[#FF5500] bg-[#FF5500]/10'
                    : 'border-[#1E1E1E] text-[#444] hover:border-[#333] hover:text-[#777]',
                ].join(' ')}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Style Presets */}
      <div className="flex flex-col gap-1.5 p-3 flex-1 overflow-y-auto">
        <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#333] shrink-0">
          Style Presets
        </p>
        {STYLE_PRESETS.map((preset, i) => {
          const active = activePresetId === preset.id
          return (
            <motion.button
              key={preset.id}
              onClick={() => onPresetSelect(preset)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ x: 2 }}
              className={[
                'flex items-start gap-2 w-full text-left py-1.5 px-2 border-l-2 transition-all duration-100',
                active
                  ? 'border-l-[#FF5500] bg-[#FF5500]/6'
                  : 'border-l-transparent hover:border-l-[#222] hover:bg-[#0E0E0E]',
              ].join(' ')}
            >
              <span className="text-[11px] leading-none mt-0.5 shrink-0">{preset.icon}</span>
              <div className="min-w-0">
                <p className={['text-[10px] font-bold truncate leading-tight', active ? 'text-[#FF5500]' : 'text-[#CCCCCC]'].join(' ')}>
                  {preset.name}
                </p>
                <p className="text-[8px] text-[#333] font-mono mt-0.5 leading-tight">
                  {preset.tags.join(' · ')}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </aside>
  )
}
