'use client'

import { motion } from 'framer-motion'
import { Download, Smartphone, Globe, Github, ArrowRight, Lock, Cloud, ShieldCheck } from 'lucide-react'

export function DownloadSection() {
  const platforms = [
    {
      name: 'Android',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Secure messaging on the go',
      color: 'from-emerald-500 to-cyan-500',
      downloadUrl: '/downloads/blackhole-android.apk',
      action: 'androidDownload',
    },
    {
      name: 'iOS',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Native app for iPhone & iPad',
      color: 'from-violet-500 to-purple-500',
      downloadUrl: '#coming-soon',
      action: 'iosDownload',
    },
    {
      name: 'Web App',
      icon: <Globe className="w-6 h-6" />,
      description: 'Access anywhere, any device',
      color: 'from-rose-500 to-pink-500',
      downloadUrl: '/app',
      action: 'webDownload',
    },
  ]

  return (
    <section id="download" className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-emerald-600/10 to-cyan-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-8 relative">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Download & Get Started
          </h2>
          <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-medium">
            Choose your platform and experience the most secure messaging
          </p>
        </motion.div>

        {/* 3D Security visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[400px] mb-16"
        >
          <div className="h-full rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-center p-8"
            >
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Lock className="w-20 h-20 text-emerald-400" />
                </motion.div>
              </div>
              <p className="text-3xl font-bold text-white mb-3">Secure</p>
              <p className="text-gray-400 text-lg">Your data, your keys</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
                <span className="font-semibold">End-to-End Encrypted</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Download buttons */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm rounded-3xl group">
                <div className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${platform.color} flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl text-white`}
                  >
                    {platform.icon}
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3">{platform.name}</h3>
                  <p className="text-gray-400 text-lg mb-6">{platform.description}</p>
                  
                  <motion.a
                    href={platform.downloadUrl}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                    <span>Get {platform.name}</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Universal Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mb-16"
        >
          <motion.a
            href="/downloads"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 border-2 border-white/10"
          >
            <Cloud className="w-6 h-6" />
            <span>All Downloads</span>
            <Download className="w-6 h-6" />
          </motion.a>
        </motion.div>

        {/* GitHub Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.a
            href="https://github.com/webspoilt/blackhole_in_space"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-4 bg-[#24292f] hover:bg-[#1a1d2e] text-white font-bold text-xl px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 border-2 border-white/20"
          >
            <Github className="w-7 h-7" />
            <span>View on GitHub</span>
            <ArrowRight className="w-6 h-6" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
