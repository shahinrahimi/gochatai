import { Routes, Route } from 'react-router-dom'
import AppLayout from './global/AppLayout'
import ChatLayout from './global/ChatLayout'
import CompletionLayout from './global/CompletionLayout'
import Chat from '@/pages/Chat'
import Completion from './pages/Completion'
import NotFoundPage from '@/pages/NotFoundPage'


import './App.css'
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />} >
        <Route index path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/completion" element={<Completion />} /> 
        <Route path="/completion/:id" element={<Completion />} />
      </Route>
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App 
