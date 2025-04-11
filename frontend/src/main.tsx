import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { ConverationProvider } from './context/ConversationContext.tsx'
import { CompletionProvider } from './context/CompletionContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
    <CompletionProvider>
        <ConverationProvider>
          <App />
        </ConverationProvider>
      </CompletionProvider>
    </StrictMode>
  </BrowserRouter>
,
)
