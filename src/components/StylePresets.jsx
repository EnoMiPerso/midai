import { motion } from 'framer-motion'
import { STYLE_PRESETS } from '../data/presets'

export default function StylePresets({ selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#444]">
        Style Presets
      </p>
      <div className="flex flex-col gap-1">
        {STYLE_PRESETS.map((preset, i) => {
          const active = selectedId === preset.id
          return (
            <motion.button
              key={preset.id}
              onClick={() => onSelect(preset)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              whileHover={{ x: 2 }}
              className={[
                'flex items-start gap-2.5 w-full text-left px-2.5 py-2 border-l-2 transition-all duration-150',
                active
                  ? 'border-l-[#FF5500] bg-[#FF5500]/8'
                  : 'border-l-transparent hover:border-l-[#333] hover:bg-[#161616]',
              ].join(' ')}
            >
              <span className="text-[14px] leading-none mt-0.5 shrink-0">{preset.icon}</span>
              <div className="min-w-0">
                <p className={[
                  'text-[11px] font-bold leading-tight truncate',
                  active ? 'text-[#FF5500]' : 'text-[#DDDDDD]',
                ].join(' ')}>
                  {preset.name}
                </p>
                <p className="text-[9px] text-[#555] mt-0.5 font-mono leading-tight">
                  {preset.tags.join(' · ')}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
