import { Routes, Route } from 'react-router-dom'
import ChatLayout from './global/ChatLayout'
import CompletionLayout from './global/CompletionLayout'
import Chat from '@/pages/Chat'
import Completion from './pages/Completion'
import NotFoundPage from '@/pages/NotFoundPage'


import './App.css'
function App() {
  return (
    <Routes>
      <Route path="/chat" element={<ChatLayout />} >
        <Route index element={<Chat />} />
        <Route path=":id" element={<Chat />} />
      </Route>
      <Route path="/completion" element={<CompletionLayout />} >
        <Route index element={<Completion />} />
        <Route path=":id" element={<Completion />} />
      </Route> 
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
