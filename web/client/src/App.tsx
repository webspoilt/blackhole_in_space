import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Contacts from './pages/Contacts'
import Settings from './pages/Settings'
import Identity from './pages/Identity'
import { useCryptoStore } from './stores/cryptoStore'
import { useEffect } from 'react'

function App() {
  const { initialize } = useCryptoStore()

  useEffect(() => {
    // Initialize crypto core on app start
    initialize()
  }, [initialize])

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat/:contactId?" element={<Chat />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="identity" element={<Identity />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
