import { Routes, Route } from 'react-router-dom'
import ChatLayout from './global/ChatLayout'
import Chat from '@/pages/Chat'
import CompletionLab from '@/pages/CompletionLab'
import NotFoundPage from '@/pages/NotFoundPage'


import './App.css'
function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatLayout />} >
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:id" element={<Chat />} />
      </Route>
      <Route path="/completion-lab" element={<CompletionLab />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
