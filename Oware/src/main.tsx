import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PlayerTurnProvider } from './components/Game/GameComponents/PlayerTurn.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlayerTurnProvider>
    <App />
    </PlayerTurnProvider>
  </React.StrictMode>,
)
