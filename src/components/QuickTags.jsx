import { motion } from 'framer-motion'
import { QUICK_TAGS } from '../data/tags'

export default function QuickTags({ selected, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#444]">
        Quick Tags
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_TAGS.map((tag) => {
          const active = selected.includes(tag)
          return (
            <motion.button
              key={tag}
              onClick={() => onToggle(tag)}
              whileTap={{ scale: 0.93 }}
              className={[
                'px-2.5 py-1 rounded-full text-[10px] font-mono border transition-colors duration-100 leading-none',
                active
                  ? 'border-[#FF5500] text-[#FF5500] bg-[#FF5500]/10'
                  : 'border-[#2A2A2A] text-[#606060] hover:border-[#444] hover:text-[#999]',
              ].join(' ')}
            >
              {tag}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
