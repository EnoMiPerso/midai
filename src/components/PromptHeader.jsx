import { Sparkles } from 'lucide-react'

export default function PromptHeader({ value, onChange, onGenerate, isGenerating }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !isGenerating) onGenerate()
  }

  return (
    <header className="flex items-center gap-2 px-4 py-3 border-b border-[#3A3A3A] bg-[#242424] shrink-0">
      <div className="flex items-center gap-2 flex-1 bg-[#1A1A1A] border border-[#444] rounded px-3 py-2 focus-within:border-[#FF6600] transition-colors">
        <Sparkles size={14} className="text-[#FF6600] shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your track…"
          aria-label="Track description prompt"
          className="flex-1 bg-transparent text-[12px] text-[#E0E0E0] placeholder-[#555] outline-none"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !value.trim()}
        aria-label="Generate stems"
        className={[
          'shrink-0 px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all',
          isGenerating || !value.trim()
            ? 'bg-[#3A3A3A] text-[#666] cursor-not-allowed'
            : 'bg-[#FF6600] hover:bg-[#FF8833] text-black',
        ].join(' ')}
      >
        {isGenerating ? 'Generating…' : 'Generate'}
      </button>
    </header>
  )
}
