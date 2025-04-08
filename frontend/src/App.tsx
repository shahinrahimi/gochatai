import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import ChatLab from '@/pages/ChatLab'
import Chat from '@/pages/Chat'
import CompletionLab from '@/pages/CompletionLab'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'


import './App.css'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<HomePage />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:id" element={<Chat />} />
        <Route path="completion" element={<CompletionLab />} />
      </Route>
      <Route path="/chat-lab" element={<ChatLab />} />
      <Route path="/completion-lab" element={<CompletionLab />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
