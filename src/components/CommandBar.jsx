export default function CommandBar({ value, onChange, onGenerate, isGenerating }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && e.metaKey && !isGenerating) onGenerate()
  }

  return (
    <div className="px-3 pt-3 pb-2 bg-[#1E1E1E] shrink-0">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="I want a track in the style of Bad Bunny or Rihanna, with piano and R&B vibes, original and with drums like caribbean zouk."
        aria-label="Track description prompt"
        rows={3}
        className="w-full bg-[#141414] border border-[#444] rounded px-3 py-2.5 text-[12px] text-[#D0D0D0] placeholder-[#444] outline-none resize-none leading-relaxed focus:border-[#FF6600] transition-colors"
      />
    </div>
  )
}
