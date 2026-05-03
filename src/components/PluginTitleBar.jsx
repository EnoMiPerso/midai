import { Settings, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import MidaiLogo from './MidaiLogo'

const PRESETS = ['Init Patch', 'Latin Vibes', 'Dark R&B', 'Trap Latin', 'Neo-Soul', 'Drill Wave']

export default function PluginTitleBar({ presetIndex, onPresetPrev, onPresetNext, dawConnected }) {
  return (
    <div className="flex items-center h-11 px-3 shrink-0 border-b border-[#111] bg-[#050505] select-none">
      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <MidaiLogo size={20} />
        <span className="text-[#EEEEEE] font-black text-[13px] tracking-[0.14em] uppercase">
          Midai
        </span>
        <span className="text-[#2A2A2A] text-[9px] font-mono mt-0.5">v0.1</span>
      </div>

      <div className="w-px h-4 bg-[#1A1A1A] mx-3 shrink-0" />

      {/* Preset navigator */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPresetPrev}
          aria-label="Previous preset"
          className="w-5 h-5 flex items-center justify-center text-[#333] hover:text-[#888] transition-colors"
        >
          <ChevronLeft size={13} />
        </button>
        <span className="text-[10px] font-mono text-[#777] w-24 text-center truncate">
          {PRESETS[presetIndex % PRESETS.length]}
        </span>
        <button
          onClick={onPresetNext}
          aria-label="Next preset"
          className="w-5 h-5 flex items-center justify-center text-[#333] hover:text-[#888] transition-colors"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="flex-1" />

      {/* DAW connection status */}
      <div className="flex items-center gap-1.5 mr-3">
        <div className={[
          'w-1.5 h-1.5 rounded-full',
          dawConnected ? 'bg-[#FF5500]' : 'bg-[#2A2A2A]',
        ].join(' ')} />
        <span className="text-[9px] font-mono text-[#444] uppercase tracking-wider">
          {dawConnected ? 'Ableton Live 12' : 'No DAW'}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button aria-label="Settings" className="w-7 h-7 flex items-center justify-center text-[#333] hover:text-[#888] transition-colors">
          <Settings size={12} />
        </button>
        <button aria-label="Help" className="w-7 h-7 flex items-center justify-center text-[#333] hover:text-[#888] transition-colors">
          <HelpCircle size={12} />
        </button>
      </div>
    </div>
  )
}
