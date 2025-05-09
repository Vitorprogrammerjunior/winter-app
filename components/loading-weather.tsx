"use client"

import { motion } from "framer-motion"

export default function LoadingWeather() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
        <div className="h-10 w-full md:w-64 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="mt-6">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-md mb-4 animate-pulse" />

            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"
                  initial={{ opacity: 0.5, y: 10 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <motion.div
            className="h-full bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse min-h-[400px]"
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </div>
    </div>
  )
}
