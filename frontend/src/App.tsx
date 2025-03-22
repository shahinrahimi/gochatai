import { Routes, Route } from 'react-router-dom'
import Chat from '@/pages/Chat'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

import './App.css'
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
