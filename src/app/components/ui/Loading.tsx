'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black text-white z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-2xl font-bold">Loading...</div>
    </motion.div>
  )
}